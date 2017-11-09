import {SalesPaymentInterface} from "../../../../sales-payment/models/sales/payment-interface";
import {Order} from "../../../../sales/models/order";

export class BraintreeSubscription implements SalesPaymentInterface {
    place(order: Order) {
    }
}