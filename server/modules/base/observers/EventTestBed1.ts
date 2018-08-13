import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";

export class EventTestBed1 implements ObserverInterface {
    observe(dataObject: DataObject): void {
        dataObject.setData('value', 'event_test_bed_1');
    }
}