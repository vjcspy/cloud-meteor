import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {HandleCreateInvoice} from "../observers/handle-create-invoice";
import {HandleAdminChangeLicense} from "../observers/handle-admin-change-license";

StoneEventManager.observer('invoice_create_after', 'handle_create_invoice', new HandleCreateInvoice(), 1);
StoneEventManager.observer('admin_mannualy_change_license', 'handle_admin_mannualy_change_license', new HandleAdminChangeLicense(), 1);