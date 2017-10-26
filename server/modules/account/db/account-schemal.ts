import {DbSchemaInterface} from "../../../code/core/app/contract/module-declare/db-schema-interface";
import {StoneModulesInterface} from "../../../code/core/app/module/collections/stone-modules";
import {ModuleConfigInterface} from "../../../code/core/app/contract/module-declare/module-config-interface";

export class AccountSchema implements DbSchemaInterface {
    install() {
    }
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
}