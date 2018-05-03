import * as $q from "q";
import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";

new ValidatedMethod({
                        name: "user.save",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("user.edit_user_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer = $q.defer();
                            let user: User = OM.create<User>(User);
                            if (!!data['_id']) {
                                if (!!data['password']) {
                                    Accounts.setPassword(data['_id'], data['password'], {logout: false});
                                }
                                user.loadById(data['_id']);
                            } else {
                                // register new user
                                let newUserId = Accounts.createUser({
                                                                           username: data['username'],
                                                                           email: data['email'],
                                                                           password: !!data['password'] ? data['password'] : User.DEFAULT_PASSWORD_USER,
                                                                       });
                                !data['password'] ? Accounts.sendEnrollmentEmail(newUserId) : '';
    
                                user.loadById(newUserId);
                            }
    
                            if (!user.getId()) {
                                throw new Meteor.Error('user.save', 'can_not_find_user');
                            }
    
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
                                throw  new Meteor.Error('user.save', 'sorry_this_method_not_support_update_admin_data');
                            }
    
                            let profile           = user.getProfile() || {};
                            profile['first_name'] = data['profile']['first_name'];
                            profile['last_name']  = data['profile']['last_name'];
                            profile['phone']      = data['profile']['phone'];
                            user.setData('profile', profile)
                                   .save()
                                .then(() => {
                                return user.setRoles(data['roles']['cloud_group'],Role.GROUP_CLOUD);
                                })
                                   .then(() => {
                                       return defer.resolve();
                                   })
                                   .catch((err) => defer.reject(err));
    
                            return defer.promise;
                        }
                    });