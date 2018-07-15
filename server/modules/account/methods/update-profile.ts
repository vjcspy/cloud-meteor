import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";
import {SupportToken} from "../../retail/common/support_token";
import * as $q from "q";

new ValidatedMethod({   name: "accounts.user_update_profile",
                        validate: function () {
                            if (!this.userId) throw new Meteor.Error('unauthorized','User must be logged-in to edit profile');
                        },
                        run: function (userData: Object) {
                            let defer = $q.defer();
                            if (!!userData['password']) {
                                Accounts.setPassword(userData['_id'], userData['password'], {logout: false});
                            }
                            let user = OM.create<User>(User).loadById(this.userId);
                            user.setData('profile', Object.assign({}, user.getProfile(),
                                {
                                    first_name: userData['profile']['first_name'],
                                    last_name: userData['profile']['last_name'],
                                    phone: userData['profile']['phone'],
                                }))
                                .save()
                                .then(() => {
                                    return defer.resolve();
                                }).catch((err) => defer.reject(err));
                            if(userData.hasOwnProperty('pin_code') || userData.hasOwnProperty('bar_code')) {
                                const pin_code = (userData.hasOwnProperty('pin_code') ? (userData['pin_code'] !== "" ? userData['pin_code'] : "") : "");
                                const bar_code = (userData.hasOwnProperty('bar_code') ? (userData['bar_code'] !== "" ? userData['bar_code'] : "") : "");
                                SupportToken.updateCodeLogin(user.getData(),  userData['_id'], defer,pin_code,bar_code);
                            }
                            return defer;
                        }
                    });

DDPRateLimiter.addRule({
    userId: function () {return true;},
    type: "method",
    name: "user.chats.user_send_message",
}, 1, 1000);
