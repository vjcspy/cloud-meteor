import {Stone} from "../../../code/core/stone";

new ValidatedMethod({
                        name: 'sales-payment-braintree.get_plan',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function () {
                            return new Promise((res, rej) => {
                                let braintree = Stone.getInstance().s('braintree');
            
                                return braintree.getPlanObject()
                                                .getPlan()
                                                .then((plan) => res(plan), (err) => rej(err));
                            });
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment-braintree.get_plan",
                       }, 3, 1000);