import {Stone} from "../../../stone";
import * as _ from 'lodash';
import {StoneModuleCollection, StoneModulesInterface} from "../collections/stone-modules";
import {StoneModuleManager} from "../stone-module-manager";
import {ModuleConfigInterface} from "../../contract/module-declare/module-config-interface";
import {StoneLogger} from "../../../logger/logger";

export class DatabaseManager {
    boot() {
        StoneLogger.info("DB: Booting");
        
        const $stoneModuleManager = Stone.getInstance().s('$stoneModuleManager') as StoneModuleManager;
        
        _.forEach($stoneModuleManager.$moduleResolved, (m: ModuleConfigInterface) => {
            const currentModule: StoneModulesInterface = StoneModuleCollection.findOne({name: m.name});
            
            if (!currentModule || !currentModule.version) {
                StoneLogger.info('installing module ' + m.name);
                m.db.install();
            }
            
            if (!currentModule || !currentModule.version || currentModule.version < m.version) {
                StoneLogger.info('upgrading module ' + m.name);
                m.db.up(currentModule, m);
            }
            
            if (!!currentModule && currentModule.version > m.version) {
                StoneLogger.info('downgrading module ' + m.name);
                m.db.down(currentModule, m);
            }
        });
        
        StoneLogger.info("DB: Done!!");
    }
}

const $databaseManager = new DatabaseManager();
Stone.getInstance().singleton('$databaseManager', $databaseManager);