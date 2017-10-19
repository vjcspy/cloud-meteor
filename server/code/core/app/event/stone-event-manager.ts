import {Stone} from "../../stone";
import {DataObject} from "../../../Framework/DataObject";

export class StoneEventManager {
    
    static dispatch(eventName: string, object: DataObject) {
    
    }
    
    static observer(eventName, callBack: (object: DataObject) => void, priority: number = 0) {
    
    }
    
}

export const $stoneEventManager = new StoneEventManager();
Stone.getInstance().singleton('$stoneEventManager', $stoneEventManager);