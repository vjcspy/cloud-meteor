import {SalesPaymentManager} from "../repositories/sales-payment-manager";
import {OM} from "../../../code/Framework/ObjectManager";

new ValidatedMethod({
                        name: 'sales-payment.get_sale_payment',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function () {
                            let salePaymentManager = OM.create <SalesPaymentManager>(SalesPaymentManager);
                            return salePaymentManager.getPayment();
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment.get_sale_payment",
                       }, 3, 1000);