import {SalesPaymentDataInterface, SalesPaymentInterface} from "../../../../sales-payment/models/payment/payment-interface";
import {PayResultInterface} from "../../../../sales-payment/models/payment/pay-result-interface";

export class PaypalSale implements SalesPaymentInterface {
    place(data: SalesPaymentDataInterface): Promise<PayResultInterface> {
        return undefined;
    }
}
