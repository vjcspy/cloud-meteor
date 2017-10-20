import {ProviderInterface} from "./provider-interface";
import {DbSchemaInterface} from "./db-schema-interface";

export interface ModuleConfigInterface {
    name: string;
    version: string;
    db: DbSchemaInterface,
    providers: ProviderInterface[],
    dependencies: string[]
}