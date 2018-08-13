import {BillingCycleHelper} from "../../helper/billing-cycle";
import {Stone} from "../../../../code/core/stone";
import {LicenseHelper} from "../../helper/license";

new ValidatedMethod({
                        name: "data-provider.billing_cycle_select_options",
                        validate: function () {
                        },
                        run: function () {
                            const $license = Stone.getInstance().s('$license') as LicenseHelper;
                            return $license.getProductLicenseBillingCycleData();
                        }
                    });
DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "data-provider.billing_cycle_select_options",
                       }, 5, 1000);