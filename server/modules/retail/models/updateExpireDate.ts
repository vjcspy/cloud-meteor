import * as _ from "lodash";
import * as moment from 'moment';
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {LicenseCollection} from "../collections/licenses";
import {ExpireDateCollection} from "../collections/expiredate";
import {Expiredate} from "../models/expiredate";

    export const updateExpireDate = () => {
        let expire_date: any[] = [];
        ExpireDateCollection.remove({});
        const license = LicenseCollection.find().fetch();

        let expire = OM.create<Expiredate>(Expiredate);
        _.forEach(license, (l) => {
            _.forEach(l['has_product'], (h) => {
                let expireDate = moment(h['expiry_date'], 'YYYY-MM-DD');
                let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                let diff = expireDate.diff(currentTime, 'days');
                if (diff < 3) {
                    expire_date.push({
                        license_id: l['_id'],
                        shop_owner_id: l['shop_owner_id'],
                        shop_owner_username: l['shop_owner_username'],
                        product_id: h['product_id'],
                        purchase_date: h['purchase_date'],
                        expiry_date: h['expiry_date']
                    });

                }
            })
        });
        expire.createrExpireDate(expire_date).then(() => {
        }, (e) => {
            console.log(e)
        });
    };