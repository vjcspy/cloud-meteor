import {ModuleConfigInterface} from "../contract/module-declare/module-config-interface";
import * as _ from 'lodash';
import {Stone} from "../../stone";
import {DatabaseManager} from "./entity/database-manager";
import {ProviderManager} from "./entity/provider-manager";

export class StoneModuleManager {
    private static $modules: ModuleConfigInterface[]   = [];
    protected $moduleResolved: ModuleConfigInterface[] = [];
    
    public static config(module: ModuleConfigInterface) {
        const existed = _.find(StoneModuleManager.$modules, (m) => m.name === module.name);
        if (existed) {
            throw new Meteor.Error('app_module', 'module_has_already_existed');
        }
        
        StoneModuleManager.$modules.push(module);
    }
    
    boot() {
        this._prepareModuleDepend(StoneModuleManager.$modules);
        
        const $providerManager = Stone.getInstance().s('$providerManager') as ProviderManager;
        const $databaseManager = Stone.getInstance().s('$databaseManager') as DatabaseManager;
        
        _.forEach(this.$moduleResolved, (m: ModuleConfigInterface) => {
            $providerManager.addProvider(...m.providers);
            $databaseManager.addSchemal(m.db);
        });
        
        $providerManager.boot();
        $databaseManager.boot();
    }
    
    protected _prepareModuleDepend(modules: ModuleConfigInterface[]) {
        let _unresolved = [];
        
        let depResolve = (module: ModuleConfigInterface) => {
            const moduleHasResolved = _.find(this.$moduleResolved, (_m) => _m.name === module.name);
            if (moduleHasResolved)
                return;
            
            _unresolved.push(module);
            
            _.forEach(module.dependencies, (_depName) => {
                if (_.indexOf(_unresolved, _depName) > -1) {
                    throw new Meteor.Error('app_module', `circular_reference_detected: ${_depName} -> ${module.name}`);
                }
                const depModule = _.find(modules, (_m) => _m.name === _depName);
                
                if (!depModule) {
                    throw new Meteor.Error('app_module', `can_not_find_depend_module`);
                }
                
                depResolve(depModule);
            });
            
            this.$moduleResolved.push(module);
        };
        
        _.forEach(modules, (m) => depResolve(m));
        
        console.log(this.$moduleResolved);
        
        return this.$moduleResolved;
    }
}

export const $stoneModuleManager = new StoneModuleManager();
Stone.getInstance().singleton('$stoneModuleManager', $stoneModuleManager);