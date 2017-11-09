import {SalesPaymentDataInterface, SalesPaymentInterface} from "../../../../sales-payment/models/payment/payment-interface";
import * as _ from 'lodash';
import {BraintreePricingPlanCollection} from "../../../collections/braintree-pricing-plan";
import {PaymentAbstract} from "../../../../sales-payment/models/payment/payment-abstract";
import {ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {OrderInterface} from "../../../../sales/api/order-interface";
import {Stone} from "../../../../../code/core/stone";
import {Braintree} from "../../../repositories/braintree";
import {SubscriptionGatewayConfig} from "../../../repositories/braintree/subscription";
import {BraintreeConfig} from "../../../etc/braintree.config";

export class BraintreeSubscription extends PaymentAbstract implements SalesPaymentInterface {
    place(data: SalesPaymentDataInterface) {
        const planId  = this.getPlanId(data.pricing.code);
        const pricing = this.getPricing(data.pricing._id);
        
        if (!pricing) {
            throw new Meteor.Error("can_not_find_pricing_for_this_order");
        }
        
        const price = data.transactionData.billingCycle === ProductLicenseBillingCycle.MONTHLY ? pricing.cost_monthly : pricing.cost_annually;
        
        let transaction: SubscriptionGatewayConfig = {
            price,
            planId,
            paymentMethodNonce: data.gatewayAdditionData['paymentMethodNonce'],
            neverExpires: true,
            options: {
                startImmediately: true
            },
            discounts: {
                add: []
            }
        };
        
        if (data.transactionData.subscriptionDiscount && data.transactionData.subscriptionDiscount > 0) {
            transaction.discounts.add.push({
                                               amount: data.transactionData.subscriptionDiscount,
                                               inheritedFromId: BraintreeConfig.subscription.discountId,
                                               neverExpires: false,
                                               numberOfBillingCycles: 1,
                                               quantity: 1
                                           });
        }
        
        return (Stone.getInstance().s('braintree') as Braintree)
            .getSubscription()
            .create(transaction);
    }
    
    protected getPlanId(pricing_code: string): string {
        let existedPlanId = _.find(this.getPricingPlan(), (_p) => _p['pricing_code'] === pricing_code);
        if (existedPlanId) {
            return existedPlanId['plan_id'];
        } else {
            throw new Meteor.Error("pricing_not_yet_config_braintree_plan");
        }
    }
    
    protected getPricingPlan() {
        if (!this.getData('pricing_plan')) {
            this.setData('pricing_plan', BraintreePricingPlanCollection.collection.find().fetch());
        }
        
        return this.getData('pricing_plan');
    }
}