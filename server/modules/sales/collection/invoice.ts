import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PlanInterface} from "../api/plan-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const invoiceSchema = new SimpleSchema(
    {
        _id: {
            type: String,
            optional: true
        },
        user_id: String,
        product_id: String,
        
        pricing_id: String,
        pricing_code: String,
        pricing_cycle: Number,
        
        price: Number,
        discount_amount: Number,
        add_on: Number,
        grand_total: Number,
        addition_data: {
            type: Object,
            optional: true
        },
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

export const InvoiceCollection = CollectionMaker.make<PlanInterface>('sales_invoice', invoiceSchema);