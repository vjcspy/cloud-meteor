import * as $q from "q";
import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../models/license";
import {UserLicense} from "../../models/userlicense";
import {Role} from "../../../account/models/role";
import {SupportToken} from "../../common/support_token";
import {CodeLoginsCollection} from "../../collections/code-login-collection";

new ValidatedMethod({
                        name: "cashier.save",
                        validate: function () {
                        },
                        run: function (cashierData: Object) {
                            console.log(cashierData);
                            let defer = $q.defer();
                            let userModel: User = OM.create<User>(User).loadById(this.userId);
                            if (!userModel.hasLicense()) {
                                throw new Meteor.Error("license.delete_role", "can_not_find_license");
                            }
                            let license_id       = userModel.getLicenses()[0]['license_id'];
                            let license: License = OM.create<License>(License).load(license_id);
                            const listCodeLogin = CodeLoginsCollection.find({'license_id': license_id}).fetch();
                            let cashier: User = OM.create<User>(User);
                            let profile           = cashier.getProfile() || {};
                            profile['first_name'] = cashierData['profile']['first_name'];
                            profile['last_name']  = cashierData['profile']['last_name'];
                            profile['phone']      = cashierData['profile']['phone'];
                            profile['country']    = cashierData['profile']['country'];
                            profile['created_by'] = Meteor.userId();
                            let pin_code = null;
                            let bar_code = null;
                            let code_information = null;
                            if (cashierData.hasOwnProperty('pin_code') ) {
                                pin_code = cashierData['pin_code'];
                            }
                            if (cashierData.hasOwnProperty('bar_code')) {
                                bar_code = cashierData['bar_code'];
                            }
                            if (cashierData.hasOwnProperty('code_information')) {
                                code_information = cashierData['code_information'];
                            }
                            if (!!cashierData['_id']) {
                                if (!!cashierData['password']) {
                                    Accounts.setPassword(cashierData['_id'], cashierData['password'], {logout: false});
                                }
                                cashier.loadById(cashierData['_id']);
            
                            } else {
                                //check duplicate pin code barcode
                                const list_license_duplicate = listCodeLogin.filter(temp => ((temp['pin_code'] === pin_code || temp['bar_code'] === bar_code)));
                                if (list_license_duplicate && list_license_duplicate.length > 0) {
                                    throw new Meteor.Error('Invalid pin code or barcode. Please try again!');
                                }
                                // register new cashier
                                let newCashierId = Accounts.createUser({
                                                                           username: cashierData['username'],
                                                                           email: cashierData['email'],
                                                                           password: !!cashierData['password'] ? cashierData['password'] : User.DEFAULT_PASSWORD_USER,
                                                                           profile: profile
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

                            cashier.setData('profile', profile)
                                   .save()
                                   .then(() => {
                                       return UserLicense.attach(cashier, license, User.LICENSE_PERMISSION_CASHIER, cashierData['cashier_products'], {
                                           shop_role: cashierData['role'],
                                           status: parseInt(cashierData['status'])
                                       });
                                   })
                                   .then(() => {
                                       SupportToken.updateCodeLogin(cashier.getData(),  cashierData['_id'],pin_code,bar_code, code_information);
                                   })
                                   .then(() => {
                                       return defer.resolve();
                                   })
                                   .catch((err) => defer.reject(err));


                            return defer.promise;
                        }
                    });
