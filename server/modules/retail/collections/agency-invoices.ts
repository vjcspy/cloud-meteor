import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {AgencyInvoiceInterface} from "../api/agency-invoice-interface";

export const AgencyInvoicesCollection = CollectionMaker.make<AgencyInvoiceInterface>("agency_invoice", new SimpleSchema({
    user_id: String,
    invoice_id: String,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    commission: {
        type: Number,
        optional: true
    } ,
}));