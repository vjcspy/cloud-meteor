import {ProviderInterface} from "./provider-interface";

export interface ModuleConfigInterface {
    name: string;
    version: string;
    providers: ProviderInterface[],
    dependencies: string[]
}