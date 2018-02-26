import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {Plan} from "./plan";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanStatus} from "../api/plan-interface";
import {Price} from "../../retail/models/price";
import {OM} from "../../../code/Framework/ObjectManager";
import {StoneLogger} from "../../../code/core/logger/logger";

export class Invoice extends AbstractModel {
    protected $collection: string = 'sales_invoice';
    protected plan: Plan;
    protected pricing: Price;

    async createInvoice(plan: Plan, data: Object, totals = {}): Promise<any> {
        this.plan = plan;
        if (!plan.canInvoice()) {
            throw new Meteor.Error('Error', 'can_invoice_plan');
        }

        this.setData('user_id', plan.getUserId())
            .setData('plan_id', plan.getUserId())
            .setData('grand_total', plan.getGrandtotal())
            .setData('totals', JSON.stringify(totals))
            .setData('payment_data', JSON.stringify(data));

        StoneEventManager.dispatch('invoice_create_before', {
            plan, data, totals
        });

        await this.save();

        if (plan.getPricingCycle() === ProductLicenseBillingCycle.LIFE_TIME || this.getPricing().isTrial()) {
            plan.setData('status', PlanStatus.SALE_COMPLETE)
        } else if (this.getPricing().isSubscriptionType()) {
            plan.setData('status', PlanStatus.SUBSCRIPTION_ACTIVE);
        } else {
            StoneLogger.error('can_not_update_plan_status', {plan});
        }

        await plan.save();

        StoneEventManager.dispatch('invoice_create_after', {plan, invoice: this, totals});
    }

    protected getPricing(): Price {
        if (typeof this.pricing === 'undefined') {
            this.pricing = OM.create<Price>(Price);
            this.pricing.loadById(this.plan.getPricingId());

            if (!this.pricing.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_price");
            }
        }

        return this.pricing;
    }
}