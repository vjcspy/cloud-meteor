import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {SupportToken} from "../../common/support_token";

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
                            var user_id = ""
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
                                user_id = data['_id'];
                            } else {
                                let newUserId = Accounts.createUser({username: data['username'], email: data['email'], password: !!data['password'] ? data['password'] : User.DEFAULT_PASSWORD_USER, profile: profile});
                                Accounts.sendEnrollmentEmail(newUserId);
                                user.loadById(newUserId);
                                // Create pin code and bar-code
                                user_id = newUserId;
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
                                .setData('company_name', data["company_name"])
                                .setData('url_customer_domain', data["url_customer_domain"])
                                .setData('submission_status', data["submission_status"])  // Waiting_For_Approval, Approved  , Rejected
                                .setData('assign_to_agency', data["assign_to_agency"])
                                .setData('reject_reason', data["reject_reason"])
                                .setData('created_by_user_id', Meteor.userId())
                                .save()
                                .then(() => {
                                    return user.setRoles(data['roles']['cloud_group'],Role.GROUP_CLOUD);})
                                .then(() => {
                                    return defer.resolve();
                                }).catch((err) => defer.reject(err));
                            if (data.hasOwnProperty('pin_code') || data.hasOwnProperty('bar_code')) {
                                const pin_code = (data.hasOwnProperty('pin_code') ? (data['pin_code'] !== "" ? data['pin_code'] : "") : "");
                                const bar_code = (data.hasOwnProperty('bar_code') ? (data['bar_code'] !== "" ? data['bar_code'] : "") : "");
                                SupportToken.updateCodeLogin(data, user_id, defer,pin_code,bar_code);
                            }
                            return defer.promise;
                        }
                    });

