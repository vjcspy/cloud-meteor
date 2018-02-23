import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanInterface, PlanStatus} from "../api/plan-interface";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {InvoiceCollection} from "../collection/invoice";
import {OM} from "../../../code/Framework/ObjectManager";
import {PlanCalculation} from "./totals/plan-calculation";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {RequestPlan} from "../api/data/request-plan";

export class Plan extends AbstractModel {
    protected $collection: string = 'sales_plan';

    getPricingCycle(): ProductLicenseBillingCycle {
        return this.getData('pricing_cycle');
    }

    getNumberOfCycle(): number {
        return this.getData("num_of_cycle");
    }

    createSalePlan(plan: PlanInterface) {
        return new Promise((resolve, reject) => {
            this.addData(plan);

            // process status
            this.setData('status', PlanStatus.SALE_PENDING);

            StoneEventManager.dispatch('sale_plan_save_before', this);
            this.save()
                .then(
                    (planId) => {
                        StoneEventManager.dispatch('sale_plan_save_after', {plan: this});
                        resolve(planId)
                    },
                    (err) => reject(err)
                );
        });
    }

    canInvoice(): boolean {
        // if order is sale -> status = Pending and not any invoice created
        if (this.getStatus() === PlanStatus.SALE_PENDING) {
            const existedInvoice = InvoiceCollection.collection.find({plan_id: this.getId()}).count();

            return existedInvoice <= 0;
        }

        if (this.getStatus() === PlanStatus.SALE_COMPLETE) {
            return false;
        }

        return true;
    }

    planHasAlreadyPaid(): boolean {
        if (this.getStatus() === PlanStatus.SALE_COMPLETE) {
            return true;
        }
        else {
            return false;
        }
    }

    getPrice(): number {
        return this.getData('price') || 0;
    }

    getDiscountAmount(): number {
        return this.getData('discount_amount') || 0;
    }

    getPricingId(): string {
        return this.getData('pricing_id');
    }

    getCreditSpent(): number {
        return this.getData('credit_spent')
    }

    getCreditEarn(): number {
        return parseFloat(this.getData('credit_earn'));
    }

    getUserId(): string {
        return this.getData('user_id');
    }

    getGrandtotal(): number {
        return this.getData('grand_total');
    }

    getStatus(): PlanStatus {
        return this.getData('status');
    }

    getAdditionEntity(): number {
        return this.getData('addition_entity');
    }

    getProductId(): string {
        return this.getData('product_id');
    }

    // submitPlan(requestPlan: RequestPlan, product_id: string, userId: string) {
    //     return new Promise((resolve, reject) => {
    //         let newPlan = this.prepareNewPlanData(requestPlan, product_id, userId);
    //         let plan    = OM.create<Plan>(Plan);
    //         plan.createSalePlan(newPlan)
    //             .then((planId) => {
    //                       StoneEventManager.dispatch('plan_create_after', {plan, planId});
    //                       resolve(planId);
    //                   },
    //                   (err) => reject(err));
    //     });
    // }

    protected prepareNewPlanData(requestPlan: RequestPlan, product_id: string, userId: string): PlanInterface {
        let calculator = OM.create<PlanCalculation>(PlanCalculation);
        const totals   = calculator.getTotals(requestPlan, product_id, userId);

        let newPlan: PlanInterface = {
            user_id: userId,
            product_id,
            license_id: !!calculator.license ? calculator.license.getId() : null,
            pricing_id: calculator.newPricing.getId(),
            pricing_cycle: requestPlan.cycle,
            num_of_cycle: requestPlan.num_of_cycle,
            addition_entity: requestPlan.addition_entity,
            prev_pricing_id: calculator.currentPricing ? calculator.currentPricing.getId() : null,
            prev_pricing_cycle: calculator.productLicense ? calculator.productLicense.billing_cycle : null,
            prev_addition_entity: calculator.productLicense ? calculator.productLicense.addition_entity : null,
            price: totals.total.price,
            credit_earn: totals.data.credit_earn || 0,
            credit_spent: totals.data.credit_spent || 0,
            discount_amount: totals.total.discount_amount || 0,
            grand_total: totals.total.grand_total,

            status: calculator.newPricing.isSubscriptionType() ? PlanStatus.SUBSCRIPTION_PENDING : PlanStatus.SALE_PENDING,
            created_at: DateTimeHelper.getCurrentDate(),
            updated_at: DateTimeHelper.getCurrentDate()
        };

        StoneEventManager.dispatch('prepare_new_plan', newPlan);

        return newPlan;
    }
}
