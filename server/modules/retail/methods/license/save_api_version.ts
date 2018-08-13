import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../models/license";
import {Products} from "../../collections/products";

new ValidatedMethod({
                        name: "client.save_api_version",
                        validate: function () {
                        },
                        run: (data: Object) => {
                            if(!data.hasOwnProperty('license_key') || data['license_key'] === '') {
                                return;
                            }
                            const license: License = OM.create<License>(License).load(data['license_key'], 'key');
                            const product = Products.collection.findOne({"code": "xpos"});
                            const productId = product['_id'];
                            if (!license && !productId) {
                                throw new Meteor.Error("client.save_api_version", "can_not_find_license");
                            } else {
                                    let hasProduct = _.map(license.getProducts(), (l: any) => {
                                        if (l['product_id'] === productId) {
                                            let url = _.find(l['base_url'], (baseUrl) => {
                                                return baseUrl['url'] === data['url'];
                                            });
                                            if(!!url) {
                                                url['api_version'] = data['api_version'];
                                            } else {
                                                l['base_url'].push({
                                                                       'in_use': true,
                                                                       'is_valid': false,
                                                                       'url': data['url'],
                                                                       'api_version': data['api_version']
                                                                   });
                                            }
                                        }
                    
                                        return l;
                    
                                    });
                
                                    license.setData('has_product', hasProduct)
                                           .save();
                                
                            }
                        }
                    });


