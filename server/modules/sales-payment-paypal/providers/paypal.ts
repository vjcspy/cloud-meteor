import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {Stone} from "../../../code/core/stone";
import {PaypalSale} from "../models/sales/payment/sale";

export class PaypalProvider implements ProviderInterface {
    boot() {
        this.addPaypalPayment();
    }
    
    protected addPaypalPayment() {
        // Not yet support paypal
        // Stone.getInstance().s('sales-payment-manager').addPayment('paypal', {
        //     name: "Paypal",
        //     sale: new PaypalSale()
        // }, true);
    }
}
