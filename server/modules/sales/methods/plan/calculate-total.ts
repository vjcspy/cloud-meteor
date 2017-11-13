import {OM} from "../../../../code/Framework/ObjectManager";
import {PlanCalculation} from "../../models/plan-calculation";

new ValidatedMethod({
                        name: "sales.calculate_total",
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {plan, product_id} = data;
                            return OM.create<PlanCalculation>(PlanCalculation).getTotals(plan, product_id, this.userId);
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.calculate_total",
                       }, 3, 1000);