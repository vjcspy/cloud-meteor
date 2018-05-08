import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {AdditionFeeInterface} from "../api/addition-fee-interface";

export const AdditionFeeCollection = CollectionMaker.make<AdditionFeeInterface>("addition_fee", new SimpleSchema({
    user_id: String,
    name: String,
    description: String ,
    cost : Number,
    status: SimpleSchema.Integer,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    updated_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    }
}));