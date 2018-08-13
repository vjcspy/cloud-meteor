import {BraintreeGateway} from "../../etc/braintree.config";


export interface SubscriptionAddDiscount {
    amount: number;
    inheritedFromId: string;
    neverExpires?: boolean;
    numberOfBillingCycles: number;
    quantity: number;
}

export interface SubscriptionGatewayConfig {
    planId: string;
    paymentMethodToken?: string;
    paymentMethodNonce?: string;
    name?: string;
    neverExpires: boolean;
    numberOfBillingCycles?: number;
    price: number;
    options?: {
        startImmediately?: boolean;
    }
    discounts?: {
        add: SubscriptionAddDiscount[]
    }
}


export class Subscription {
    create(gatewayConfig: SubscriptionGatewayConfig) {
        return new Promise((res, rej) => {
            BraintreeGateway.subscription.create(gatewayConfig, (err, result) => {
                if (!!err) {
                    rej(err);
                } else {
                    res(result);
                }
            });
        });
    }
}