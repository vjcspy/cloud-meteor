import * as _ from 'lodash';
import {SalesPaymentInterface} from "../models/payment/payment-interface";

export interface PaymentData {
    name: string;
    sale?: SalesPaymentInterface;
    subscription?: SalesPaymentInterface;
}

export class SalesPaymentManager {
    protected static $SALES_PAYMENT = [];
    
    addPayment(id: string, data: PaymentData, isActive: boolean = true): void {
        const isExisted = _.find(SalesPaymentManager.$SALES_PAYMENT, (p) => p['id'] === id);
        
        if (isExisted) {
            throw new Meteor.Error("payment_method_existed: " + id);
        }
        
        SalesPaymentManager.$SALES_PAYMENT.push({id, data, isActive});
        
    }
    
    getPayment() {
        return SalesPaymentManager.$SALES_PAYMENT;
    }
}