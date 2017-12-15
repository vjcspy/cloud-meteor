import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {Stone} from "../../../code/core/stone";
import {LicenseHelper} from "../helper/license";

export class LicenseProvider implements ProviderInterface {
    boot() {
        Stone.getInstance().singleton('$license', new LicenseHelper());
    }
    
}