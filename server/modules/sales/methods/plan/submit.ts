import {OM} from "../../../../code/Framework/ObjectManager";
import {OrderCalculation} from "../../models/plan-calculation";
import {Plan} from "../../models/plan";

new ValidatedMethod({
                        name: 'sales.order_submit',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {plan, product_id} = data;
        
                            let calculator = OM.create<OrderCalculation>(OrderCalculation);
                            const totals   = calculator.getTotals(plan, product_id, this.userId);
        
                            let salePlan = OM.create<Plan>(Plan);
                            salePlan.setData('user_id', this.userId)
                                    .setData('product_id', product_id)
                                    .setData('license_id', !!calculator.license ? calculator.license._id : null)
                                    .setData('pricing_id', plan['pricing_id'])
                                    .setData('pricing_cycle', plan['cycle'])
                                    .setData('prev_pricing_id', calculator.currentPricing ? calculator.currentPricing._id : null)
                                    .setData('prev_pricing_cycle', calculator.productLicense ? calculator.productLicense.billing_cycle : null)
                                    .setData('cost_new_plan', totals.total.costNewPlan)
                                    .setData('credit_change_plan', totals.credit.creditPlan)
                                    .setData('discount_amount', totals.total.discount)
                                    .setData('grand_total', totals.total.grandTotal)
                                    .save();
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.order_submit",
                       }, 3, 1000);