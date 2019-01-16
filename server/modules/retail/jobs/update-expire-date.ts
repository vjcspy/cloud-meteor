import * as _ from "lodash";
import * as moment from 'moment';
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {LicenseCollection} from "../collections/licenses";
import {ExpireDateCollection} from "../collections/expiredate";
import {Expiredate} from "../models/expiredate";
import {User} from "../../account/models/user";
import {PricingCollection} from "../collections/prices";
import {USER_EMAIL_TEMPLATE} from "../../account/api/email-interface";
import {BRAINTREE_ENVIROMENT} from "../../sales-payment-braintree/etc/braintree.config";
import * as listData from "../../../../list-email.json";

SyncedCron.add({
                    name: "update expire date(00:05 everyday)",
                    schedule: function (parser) {
                        return parser.text(' at 00:05 am');
                    },
                    job: function () {
                            updateExpireDate();
                            sendEmailExpireDate();
                    }
                });
               export const updateExpireDate = () => {
                    let expire_date: any[] =[];
                    const licenses = LicenseCollection.find().fetch();
                    const pricingCollection = PricingCollection.find().fetch();
                    const listExpires = ExpireDateCollection.find().fetch();
                    const user      = OM.create<User>(User);
                    let expire = OM.create<Expiredate>(Expiredate);
                    // ExpireDateCollection.remove({});
                   _.forEach(licenses, (l) => {
                        if (!!l['shop_owner_id'] && l['status'] == 1){
                            user.loadById(l['shop_owner_id']);

                            _.forEach(l['has_product'], (h) => {
                                const exist = _.find(listExpires, le => le['license_id'] === l['_id'] && le['product_id'] === h['product_id']);
                                let expireDate  = moment(h['expiry_date'], 'YYYY-MM-DD');
                                let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                                let diff        = expireDate.diff(currentTime,'days');
                                if (h['status'] == 1 && diff < 3) {
                                    if(!exist) {
                                        let pricing = _.find(pricingCollection, (p) => p['_id']==h['pricing_id']);
                                        const newExp = {
                                            license_id : l['_id'],
                                            email: user.getEmail(),
                                            shop_owner_username: user.getUsername(),
                                            product_id: h['product_id'],
                                            purchase_date: h['purchase_date'],
                                            expiry_date: h['expiry_date'],
                                            plan_id: h['plan_id'],
                                            pricing_code: pricing['code'],
                                            pricing_id: pricing['_id']
                                        };
                                        expire.addData(newExp).save();
                                    } else {
                                        expire.loadById(exist['_id']);
                                        expire.setData('purchase_date', h['purchase_date'])
                                              .setData('expiry_date', h['expiry_date'])
                                              .setData('plan_id', h['plan_id'])
                                              .setData('pricing_code', h['pricing_code'])
                                              .setData('pricing_id', h['pricing_id'])
                                              .save();
                                    }

                                } else {
                                    if (exist) {
                                        expire.loadById(exist['_id']);
                                        expire.remove();
                                    }
                                }
                            })
                        } else {
                            const exist = _.find(listExpires, le => le['license_id'] === l['_id']);
                            if (exist) {
                                expire.loadById(exist['_id']);
                                expire.remove();
                            }
                        }
                    });
                };
               export const sendEmailExpireDate = () => {
                   const expireDate = ExpireDateCollection.find().fetch();
                   const user     = OM.create<User>(User);
                   let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                   let listExp = [];
                   _.forEach(expireDate, (e) => {
                          let expireDate  = moment(e['expiry_date'], 'YYYY-MM-DD');
                          let diff        = expireDate.diff(currentTime,'days');
                          if (diff === 1) {
                              if(e['pricing_code'] === "cpos_trial"){
                                  user.sendData(e, USER_EMAIL_TEMPLATE.TRIAL_EXPIRED);
                              } else {
                                  listExp.push(e['shop_owner_username']);
                                  user.sendData(e, USER_EMAIL_TEMPLATE.EXPIRED);
                              }
                          }
                      });
                   if(listExp.length > 0 && BRAINTREE_ENVIROMENT !== 'SANDBOX') {
                       let sendData = {
                           listUser: listExp
                       };
                       let listSendEmails = [];
                       var fs = require("fs");
                       if(!fs.existsSync('../../list-email.json')) {
                           const content = {
                               emails: [],
                               sendExp: []
                           };
                           const data = listData ? listData : content;
                           fs.writeFileSync("../../list-email.json", JSON.stringify(data));
                       }
                       let emailData = fs.readFileSync('../../list-email.json');
                       let list = JSON.parse(emailData);
                       if (_.isArray(list['sendExp'])) {
                           listSendEmails = _.concat(listSendEmails,list['sendExp']);
                       }
                       _.forEach(listSendEmails, (email) => {
                           sendData['email'] = email;
                           user.sendData(sendData,USER_EMAIL_TEMPLATE.LIST_EXPIRED);
                       });
                   }
               };