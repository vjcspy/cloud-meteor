import {Order} from "../../../sales/models/order";

export interface SalesPaymentInterface {
    place(order: Order);
}