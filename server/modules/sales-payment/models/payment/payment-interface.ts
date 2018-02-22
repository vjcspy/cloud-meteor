import {Order} from "../../../sales/models/order";
import {PayResultInterface} from "./pay-result-interface";
import {Price} from "../../../retail/models/price";

export interface SalesPaymentDataInterface {
    pricing: Price;
    transactionType: string;
    transactionData: {
        planId:string;
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