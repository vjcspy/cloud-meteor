import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {UserCreditInterface} from "../api/user-credit-interface";

export const userCreditSchema     = new SimpleSchema(
    {
        _id: String,
        user_id: String,
        balance: Number,
    }
);
export const UserCreditCollection = CollectionMaker.make<UserCreditInterface>('user_credit', userCreditSchema);