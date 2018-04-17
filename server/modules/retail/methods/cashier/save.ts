import * as $q from "q";
import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../models/license";
import {UserLicense} from "../../models/userlicense";
import {Role} from "../../../account/models/role";

new ValidatedMethod({
                        name: "cashier.save",
                        validate: function () {
                        },
                        run: function (cashierData: Object) {
                            let defer = $q.defer();
                            let userModel: User = OM.create<User>(User).loadById(this.userId);
                            if (!userModel.hasLicense()) {
                                throw new Meteor.Error("license.delete_role", "can_not_find_license");
                            }
                            let license_id       = userModel.getLicenses()[0]['license_id'];
                            let license: License = OM.create<License>(License).load(license_id);
        
                            let cashier: User = OM.create<User>(User);
                            if (!!cashierData['_id']) {
                                if (!!cashierData['password']) {
                                    Accounts.setPassword(cashierData['_id'], cashierData['password'], {logout: false});
                                }
                                cashier.loadById(cashierData['_id']);
            
                            } else {
                                // register new cashier
                                let newCashierId = Accounts.createUser({
                                                                           username: cashierData['username'],
                                                                           email: cashierData['email'],
                                                                           password: !!cashierData['password'] ? cashierData['password'] : User.DEFAULT_PASSWORD_USER,
                                                                       });
                                !cashierData['password'] ? Accounts.sendEnrollmentEmail(newCashierId) : '';
            
                                cashier.loadById(newCashierId);
                            }
        
                            if (!cashier.getId()) {
                                throw new Meteor.Error('cashier.save', 'can_not_find_cashier');
                            }
        
                            if (cashier.isShopOwner()) {
                                throw  new Meteor.Error('cashier.save', 'sorry_this_method_not_support_update_shop_owner_data');
                            }
        
                            let profile           = cashier.getProfile() || {};
                            profile['first_name'] = cashierData['profile']['first_name'];
                            profile['last_name']  = cashierData['profile']['last_name'];
                            profile['phone']      = cashierData['profile']['phone'];
                            cashier.setData('profile', profile)
                                   .save()
                                   .then(() => {
                                       return UserLicense.attach(cashier, license, User.LICENSE_PERMISSION_CASHIER, cashierData['cashier_products'], {
                                           shop_role: cashierData['role'],
                                           status: parseInt(cashierData['status'])
                                       });
                                   })
                                   .then(() => {
                                       return defer.resolve();
                                   })
                                   .catch((err) => defer.reject(err));
        
                            return defer.promise;
                        }
                    });
