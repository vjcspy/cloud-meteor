import * as _ from "lodash";
import * as moment from 'moment';
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {LicenseCollection} from "../collections/licenses";
import {ExpireDateCollection} from "../collections/expiredate";
import {Expiredate} from "../models/expiredate";
import {User} from "../../account/models/user";

SyncedCron.add({
                    name: "update expire date(00:00 everyday)",
                    schedule: function (parser) {
                        return parser.text(' at 00:00 am ');
                    },
                    job: function () {
                            updateExpireDate();

                    }
                });
               export const updateExpireDate = () => {
                    let expire_date: any[] =[];
                    const licenses = LicenseCollection.find().fetch();
                    const user      = OM.create<User>(User);
                    let expire = OM.create<Expiredate>(Expiredate);
                    _.forEach(licenses, (l) => {
                        if (!!l['shop_owner_id']){
                            user.loadById(l['shop_owner_id']);

                            _.forEach(l['has_product'], (h) => {
                                let expireDate  = moment(h['expiry_date'], 'YYYY-MM-DD');
                                let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                                let diff        = expireDate.diff(currentTime,'days');
                                if (diff < 3) {
                                    ExpireDateCollection.remove({});
                                    expire_date.push({
                                        license_id : l['_id'],
                                        email: user.getEmail(),
                                        shop_owner_username: user.getUsername(),
                                        product_id: h['product_id'],
                                        purchase_date: h['purchase_date'],
                                        expiry_date: h['expiry_date']
                                    });

                                }
                            })
                        }
                    });
                    expire.createrExpireDate(expire_date).then(()=>{},(e)=>{console.log(e)});
                };