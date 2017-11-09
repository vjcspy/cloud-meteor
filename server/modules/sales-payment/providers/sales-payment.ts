import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {Stone} from "../../../code/core/stone";
import {OM} from "../../../code/Framework/ObjectManager";
import {SalesPaymentManager} from "../repositories/sales-payment-manager";

export class SalesPaymentProvider implements ProviderInterface {
    boot() {
        Stone.getInstance().singleton('sales-payment-manager', OM.create<SalesPaymentManager>(SalesPaymentManager));
    }
}