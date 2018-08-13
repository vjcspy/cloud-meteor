import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {DataObject} from "../../../code/Framework/DataObject";
import {StoneLogger} from "../../../code/core/logger/logger";

new ValidatedMethod({
                        name: "base.test_method",
                        validate: function () {
                        },
                        run: function () {
                            // Test Event
                            let data = new DataObject();
                            StoneEventManager.dispatch('base.event_test_bed', data);
        
                            StoneLogger.debug("After event value", {value: data.getData('value')});
        
                            return "OK!";
                        }
                    });