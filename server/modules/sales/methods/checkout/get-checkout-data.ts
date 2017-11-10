import {Stone} from "../../../../code/core/stone";
import {SalesPaymentManager} from "../../../sales-payment/repositories/sales-payment-manager";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Plan} from "../../models/plan";

new ValidatedMethod({
                        name: "sales.get_checkout_data",
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {orderType, orderId} = data;
        
                            let salePaymentManager = <SalesPaymentManager>Stone.getInstance().s('sales-payment-manager');
                            const payments         = salePaymentManager.getPayment();
        
                            let totals;
                            switch (orderType) {
                                case 'plan':
                                    let plan = OM.create<Plan>(Plan);
                                    plan.loadById(orderId);
                
                                    if (plan.getId()) {
                                        if (!plan.canInvoice()) {
                                            throw new Meteor.Error("plan_has_been_invoiced");
                                        }
                    
                                        totals = {
                                            credit: {
                                                creditPlan: plan.getData('credit_change_plan')
                                            },
                                            total: {
                                                discount: plan.getData('discount_amount'),
                                                grandTotal: plan.getData('grand_total')
                                            }
                                        };
                                    } else {
                                        throw new Meteor.Error("can_find_plan");
                                    }
                                    break;
                                default:
                                    throw new Meteor.Error("wrong_data_order_type");
                            }
        
                            return {payments, totals};
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.get_checkout_data",
                       }, 3, 1000);