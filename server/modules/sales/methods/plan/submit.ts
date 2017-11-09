import {OM} from "../../../../code/Framework/ObjectManager";
import {OrderCalculation} from "../../models/plan-calculation";
import {Plan} from "../../models/plan";
import {DataObject} from "../../../../code/Framework/DataObject";

new ValidatedMethod({
                        name: 'sales.order_submit',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            return new Promise((resolve, reject) => {
                                const {plan, product_id} = data;
            
                                let calculator = OM.create<OrderCalculation>(OrderCalculation);
                                const totals   = calculator.getTotals(plan, product_id, this.userId);
            
                                let salePlan = OM.create<Plan>(Plan);
            
                                let planData = new DataObject();
                                planData.setData('user_id', this.userId)
                                        .setData('product_id', product_id)
                                        .setData('license_id', !!calculator.license ? calculator.license._id : null)
                                        .setData('pricing_id', calculator.newPricing._id)
                                        .setData('pricing_code', calculator.newPricing.code)
                                        .setData('pricing_cycle', plan['cycle'])
                                        .setData('prev_pricing_id', calculator.currentPricing ? calculator.currentPricing._id : null)
                                        .setData('prev_pricing_cycle', calculator.productLicense ? calculator.productLicense.billing_cycle : null)
                                        .setData('cost_new_plan', totals.total.costNewPlan)
                                        .setData('credit_change_plan', totals.credit.creditPlan)
                                        .setData('discount_amount', totals.total.discount)
                                        .setData('grand_total', totals.total.grandTotal);
            
                                salePlan.createSalePlan(planData.getData())
                                        .then((planId) => resolve(planId),
                                              (err) => reject(err));
            
                            });
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.order_submit",
                       }, 3, 1000);