import {OM} from "../../../code/Framework/ObjectManager";
import {PlanCalculation} from "../models/totals/plan-calculation";
import {Plan} from "../models/plan";
import {PlanInterface, PlanStatus} from "../api/plan-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {Payment} from "../../sales-payment/models/payment";
import {RequestPlan} from "../api/data/request-plan";
import {User} from "../../account/models/user";
import {LicenseHelper} from "../../retail/helper/license";
import {UserCredit} from "../../user-credit/models/user-credit";
import {InvoiceType} from "../api/invoice-interface";

export class PlanHelper {

    isSameAsCurrentPlan(requestPlan: RequestPlan, product_id: string, userId: string): boolean {
        const licenseHelper = OM.create<LicenseHelper>(LicenseHelper);
        const license       = licenseHelper.getLicenseOfUser(this.getCurrentUser(userId));
        if (license) {
            const productLicense = license.getProductLicense(product_id);
            if (productLicense && productLicense['plan_id']) {
                const plan = OM.create<Plan>(Plan).loadById(productLicense['plan_id']);
                if (plan) {
                    if (plan.getData('pricing_id') === requestPlan.pricing_id
                        && parseInt(plan.getData('pricing_cycle')) === parseInt(requestPlan.cycle + '')
                        && parseInt(plan.getData('addition_entity')) === parseInt(requestPlan.addition_entity + '')) {
                        return plan.getId();
                    }
                }
            }
        }

        return false;
    }

    getCheckoutData(plan: Plan) {
        let credit_balance = 0;
        const userCredit   = OM.create<UserCredit>(UserCredit);
        userCredit.load(plan.getUserId(), 'user_id');

        if (userCredit.getId()) {
            credit_balance = userCredit.getBalance();
        }

        let grand_total = 0;
        if (!isNaN(plan.getData('price'))) {
            grand_total = parseFloat(plan.getData('price'));
        }
        let discount_amount = 0;
        if (!isNaN(plan.getData('discount_amount'))) {
            discount_amount = parseFloat(plan.getData('discount_amount'));
        }

        let credit_spent = 0;
        if (!isNaN(plan.getData('credit_spent'))) {
            credit_spent = parseFloat(plan.getData('credit_spent'));
        }
        let total = 0;
        if (!isNaN(plan.getData('grand_total'))) {
            total = parseFloat(plan.getData('grand_total'));
        }

        return {
            total,
            discount_amount,
            credit_balance,
            credit_spent,
            grand_total
        }
    }

    getCurrentUser(userId): User {
        return OM.create<User>(User).loadById(userId);
    }

    submitPlan(requestPlan: RequestPlan, product_id: string, userId: string, coupon_id: string) {
        return new Promise((resolve, reject) => {
            const planId = this.isSameAsCurrentPlan(requestPlan, product_id, userId);
            if (planId) {
                return resolve({
                    planId,
                    sameAsOld: true
                });
            }

            let newPlan = this.prepareNewPlanData(requestPlan, product_id, userId, coupon_id);
            let plan    = OM.create<Plan>(Plan);

            plan.createSalePlan(newPlan)
                .then((planId) => {
                        if (plan.getGrandtotal() === 0) {
                            let payment = OM.create<Payment>(Payment);
                            payment.pay(plan, null, InvoiceType.TYPE_PLAN)
                                   .then(() => resolve({
                                           planId,
                                           sameAsOld: false
                                       }),
                                       (err) => reject(err));
                        } else {
                            resolve({
                                planId,
                                sameAsOld: false
                            })
                        }
                    },
                    (err) => reject(err));
        });
    }

    public collectTotal(requestPlan: RequestPlan, product_id: string, userId: string, coupon_id: string) {
        let calculator = OM.create<PlanCalculation>(PlanCalculation);
        let totals = calculator.getTotals(requestPlan, product_id, userId, coupon_id);

        return {calculator, totals};
    }

    protected prepareNewPlanData(requestPlan: RequestPlan, product_id: string, userId: string, coupon_id: string): PlanInterface {
        const {calculator, totals} = this.collectTotal(requestPlan,product_id,userId,coupon_id);

        let newPlan: PlanInterface = {
            user_id: userId,
            product_id,
            license_id: !!calculator.license ? calculator.license.getId() : null,
            pricing_id: calculator.newPricing.getId(),
            coupon_id: coupon_id,
            pricing_cycle: requestPlan.cycle,
            num_of_cycle: requestPlan.num_of_cycle,
            addition_entity: requestPlan.addition_entity,
            prev_pricing_id: calculator.currentPricing ? calculator.currentPricing.getId() : null,
            prev_pricing_cycle: calculator.productLicense ? calculator.productLicense.billing_cycle : null,
            prev_addition_entity: calculator.productLicense ? calculator.productLicense.addition_entity : null,
            price: totals.total.price,
            credit_earn: totals.data.credit_earn || 0,
            credit_spent: totals.total.credit_spent || 0,
            discount_amount: totals.total.discount_amount || 0,
            grand_total: totals.total.grand_total,

            status: PlanStatus.SALE_PENDING,
            created_at: DateTimeHelper.getCurrentDate(),
            updated_at: DateTimeHelper.getCurrentDate()
        };

        StoneEventManager.dispatch('prepare_new_plan', newPlan);

        return newPlan;
    }
}
