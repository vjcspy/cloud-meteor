import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";

new ValidatedMethod({
                      name: "accounts.user_update_profile",
                      validate: function (profile: any) {
                        if (!this.userId) throw new Meteor.Error('unauthorized',
                                                                 'User must be logged-in to edit profile');
                      },
                      run: function (profile: Object) {
                        let user           = OM.create<User>(User).loadById(this.userId);
                        profile['picture'] = "https://randomuser.me/api/portraits/thumb/men/" + Math.round(Math.random() * 100) + ".jpg";
                        return user.setData('profile', profile)
                                   .save();
                      }
                    });
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.chats.user_send_message",
                       }, 1, 1000);
