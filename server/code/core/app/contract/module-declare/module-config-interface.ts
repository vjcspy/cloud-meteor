import {DbSchemalInterface} from "./db-schemal-interface";
import {ProviderInterface} from "./provider-interface";

export interface ModuleConfigInterface {
    name: string;
    version: string;
    db: DbSchemalInterface,
    providers: ProviderInterface[],
    dependencies: string[]
}