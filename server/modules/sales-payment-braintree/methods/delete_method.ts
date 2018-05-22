import {Stone} from "../../../code/core/stone";
import {Customer} from "../repositories/braintree/customer";

new ValidatedMethod({
                        name: 'sales-payment-braintree.delete_method',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data: string) {
                            return new Promise((res, rej) => {
                                let braintree = Stone.getInstance().s('braintree');
                                return braintree.getCustomerObject()
                                                .deleteMethod(data)
                                                .then((method) => res(method), (err) => rej(err));
                            });
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment-braintree.delete_method",
                       }, 3, 1000);