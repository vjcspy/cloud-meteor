import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {HandleAfterCreatePlan} from "../observers/handle-after-create-plan";

StoneEventManager.observer('plan_create_after', 'handle_create_invoice', new HandleAfterCreatePlan(), 1);