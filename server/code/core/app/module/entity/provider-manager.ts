import {ProviderInterface} from "../../contract/module-declare/provider-interface";
import * as _ from 'lodash';
import {Stone} from "../../../stone";

export class ProviderManager {
    private static $providers: ProviderInterface[] = [];
    
    boot() {
        _.forEach(ProviderManager.$providers, (provider: ProviderInterface) => {
            provider.boot();
        });
    }
    
    addProvider(...provider: ProviderInterface[]): void {
        ProviderManager.$providers.push(...provider);
    }
}


export const $providerManager = new ProviderManager();
Stone.getInstance().singleton('$providerManager', $providerManager);