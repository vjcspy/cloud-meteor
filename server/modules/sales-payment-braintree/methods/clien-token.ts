import {UserCreditCollection} from "../collections/user-credit";
import {UserCreditInterface} from "../api/user-credit-interface";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Stone} from "../../../code/core/stone";

new ValidatedMethod({
                        name: 'sales-payment-braintree.client_token',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function () {
                            return new Promise((res, rej) => {
                                const user: User = OM.create<User>(User);
                                user.loadById(this.userId);
            
                                let braintree = Stone.getInstance().s('braintree');
            
                                return braintree.getCustomerObject()
                                                .getClientToken(user)
                                                .then((token) => res(token), (err) => rej(err));
                            });
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment-braintree.client_token",
                       }, 3, 1000);