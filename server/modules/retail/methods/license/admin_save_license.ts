import * as $q from 'q';
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {Stone} from "../../../../code/core/stone";
import {LicenseHelper} from "../../helper/license";

new ValidatedMethod({
                        name: "license.admin_save_license",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("license.create_license", "Access denied");
                            }
                        },
                        run: function (data: any) {
                            let defer                                = $q.defer();
                            const {license, licenseHasProduct, user} = data;
        
                            const userModel = OM.create<User>(User);
        
                            if (license['shop_owner_id'] === 'createNew') {
                                const newUserId = Accounts.createUser({
                                                                          username: user['username'],
                                                                          email: user['email'],
                                                                          password: User.DEFAULT_PASSWORD_USER,
                                                                          profile: {
                                                                              first_name: user['profile']['first_name'],
                                                                              last_name: user['profile']['last_name']
                                                                          }
                                                                      });
                                userModel.loadById(newUserId);
                            } else {
                                userModel.loadById(license['shop_owner_id']);
                            }
        
                            const $license = Stone.getInstance().s('$license') as LicenseHelper;
                            $license.saveLicenseByAdmin(license, userModel, licenseHasProduct)
                                    .then(() => defer.resolve(), (err) => defer.reject(err));
        
                            return defer.promise;
                        }
                    });
DDPRateLimiter.addRule({
                           userId: function (userId) {
                               return true;
                           },
                           type: "method",
                           name: "user.license.admin_save_license",
                       }, 1, 1000);
