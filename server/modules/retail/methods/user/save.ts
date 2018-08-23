import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {CommonUser} from "../../common/user-pending-method";
import {USER_EMAIL_TEMPLATE} from "../../../account/api/email-interface";
import {UserPendingCollection} from "../../../account/collections/user-pending-collection";
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
                            const current_user = OM.create<User>(User).loadById(this.userId);
                            let defer = $q.defer();
                            let user: User = OM.create<User>(User);
                            let profile           = user.getProfile() || {};
                            profile['first_name'] = data['profile']['first_name'];
                            profile['last_name']  = data['profile']['last_name'];
                            profile['phone']      = data['profile']['phone'];
                            profile['country']      = data['profile']['country'];
                            profile['created_by'] = Meteor.userId();
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
                                if (current_user.isInRoles([ Role.AGENCY], Role.GROUP_CLOUD)) {
                                    const duplicate_username = CommonUser.checkUserSystem(data['username']);
                                    if(duplicate_username) {
                                        throw  new Meteor.Error('user.save', 'Username already exists.');
                                    }
                                    const duplicate_user = CommonUser.checkUserSystem(data['email']);
                                    if (duplicate_user) {
                                        const submitedUser = UserPendingCollection.findOne({created_by_user_id: this.userId, duplicated_user_id: duplicate_user['_id']});
                                        let approvedUser;
                                        if (_.isArray(duplicate_user['assign_to_agency']) && duplicate_user['assign_to_agency'].length > 0) {
                                            approvedUser = _.find(duplicate_user['assign_to_agency'], a => a['agency_id'] === this.userId);
                                        }
                                        if(submitedUser || approvedUser) {
                                            throw  new Meteor.Error('user.save', 'You have been submitted this customer.');
                                        }
                                        CommonUser.storeUserPending(data,duplicate_user);
                                        const sendData = {
                                            email: current_user.getEmail(),
                                            username: current_user.getUsername(),
                                            duplicate_data: data
                                        };
                                        current_user.sendData(sendData, USER_EMAIL_TEMPLATE.PENDING_USER);
                                        throw  new Meteor.Error('user.duplicate', 'duplicated_customer');
                                    }
                                }

                                let newUserId = Accounts.createUser({username: data['username'], email: data['email'], password: !!data['password'] ? data['password'] : User.DEFAULT_PASSWORD_USER, profile: profile});
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
                            return defer.promise;
                        }
                    });

