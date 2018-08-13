import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {AddCreditAfterAdjustPlan} from "../observers/add-credit-after-adjust-plan";
import {ReducerCreditAfterCreateInvoice} from "../observers/reducer-credit-after-create-invoice";

StoneEventManager.observer('invoice_create_after', 'handle_create_invoice_to_add_credit', new AddCreditAfterAdjustPlan(), 2);
StoneEventManager.observer('invoice_create_after', 'handle_create_invoice_to_reduce_credit', new ReducerCreditAfterCreateInvoice(), 1);