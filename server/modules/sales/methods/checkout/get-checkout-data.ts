import {Stone} from "../../../../code/core/stone";
import {SalesPaymentManager} from "../../../sales-payment/repositories/sales-payment-manager";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Plan} from "../../models/plan";
import {UserCredit} from "../../../user-credit/models/user-credit";
import {PlanHelper} from "../../helper/plan-helper";

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
            const planHelper = OM.create<PlanHelper>(PlanHelper);
            if (!plan.canInvoice()) {
                throw new Meteor.Error("Error", "can_not_create_invoice_for_plan");
            }

            totals = {
                total: planHelper.getCheckoutData(plan)
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