import {DbSchemaInterface} from "../../../code/core/app/contract/module-declare/db-schema-interface";
import {StoneModulesInterface} from "../../../code/core/app/module/collections/stone-modules";
import {ModuleConfigInterface} from "../../../code/core/app/contract/module-declare/module-config-interface";
import {PriceTypesCollection} from "../collections/price-types";

export class RetailSchema implements DbSchemaInterface {
    install() {
    }
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
        if (!currentModule || currentModule.version < "0.0.1") {
            this.initDefaultPriceTypes();
        }
    }
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
    
    
    protected initDefaultPriceTypes() {
        PriceTypesCollection.remove({});
        PriceTypesCollection.insert({
                                        name: 'trial',
                                        label: 'Trial'
                                    });
        PriceTypesCollection.insert({
                                        name: 'subscription',
                                        label: 'Subscription'
                                    });
        PriceTypesCollection.insert({
                                        name: 'life_time',
                                        label: 'Life time'
                                    });
    }
}