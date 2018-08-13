import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {EmailInterface} from "../api/email-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const EmailCollection = CollectionMaker.make<EmailInterface>("email", new SimpleSchema({
    product_id: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    type: Number,
    status: SimpleSchema.Integer,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
}));
