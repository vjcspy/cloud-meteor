import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../accounts/models/user";
import {Role} from "../../../accounts/api/role";
import {Product} from "../../models/product";

new ValidatedMethod({
                        name: "product.remove_product",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("product.edit_product_error", "Access denied");
                            }
                        },
                        run: function (data: string) {
                            let defer     = $q.defer();
                            const product = OM.create<Product>(Product).loadById(data['id']);
                            if (!product) {
                                throw new Meteor.Error("product.error_edit", "Product Not Found");
                            }
                            product.remove().then(() => defer.resolve(), (err) => defer.reject(err));
                            return defer.promise;
                        }
                    });