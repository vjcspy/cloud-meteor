import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/api/role";
import {Product} from "../../models/product";
import * as _ from 'lodash';

new ValidatedMethod({
                        name: "product.save_product",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("product.create_product_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer         = $q.defer();
                            const productData = data['product'];
        
                            let productModel = OM.create<Product>(Product);
        
                            if (productData['_id']) {
                                productModel.loadById(productData['_id']);
                            }
        
                            if (!_.isArray(productData['versions']) || productData['versions'].length == 0) {
                                throw new Meteor.Error("Create Error", "Product need at least one version");
                            }
        
                            productModel.addData(productData)
                                        .save()
                                        .then(() => defer.resolve(), (err) => defer.reject(err));
        
                            return defer.promise;
                        }
                    });