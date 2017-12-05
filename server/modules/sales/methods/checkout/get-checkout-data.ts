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
                            const {planId} = data;
        
                            let salePaymentManager = <SalesPaymentManager>Stone.getInstance().s('sales-payment-manager');
                            const payments         = salePaymentManager.getPayments();
        
                            let totals;
                            let plan = OM.create<Plan>(Plan);
                            plan.loadById(planId);
        
                            if (plan.getId()) {
                                if (!plan.canInvoice()) {
                                    throw new Meteor.Error("plan_has_been_invoiced");
                                }
            
                                totals = {
                                    total: {
                                        discount_amount: plan.getData('discount_amount'),
                                        grand_total: plan.getData('grand_total')
                                    }
                                };
                            } else {
                                throw new Meteor.Error("can_find_plan");
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