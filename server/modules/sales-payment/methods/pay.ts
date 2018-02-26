import {OM} from "../../../code/Framework/ObjectManager";
import {Payment} from "../models/payment";
import {Plan} from "../../sales/models/plan";
import {PlanHelper} from "../../sales/helper/plan-helper";
import {Invoice} from "../../sales/models/invoice";

new ValidatedMethod({
    name: 'sales-payment.pay',
    validate: function () {
        if (!this.userId) {
            throw new Meteor.Error("Error", "Access denied");
        }
    },
    run: function (checkoutData) {
        let payment                       = OM.create <Payment>(Payment);
        const {data, gatewayAdditionData} = checkoutData;
        const {planId}                    = data;

        let plan = OM.create<Plan>(Plan);
        plan.loadById(planId);

        return payment.pay(plan, gatewayAdditionData);
    }
});

DDPRateLimiter.addRule({
    userId: function () {
        return true;
    },
    type: "method",
    name: "sales-payment.get_sale_payment",
}, 3, 1000);