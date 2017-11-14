import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanInterface} from "../api/plan-interface";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";

export class Plan extends AbstractModel {
    protected $collection: string = 'sales_plan';
    
    getPricingCycle(): ProductLicenseBillingCycle {
        return this.getData('pricing_cycle');
    }
    
    createSalePlan(plan: PlanInterface) {
        return new Promise((resolve, reject) => {
            this.addData(plan);
            
            StoneEventManager.dispatch('sale_plan_save_before', this);
            this.save()
                .then(
                    (planId) => {
                        StoneEventManager.dispatch('sale_plan_save_after', this);
                        resolve(planId)
                    },
                    (err) => reject(err)
                );
        });
    }
    
    canInvoice(): boolean {
        return this.getData('grand_total') > 0;
    }
    
    getPrice(): number {
        return this.getData('price') || 0;
    }
    
    getDiscountAmount(): number {
        return this.getData('discount_amount') || 0;
    }
}