import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {ReducerCreditAfterCreatePlan} from "../observers/reducer-credit-after-create-plan";

StoneEventManager.observer('sale_plan_save_after', 'reducer_store_credit_after_create_plan', new ReducerCreditAfterCreatePlan());