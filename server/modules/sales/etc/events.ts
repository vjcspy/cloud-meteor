import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {HandleCreateInvoice} from "../observers/handle-create-invoice";

StoneEventManager.observer('invoice_create_after', 'handle_create_invoice', new HandleCreateInvoice(), 1);