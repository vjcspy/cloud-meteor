import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {Plan} from "./plan";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanStatus} from "../api/plan-interface";
import {Price} from "../../retail/models/price";
import {OM} from "../../../code/Framework/ObjectManager";
import {StoneLogger} from "../../../code/core/logger/logger";
import {AdditionFee} from "../../retail/models/additionfee";
import {InvoiceType} from "../api/invoice-interface";
import {AdditionFeeStatus} from "../../retail/api/addition-fee-interface";

export class Invoice extends AbstractModel {
    protected $collection: string = 'sales_invoice';
    protected entity;
    protected pricing: Price;
    async createInvoice(entity:Plan|AdditionFee, data: Object, totals = {}, typePay): Promise<any> {
            this.entity = entity;
            if (!entity.canInvoice()) {
                throw new Meteor.Error('Error', 'can_not_invoice');
            }
            this.setData('user_id', entity.getUserId())
                .setData('entity_id', entity.getId())
                .setData('grand_total', entity.getGrandtotal())
                .setData('type', typePay)
                .setData('totals', JSON.stringify(totals))
                .setData('payment_data', JSON.stringify(data));
        StoneEventManager.dispatch('invoice_create_before', {
            entity, data, totals
        });
        await this.save();
        if(typePay === InvoiceType.TYPE_PLAN) {
            if (entity.getData('pricing_cycle') === ProductLicenseBillingCycle.LIFE_TIME || this.getPricing().isTrial()) {
                entity.setData('status', PlanStatus.SALE_COMPLETE)
            } else if (this.getPricing().isSubscriptionType()) {
                entity.setData('status', PlanStatus.SUBSCRIPTION_ACTIVE);
            } else {
                StoneLogger.error('can_not_update_plan_status', {entity});
            }
        } else if (typePay === InvoiceType.TYPE_ADDITIONFEE) {
            entity.setData('status', AdditionFeeStatus.SALE_COMPLETE);
        }
        await entity.save();
        StoneEventManager.dispatch('invoice_create_after', {entity, invoice: this, totals, typePay});
        
    }

    protected getPricing(): Price {
        if (typeof this.pricing === 'undefined') {
            this.pricing = OM.create<Price>(Price);
            this.pricing.loadById(this.entity.getPricingId());

            if (!this.pricing.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_price");
            }
        }

        return this.pricing;
    }
}