import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {Plan} from "./plan";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanStatus} from "../api/plan-interface";

export class Invoice extends AbstractModel {
    protected $collection: string = 'sales_invoice';
    
    async createInvoice(plan: Plan, data: Object): Promise<any> {
        if (!plan.canInvoice()) {
            throw new Meteor.Error('Error', 'can_invoice_plan');
        }
        
        this.setData('user_id', plan.getUserId())
            .setData('plan_id', plan.getUserId())
            .setData('grand_total', plan.getGrandtotal())
            .setData('payment_data', JSON.stringify(data));
        
        StoneEventManager.dispatch('invoice_create_before', {
            plan, data
        });
        
        await this.save();
        
        if (plan.getPricingCycle() === ProductLicenseBillingCycle.LIFE_TIME) {
            plan.setData('status', PlanStatus.SALE_COMPLETE)
        } else {
            plan.setData('status', PlanStatus.SUBSCRIPTION_ACTIVE);
        }
        
        await plan.save();
        
        StoneEventManager.dispatch('invoice_create_after', {plan, invoice: this});
    }
}