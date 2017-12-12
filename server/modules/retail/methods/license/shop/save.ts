import * as _ from "lodash";
import {OM} from "../../../../../code/Framework/ObjectManager";
import {LicenseHelper} from "../../../helper/license";
import {User} from "../../../../account/models/user";

new ValidatedMethod({
                        name: "license.shop_save_product_license",
                        validate: function () {
                        },
                        run: function (licenseHasProduct: Object) {
                            return new Promise((resolve, reject) => {
                                const licenseHelper = OM.create<LicenseHelper>(LicenseHelper);
                                let user: User      = OM.create<User>(User).loadById(this.userId);
                                const license       = licenseHelper.getLicenseOfUser(user);
            
                                let hasProduct = _.map(license.getProducts(), (l) => {
                                    if (l['product_id'] === licenseHasProduct['product_id']) {
                                        l['base_url'] = _.chain(l['base_url'])
                                                         .filter((b) => _.find(licenseHasProduct['base_url'], (_b) => _b['url'] === b['url']))
                                                         .map((b) => {
                                                             const newData = _.find(licenseHasProduct['base_url'], (_b) => _b['url'] === b['url']);
                                                             b['in_use']   = newData['in_use'];
                        
                                                             return b;
                                                         })
                                                         .value();
                    
                                        _.forEach(licenseHasProduct['base_url'], (baseUrl) => {
                                            if (baseUrl['request'] === true) {
                                                l['base_url'].push({
                                                                       'in_use': true,
                                                                       'is_valid': false,
                                                                       'url': baseUrl['url'],
                                                                       'api_version': ''
                                                                   });
                                            }
                                        });
                                    }
                
                                    return l;
                
                                });
            
                                license.setData('has_product', hasProduct)
                                       .save()
                                       .then(() => resolve(), (err) => reject(err));
                            });
                        }
                    });