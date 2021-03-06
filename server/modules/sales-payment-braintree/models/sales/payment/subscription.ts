import {
    SalesPaymentDataInterface,
    SalesPaymentInterface
} from "../../../../sales-payment/models/payment/payment-interface";
import * as _ from 'lodash';
import {BraintreePricingPlanCollection} from "../../../collections/braintree-pricing-plan";
import {PaymentAbstract} from "../../../../sales-payment/models/payment/payment-abstract";
import {ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {OrderInterface} from "../../../../sales/api/order-interface";
import {Stone} from "../../../../../code/core/stone";
import {Braintree} from "../../../repositories/braintree";
import {SubscriptionGatewayConfig} from "../../../repositories/braintree/subscription";
import {BraintreeConfig} from "../../../etc/braintree.config";
import {PayResultInterface, PayResultType} from "../../../../sales-payment/models/payment/pay-result-interface";

export class BraintreeSubscription extends PaymentAbstract implements SalesPaymentInterface {
    place(data: SalesPaymentDataInterface): Promise<PayResultInterface> {
        const subscriptionPlanId = this.getPlanId(data.pricing.getCode());
        const pricing            = data.pricing;

        const price = data.transactionData.billingCycle === ProductLicenseBillingCycle.MONTHLY ? pricing.getCostMonthly() : pricing.getCostAnnually();

        let transaction: SubscriptionGatewayConfig = {
            price,
            planId: subscriptionPlanId,
            paymentMethodNonce: data.gatewayAdditionData['paymentMethodNonce'],
            neverExpires: true,
            options: {
                startImmediately: true
            },
            discounts: {
                add: []
            }
        };

        if (_.isNumber(data.transactionData.discountAmount)) {
            transaction.discounts.add.push({
                amount: Math.abs(data.transactionData.discountAmount),
                inheritedFromId: BraintreeConfig.subscription.discountId,
                neverExpires: false,
                numberOfBillingCycles: 1,
                quantity: 1
            });
        }

        return new Promise((resolve, reject) => {
            (Stone.getInstance().s('braintree') as Braintree)
                .getSubscription()
                .create(transaction)
                .then((result) => {
                    resolve({
                        type: PayResultType.PAY_SUCCESS,
                        data: result
                    })
                }, (err) => {

                });
        });
    }

    protected getPlanId(pricing_code: string): string {
        let existedPlanId = _.find(this.getPricingPlan(), (_p) => _p['pricing_code'] === pricing_code);
        if (existedPlanId) {
            return existedPlanId['braintree_plan_id'];
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