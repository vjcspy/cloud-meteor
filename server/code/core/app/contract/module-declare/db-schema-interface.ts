import {StoneModulesInterface} from "../../module/collections/stone-modules";
import {ModuleConfigInterface} from "./module-config-interface";

export interface DbSchemaInterface {
    install();
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface);
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface);
}