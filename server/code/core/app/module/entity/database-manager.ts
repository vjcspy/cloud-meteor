import {Stone} from "../../../stone";
import {DbSchemaInterface} from "../../contract/module-declare/db-schema-interface";
import * as _ from 'lodash';
import {StoneModuleCollection, StoneModulesInterface} from "../collections/stone-modules";
import {StoneModuleManager} from "../stone-module-manager";
import {ModuleConfigInterface} from "../../contract/module-declare/module-config-interface";

export class DatabaseManager {
    private static $schema = {};
    
    boot() {
        const $stoneModuleManager = Stone.getInstance().s('$stoneModuleManager') as StoneModuleManager;
        _.forEach($stoneModuleManager.$moduleResolved, (m: ModuleConfigInterface) => {
            const currentModule: StoneModulesInterface = StoneModuleCollection.findOne({name: m.name});
            
            if (!currentModule.version) {
                
                m.db.install();
            }
            
            if (currentModule.version < m.version) {
                m.db.up(currentModule, m);
            }
            
            if (currentModule.version > m.version) {
                m.db.down(currentModule, m);
            }
        });
    }
    
    addSchemal(moduleName: string, s: DbSchemaInterface): void {
        DatabaseManager.$schema[moduleName] = s;
    }
}

export const $databaseManager = new DatabaseManager();
Stone.getInstance().singleton('$databaseManager', $databaseManager);