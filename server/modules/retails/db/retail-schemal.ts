import {DbSchemaInterface} from "../../../code/core/app/contract/module-declare/db-schema-interface";
import {StoneModulesInterface} from "../../../code/core/app/module/collections/stone-modules";
import {ModuleConfigInterface} from "../../../code/core/app/contract/module-declare/module-config-interface";
import {PriceTypesCollection} from "../collections/price-types";

export class RetailSchema implements DbSchemaInterface {
    install() {
    }
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
        if (currentModule.version < "0.0.2") {
            PriceTypesCollection.insert({
                                            name: 'subscription'
                                        });
            PriceTypesCollection.insert({
                                            name: 'life_time'
                                        });
        }
    }
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
    
}