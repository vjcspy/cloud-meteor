import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {InvoiceInterface,InvoiceType} from "../api/invoice-interface";

export const invoiceSchema = new SimpleSchema(
    {
        _id: {
            type: String,
            optional: true
        },
        user_id: String,
        product_id: String,
        agency_id: {
            type: String,
            optional: true
        },
        entity_id: String,
        coupon_id: {
            type: String,
            optional: true
        },
        type: Number,
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