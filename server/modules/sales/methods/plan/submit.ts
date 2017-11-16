import {OM} from "../../../../code/Framework/ObjectManager";
import {PlanHelper} from "../../helper/plan-helper";

new ValidatedMethod({
                        name: 'sales.order_submit',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {plan, product_id} = data;
                            let planHelper           = OM.create<PlanHelper>(PlanHelper);
        
                            return planHelper.submitPlan(plan, product_id, this.userId);
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.order_submit",
                       }, 1, 5000);