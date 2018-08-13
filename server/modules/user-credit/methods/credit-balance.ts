import {UserCreditCollection} from "../collections/user-credit";
import {UserCreditInterface} from "../api/user-credit-interface";

new ValidatedMethod({
                        name: 'user-credit.get_balance',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function () {
                            const userCredit: UserCreditInterface = UserCreditCollection.collection.findOne({_id: this.userId});
                            
                            return userCredit ? userCredit.balance : 0;
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "user-credit.get_balance",
                       }, 3, 1000);