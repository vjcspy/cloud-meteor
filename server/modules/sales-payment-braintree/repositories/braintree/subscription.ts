import {BraintreeGateway} from "../../etc/braintree.config";

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