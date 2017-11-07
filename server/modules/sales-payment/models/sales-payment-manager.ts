import * as _ from 'lodash';
import {SalePayment} from "../etc/config";

export class SalesPaymentManager {
    
    static addPayment(id: string, data: Object, isActive: boolean = true): void {
        const isExisted = _.find(SalePayment, (p) => p['id'] === id);
        
        if (isExisted) {
            throw new Meteor.Error("payment_method_existed: " + id);
        }
        
        SalePayment.push({id, data, isActive});
        
    }
    
    getPayment() {
        return SalePayment;
    }
}