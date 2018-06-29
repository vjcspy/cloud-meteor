import {Stone} from "../../../code/core/stone";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {Customer} from "../repositories/braintree/customer";

new ValidatedMethod({
                        name: 'sales-payment-braintree.get_method',
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
                                                .getCustomerMethods(user)
                                                .then((methods) => res(methods), (err) => rej(err));
                            });
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment-braintree.get_method",
                       }, 3, 1000);