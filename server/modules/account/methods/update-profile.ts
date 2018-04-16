import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";

new ValidatedMethod({
                        name: "accounts.user_update_profile",
                        validate: function () {
                            if (!this.userId) throw new Meteor.Error('unauthorized',
                                                                     'User must be logged-in to edit profile');
                        },
                        run: function (userData: Object) {
                            return new Promise((resolve, reject) => {
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
                                    .then(() => resolve(), (err) => reject(err));
                            });
                        }
                    });
DDPRateLimiter.addRule({
                           userId: function (userId) {
                               return true;
                           },
                           type: "method",
                           name: "user.chats.user_send_message",
                       }, 1, 1000);
