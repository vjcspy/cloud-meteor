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

SyncedCron.add({
                    name: "update expire date(00:00 everyday)",
                    schedule: function (parser) {
                        return parser.text(' at 00:00 am ');
                    },
                    job: function () {
                            updateExpireDate();
                            // sendEmailExpireDate();


                    }
                });
               export const updateExpireDate = () => {
                    let expire_date: any[] =[];
                    const licenses = LicenseCollection.find().fetch();
                    const pricingCollection = PricingCollection.find().fetch();
                    const user      = OM.create<User>(User);
                    let expire = OM.create<Expiredate>(Expiredate);
                    ExpireDateCollection.remove({});
                   _.forEach(licenses, (l) => {
                        if (!!l['shop_owner_id'] && l['status'] == 1){
                            user.loadById(l['shop_owner_id']);

                            _.forEach(l['has_product'], (h) => {
                                let pricing = _.find(pricingCollection, (p) => p['_id']==h['pricing_id']);
                                let expireDate  = moment(h['expiry_date'], 'YYYY-MM-DD');
                                let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                                let diff        = expireDate.diff(currentTime,'days');
                                if (h['status'] == 1 && 0 < diff  && diff < 3) {
                                    expire_date.push({
                                        license_id : l['_id'],
                                        email: user.getEmail(),
                                        shop_owner_username: user.getUsername(),
                                        product_id: h['product_id'],
                                        purchase_date: h['purchase_date'],
                                        expiry_date: h['expiry_date'],
                                        pricing_code: pricing['code']
                                    });

                                }
                            })
                        }
                    });

                   expire.createrExpireDate(expire_date).then(()=>{},(e)=>{console.log(e)});
                };
               export const sendEmailExpireDate = () => {
                      const expireDate = ExpireDateCollection.find().fetch();
                        const user     = OM.create<User>(User);
                      _.forEach(expireDate, (e) => {
                          if(e['pricing_code'] === "cpos_trial"){
                              user.sendData(e, USER_EMAIL_TEMPLATE.TRIAL_EXPIRED);
                          } else {
                            user.sendData(e, USER_EMAIL_TEMPLATE.EXPIRED);
                          }
                      })
               };