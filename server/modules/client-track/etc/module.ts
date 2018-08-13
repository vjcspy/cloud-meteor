import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";

StoneModuleManager.config({
    name: 'client-track',
    version: '0.0.1',
    providers: [],
    dependencies: [
        'account'
    ]
});