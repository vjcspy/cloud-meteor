import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PlanInterface} from "../api/plan-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {InvoiceInterface} from "../api/invoice-interface";

export const invoiceSchema = new SimpleSchema(
    {
        _id: {
            type: String,
            optional: true
        },
        user_id: String,
        plan_id: String,

        grand_total: Number,
        payment_data: String,
        totals: String,
        created_at: {
            type: Date,
            defaultValue: DateTimeHelper.getCurrentDate()
        },
        updated_at: {
            type: Date,
            defaultValue: DateTimeHelper.getCurrentDate()
        }
    }
);

export const InvoiceCollection = CollectionMaker.make<InvoiceInterface>('sales_invoice', invoiceSchema);