import {OM} from "../../../../code/Framework/ObjectManager";
import {BillingCycleHelper} from "../../helper/billing-cycle";

new ValidatedMethod({
                        name: "data-provider.billing_cycle_select_options",
                        validate: function () {
                        },
                        run: function () {
                            let billingCylceHelper = OM.create<BillingCycleHelper>(BillingCycleHelper);
                            return billingCylceHelper.getBillingCycleSelectOption();
                        }
                    });
DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "data-provider.billing_cycle_select_options",
                       }, 5, 1000);