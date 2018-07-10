import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {AgencyInvoiceInterface, StatusPaid} from "../api/agency-invoice-interface";

export const AgencyInvoicesCollection = CollectionMaker.make<AgencyInvoiceInterface>("agency_invoice", new SimpleSchema({
    user_id: String,
    month: Number,
    year: Number,
    status: Number,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    grand_total: {
        type: Number,
        optional: true
    } ,
}));