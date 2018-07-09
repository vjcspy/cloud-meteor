import * as $q from "q";
import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";

new ValidatedMethod({
                        name: "user.save",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES , Role.AGENCY], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("user.edit_user_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer = $q.defer();
                            let user: User = OM.create<User>(User);
                            let profile           = user.getProfile() || {};
                            profile['first_name'] = data['profile']['first_name'];
                            profile['last_name']  = data['profile']['last_name'];
                            profile['phone']      = data['profile']['phone'];
                            profile['country']      = data['profile']['country'];
                            profile['created_by'] = Meteor.userId();
                            // Did you check user exist in system
                            // Case1 : existed       ==> reset password , email ==> Today systen just only support 1 user have - 1 email
                            // Case2 : do''nt exist  ==> create new user
                            if (!!data['_id']) {
                                if (!!data['password']) {
                                    Accounts.setPassword(data['_id'], data['password'], {logout: false});
                                }
                                if (!!data['email']) {
                                    if ( null != data['emails'][0]) {
                                        if (data['emails'][0]['address'] !== data['email']) {
                                            Accounts.addEmail(data['_id'], data['email'], false);
                                            Accounts.removeEmail(data['_id'], data['emails'][0]['address']);
                                        }
                                    }else {
                                        Accounts.addEmail(data['_id'], data['email'], false);
                                    }
                                }
                                user.loadById(data['_id']);
                            } else {
                                let newUserId = Accounts.createUser({
                                                                           username: data['username'],
                                                                           email: data['email'],
                                                                           password: !!data['password'] ? data['password'] : User.DEFAULT_PASSWORD_USER,
                                                                           profile: profile
                                                                       });
                                Accounts.sendEnrollmentEmail(newUserId);
                                user.loadById(newUserId);
                            }
                            if (!user.getId()) {
                                throw new Meteor.Error('user.save', 'can_not_find_user');
                            }
                            if (user.isInRoles([Role.SUPERADMIN], Role.GROUP_CLOUD)) {
                                throw  new Meteor.Error('user.save', 'sorry_this_method_not_support_update_super_admin_data');
                            }
                            user.setData('profile',profile)
                                .setData('take_care_by_agency',data['take_care_by_agency'])
                                .setData('agency',data['agency'])
                                .setData('customer_type', data["customer_type"])
                                .setData('company_name', data["company_name"])
                                .setData('url_customer_domain', data["url_customer_domain"])
                                .setData('last_date_trial', data["last_date_trial"])
                                .setData('submission_status', data["submission_status"])  // Waiting_For_Approval, Approved  , Rejected
                                .setData('history_customer_type', data["history_customer_type"])
                                .setData('assign_to_agency', data["assign_to_agency"])
                                .setData('created_by_user_id', Meteor.userId())
                                .save()
                                .then(() => {
                                    return user.setRoles(data['roles']['cloud_group'],Role.GROUP_CLOUD);})
                                .then(() => {
                                    return defer.resolve();
                                }).catch((err) => defer.reject(err));
                            return defer.promise;
                        }
                    });