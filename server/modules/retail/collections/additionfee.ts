import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {AdditionFeeInterface} from "../api/addition-fee-interface";

export const AdditionFeeCollection = CollectionMaker.make<AdditionFeeInterface>("addition_fee", new SimpleSchema({
    user_id: String,
    name: String,
    description: {
        type: String,
        optional: true
    } ,
    cost : Number,
    status: Number,
    created_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    updated_at: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    }
}));