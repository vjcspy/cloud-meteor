import {OM} from "../../../code/Framework/ObjectManager";
import {Payment} from "../models/payment";
import {Plan} from "../../sales/models/plan";

new ValidatedMethod({
                        name: 'sales-payment.pay',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            let payment = OM.create <Payment>(Payment);
                            const {orderType, orderId, gatewayAdditionData} = data;
                            let orderObject;
        
                            if (orderType === 'plan') {
                                let plan = OM.create<Plan>(Plan);
                                plan.loadById(orderId);
            
                                if (!!plan.getId()) {
                                    orderObject = {plan};
                                }
                            }
        
        
                            if (typeof orderObject === 'undefined') {
                                throw new Meteor.Error("sales-payment.pay", "pay_err");
                            }
        
                            return payment.pay(orderObject, gatewayAdditionData);
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales-payment.get_sale_payment",
                       }, 3, 1000);