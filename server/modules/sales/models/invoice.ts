import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {Plan} from "./plan";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";

export class Invoice extends AbstractModel {
    protected $collection: string = 'sales_invoice';
    
    createInvoice(plan: Plan, data: Object): Promise<any> {
        this.setData('user_id', plan.getUserId())
            .setData('plan_id', plan.getUserId())
            .setData('grand_total', plan.getGrandtotal())
            .setData('payment_data', JSON.stringify(data));
        return new Promise((resolve, reject) => {
            StoneEventManager.dispatch('invoice_create_before', {
                plan, data
            });
            
            
            this.save()
                .then(() => {
                    StoneEventManager.dispatch('invoice_create_after', {plan, invoice: this});
                
                    resolve();
                }, (err) => reject(err));
        });
    }
}