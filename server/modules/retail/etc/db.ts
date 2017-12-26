import {DbSchemaInterface} from "../../../code/core/app/contract/module-declare/db-schema-interface";
import {StoneModulesInterface} from "../../../code/core/app/module/collections/stone-modules";
import {ModuleConfigInterface} from "../../../code/core/app/contract/module-declare/module-config-interface";
import {LicenseCollection} from "../collections/licenses";
import {PricingProvider} from "../providers/pricing";

export class RetailDB implements DbSchemaInterface {
    install() {
    }
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
        if (currentModule.version < '0.0.8') {
            LicenseCollection.collection.update({}, {$set: {has_roles: []}}, {multi: true});
        }
        if (currentModule.version < '0.0.9') {
            (new PricingProvider()).initDefaultPricing();
        }
    }
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
    
}