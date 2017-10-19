import {Stone} from "../../../stone";
import {DbSchemalInterface} from "../../contract/module-declare/db-schemal-interface";

export class DatabaseManager {
    private static $schemal: DbSchemalInterface[] = [];
    
    boot() {
    
    }
    
    addSchemal(...s: DbSchemalInterface[]): void {
        DatabaseManager.$schemal.push(...s);
    }
}

export const $databaseManager = new DatabaseManager();
Stone.getInstance().singleton('$databaseManager', $databaseManager);