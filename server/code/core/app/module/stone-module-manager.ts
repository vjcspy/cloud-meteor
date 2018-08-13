import {ModuleConfigInterface} from "../contract/module-declare/module-config-interface";
import * as _ from 'lodash';
import {Stone} from "../../stone";
import {DatabaseManager} from "./entity/database-manager";
import {ProviderManager} from "./entity/provider-manager";
import {StoneModuleCollection} from "./collections/stone-modules";

export class StoneModuleManager {
    private static $modules: ModuleConfigInterface[]  = [];
    private _$moduleResolved: ModuleConfigInterface[] = [];
    
    public static config(module: ModuleConfigInterface) {
        const existed = _.find(StoneModuleManager.$modules, (m) => m.name === module.name);
        if (existed) {
            throw new Meteor.Error('app_module', 'module_has_already_existed');
        }
        
        StoneModuleManager.$modules.push(module);
    }
    
    get $moduleResolved(): ModuleConfigInterface[] {
        return this._$moduleResolved;
    }
    
    boot() {
        this._prepareModuleDepend(StoneModuleManager.$modules);
        
        const $providerManager = Stone.getInstance().s('$providerManager') as ProviderManager;
        const $databaseManager = Stone.getInstance().s('$databaseManager') as DatabaseManager;
    
        $providerManager.boot();
        $databaseManager.boot();
        
        this._afterConfigModule();
    }
    
    protected _afterConfigModule() {
        _.forEach(this._$moduleResolved, (m: ModuleConfigInterface) => {
            StoneModuleCollection.upsert({name: m.name}, {$set: {name: m.name, version: m.version}});
        });
    }
    
    protected _prepareModuleDepend(modules: ModuleConfigInterface[]) {
        let _unresolved = [];
        
        let depResolve = (module: ModuleConfigInterface) => {
            const moduleHasResolved = _.find(this._$moduleResolved, (_m) => _m.name === module.name);
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
            
            this._$moduleResolved.push(module);
        };
        
        _.forEach(modules, (m) => depResolve(m));
        
        return this._$moduleResolved;
    }
}

export const $stoneModuleManager = new StoneModuleManager();
Stone.getInstance().singleton('$stoneModuleManager', $stoneModuleManager);