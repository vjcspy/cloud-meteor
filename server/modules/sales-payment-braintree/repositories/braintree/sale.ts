import {BraintreeGateway} from "../../etc/braintree.config";

export interface SaleBraintreePaymentData {
    amount: string,
    paymentMethodNonce?: string,
    customerId?: string,
    orderId: string,
    options: {
        submitForSettlement: boolean,
        storeInVaultOnSuccess: boolean
    },
    merchantAccountId?: string
}

export class Sale {
    create(salePaymentData: SaleBraintreePaymentData) {
        return new Promise((res, rej) => {
            BraintreeGateway.transaction.sale(salePaymentData, (err, result) => {
                if (!!err) {
                    rej(err);
                } else {
                    res(result);
                }
            });
        });
    }
}