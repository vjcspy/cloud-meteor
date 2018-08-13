import * as _ from 'lodash';
import {Stone} from "../../../stone";
import {StoneModuleManager} from "../stone-module-manager";
import {ModuleConfigInterface} from "../../contract/module-declare/module-config-interface";
import {ProviderInterface} from "../../contract/module-declare/provider-interface";
import {StoneLogger} from "../../../logger/logger";

export class ProviderManager {
    boot() {
        StoneLogger.info("Provider: Booting");
        
        const $stoneModuleManager = Stone.getInstance().s('$stoneModuleManager') as StoneModuleManager;
        
        _.forEach($stoneModuleManager.$moduleResolved, (m: ModuleConfigInterface) => {
            _.forEach(m.providers, (p: ProviderInterface) => {
                p.boot();
            });
        });
        
        StoneLogger.info("Provider: Done!!");
    }
}


export const $providerManager = new ProviderManager();
Stone.getInstance().singleton('$providerManager', $providerManager);