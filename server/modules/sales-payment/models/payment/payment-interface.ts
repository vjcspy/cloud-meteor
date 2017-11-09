import {Order} from "../../../sales/models/order";
import {PriceInterface} from "../../../retail/api/price-interface";

export interface SalesPaymentDataInterface {
    pricing: PriceInterface;
    transactionType: string;
    transactionData: {
        subscriptionPrice?: number;
        billingCycle?: number;
        subscriptionDiscount?: number;
        subscriptionAddOn?: number;
        grandTotal?: number;
    },
    gatewayAdditionData: Object;
}

export interface SalesPaymentInterface {
    place(data: SalesPaymentDataInterface): Promise<any>;
}