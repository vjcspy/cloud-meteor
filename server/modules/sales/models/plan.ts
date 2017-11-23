import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanInterface, PlanStatus} from "../api/plan-interface";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {InvoiceCollection} from "../collection/invoice";

export class Plan extends AbstractModel {
    protected $collection: string = 'sales_plan';
    
    getPricingCycle(): ProductLicenseBillingCycle {
        return this.getData('pricing_cycle');
    }
    
    createSalePlan(plan: PlanInterface) {
        return new Promise((resolve, reject) => {
            this.addData(plan);
            
            
            // process status
            if (plan.pricing_cycle === ProductLicenseBillingCycle.LIFE_TIME) {
                this.setData('status', PlanStatus.SALE_PENDING);
            } else if (plan.pricing_cycle === ProductLicenseBillingCycle.MONTHLY || plan.pricing_cycle === ProductLicenseBillingCycle.ANNUALLY) {
                this.setData('status', PlanStatus.SUBSCRIPTION_PENDING);
            }
            
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
    
    getUserId(): string {
        return this.getData('user_id');
    }
    
    getGrandtotal(): Number {
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
}