import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {BraintreeLogInterface} from "../api/braintree-log-interface";

export const BraintreeLogSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    user_id: String,
    entity_id: String,
    type: Number,
    transaction_data: String,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    updated_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    }
});

export const BraintreeLogCollection = CollectionMaker.make<BraintreeLogInterface>('braintree_log', BraintreeLogSchema);