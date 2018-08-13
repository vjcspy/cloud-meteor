import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {EventTestBed1} from "../observers/EventTestBed1";

StoneEventManager.observer('base.event_test_bed', 'event_test_1', new EventTestBed1(), 1);