import {Order} from "../../../sales/models/order";
import {PriceInterface} from "../../../retail/api/price-interface";
import {PayResultInterface} from "./pay-result-interface";

export interface SalesPaymentDataInterface {
    pricing: PriceInterface;
    transactionType: string;
    transactionData: {
        price?: number;
        billingCycle?: number;
        discountAmount?: number;
        addOn?: number;
        grandTotal?: number;
    },
    gatewayAdditionData: Object;
}

export interface SalesPaymentInterface {
    place(data: SalesPaymentDataInterface): Promise<PayResultInterface>;
}