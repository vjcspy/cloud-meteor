import {OM} from "../../../../code/Framework/ObjectManager";
import {Plan} from "../../models/plan";

new ValidatedMethod({
                        name: "sales.plan_has_paid",
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {planId} = data;
                            let plan       = OM.create<Plan>(Plan);
                            plan.loadById(planId);
        
                            if (plan.getId()) {
                                return {
                                    hasPaid: plan.planHasAlreadyPaid()
                                }
                            } else {
                                throw new Meteor.Error("can_find_plan");
                            }
        
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.plan_has_paid",
                       }, 3, 1000);