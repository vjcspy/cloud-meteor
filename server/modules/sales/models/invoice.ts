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
import {Coupon} from "../../retail/models/coupon";
import {Users} from "../../account/collections/users";
import {InvoiceCollection} from "../collection/invoice";
import * as _ from "lodash";

export class Invoice extends AbstractModel {
    protected $collection: string = 'sales_invoice';
    protected entity;
    protected pricing: Price;
    async createInvoice(entity:Plan|AdditionFee, data: Object, totals = {}, typePay): Promise<any> {
            this.entity = entity;
            if (!entity.canInvoice()) {
                throw new Meteor.Error('Error', 'can_not_invoice');
            }
            if (totals.hasOwnProperty('discount_amount') && totals['discount_amount'] !== 0) {
                this.setData('coupon_id', entity.getData('coupon_id'));
            }
            if(typePay === InvoiceType.TYPE_ADDITIONFEE) {
                this.setData('agency_id', entity.getData('agency_id'));
            }
             if(typePay === InvoiceType.TYPE_PLAN) {
                const owner = Users.findOne({_id: entity.getUserId()});
                if (owner && owner['assign_to_agency'] && owner['assign_to_agency'].length > 0) {
                    const hasInvoice = InvoiceCollection.findOne({user_id: entity.getUserId(), product_id: entity.getProductId(), type: InvoiceType.TYPE_PLAN, grand_total: {$gt: 0}});
                    if (hasInvoice) {
                        if(hasInvoice['agency_id']) {
                            const agency = Users.collection.findOne({_id: hasInvoice['agency_id']});
                            if (agency && agency.hasOwnProperty('agency') && agency['agency'].hasOwnProperty('agency_type') && agency['agency']['agency_type'] == 0) {
                                const hasAgency = _.find(owner['take_care_by_agency'], a => a['agency_id'] === agency['_id']);
                                if(hasAgency) {
                                    this.setData('agency_id', agency['_id']);
                                }
                            }
                        }
                    } else {
                        this.setData('agency_id', _.findLast(owner['assign_to_agency'])['agency_id']);
                    }
                }
            }
            this.setData('user_id', entity.getUserId())
                .setData('entity_id', entity.getId())
                .setData('product_id', entity.getProductId())
                .setData('grand_total', totals['total'] ? totals['total'] : entity.getGrandtotal())
                .setData('type', typePay)
                .setData('totals', JSON.stringify(totals))
                .setData('payment_data', JSON.stringify(data));
        StoneEventManager.dispatch('invoice_create_before', {
            entity, data, totals
        });
        await this.save();
        const coupon_id = this.getData('coupon_id');
        if(coupon_id) {
            let coupon = OM.create<Coupon>(Coupon).loadById(coupon_id);
            coupon.setData('used', coupon.getData('used') + 1);
            await coupon.save();
        }
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