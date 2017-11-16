import {Stone} from "../../stone";
import {DataObject} from "../../../Framework/DataObject";
import {ObserverInterface} from "./observer-interface";
import {List, Map} from 'immutable';

export class StoneEventManager {
    
    private static $events = Map<string, List<any>>();
    
    static dispatch(eventName: string, data: any): void {
        if (StoneEventManager.$events.has(eventName) && List.isList(StoneEventManager.$events.get(eventName))) {
            StoneEventManager.$events
                             .get(eventName)
                             .forEach((eventObserver: any) => {
                                 let observerData = new DataObject();
                                 observerData.setData('data', data);
                                 (eventObserver['observer'] as ObserverInterface).observe(observerData);
                             });
        }
    }
    
    static observer(eventName: string, registerId: string, observer: ObserverInterface, priority: number = 0): void {
        StoneEventManager.$events = StoneEventManager.$events.update(eventName, (events: List<any>) => {
            if (!events) {
                events = List.of();
            }
            return <any>(events.filter((o) => o['registerId'] !== registerId) as List<any>)
                .push({
                          registerId,
                          priority,
                          observer
                      })
                .sort((a, b) => {
                    if (a['priority'] < b['priority']) {
                        return -1;
                    } else if (a['priority'] > b['priority']) {
                        return 1
                    } else {
                        return 0;
                    }
                });
        });
    }
}

export const $stoneEventManager = new StoneEventManager();
Stone.getInstance().singleton('$stoneEventManager', $stoneEventManager);