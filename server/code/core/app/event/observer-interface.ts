import {DataObject} from "../../../Framework/DataObject";

export interface ObserverInterface {
    observe(dataObject: DataObject): void;
}