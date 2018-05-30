import {PaymentAbstract} from "../../../../sales-payment/models/payment/payment-abstract";
import {
    SalesPaymentDataInterface,
    SalesPaymentInterface
} from "../../../../sales-payment/models/payment/payment-interface";
import {PayResultInterface, PayResultType} from "../../../../sales-payment/models/payment/pay-result-interface";
import {SubscriptionGatewayConfig} from "../../../repositories/braintree/subscription";
import {ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {SaleBraintreePaymentData} from "../../../repositories/braintree/sale";
import {Braintree} from "../../../repositories/braintree";
import {Stone} from "../../../../../code/core/stone";
import {BRAINTREE_ENVIROMENT} from "../../../etc/braintree.config";

export class BraintreeSale extends PaymentAbstract implements SalesPaymentInterface {
    place(data: SalesPaymentDataInterface): Promise<PayResultInterface> {
        return new Promise((resolve, reject) => {
            if (isNaN(data.transactionData.grandTotal)) {
                return resolve({
                    type: PayResultType.PAY_ERROR,
                    data: {
                        message: "some_thing_went_wrong"
                    }
                });
            }
            let transaction: SaleBraintreePaymentData = {
                amount: data.transactionData.grandTotal.toFixed(2) + "",
                paymentMethodNonce: data.gatewayAdditionData['paymentMethodNonce'],
                orderId: data.transactionData.entityId,
                options: {
                    submitForSettlement: false,
                    storeInVaultOnSuccess: false
                },
            };

            if (BRAINTREE_ENVIROMENT !== "SANDBOX") {
                transaction['merchantAccountId'] = "smartoscpteltdUSD";
            }


            (Stone.getInstance().s('braintree') as Braintree)
                .getSale()
                .create(transaction)
                .then((result: any) => {
                    if (result.success) {
                        resolve({
                            type: PayResultType.PAY_SUCCESS,
                            data: {
                                paymentId: 'braintree',
                                transaction: Object.assign({}, ...JSON.parse(JSON.stringify(result.transaction)))
                            }
                        })
                    } else {
                        resolve({
                            type: PayResultType.PAY_FAIL,
                            data: {err: result.errors}
                        });
                    }

                }, (err) => {
                    resolve({
                        type: PayResultType.PAY_ERROR,
                        data: {err}
                    });
                });
        });
    }

}