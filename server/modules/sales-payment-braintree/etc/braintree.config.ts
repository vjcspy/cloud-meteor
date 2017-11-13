import * as braintree from 'braintree';

// Fixme: will change by implement configuration page.
export const BraintreeConfig = {
    sandbox: {
        merchantId: 'p2zw88mxhbrxj6mz',
        publicKey: 'ty5t38gh52s5w2qs',
        privateKey: 'ec91ef68c14852d9b084ce604f8752e1',
    },
    subscription: {
        discountId: 'subscription_discount',
        linkPricingPlan: [
            {
                pricing_code: "cpos_premium",
                plan_id: "cpos_premium",
                type: 'plan'
            },
            {
                pricing_code: "cpos_standard",
                plan_id: "cpos_standard",
                type: 'plan'
            }
        ]
    }
};

export const BraintreeGateway = braintree.connect({
                                                      environment: braintree.Environment.Sandbox,
                                                      merchantId: BraintreeConfig.sandbox.merchantId,
                                                      publicKey: BraintreeConfig.sandbox.publicKey,
                                                      privateKey: BraintreeConfig.sandbox.privateKey
                                                  });

BraintreeGateway.config.timeout = 10000;
