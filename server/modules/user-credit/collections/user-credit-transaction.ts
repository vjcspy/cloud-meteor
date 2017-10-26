import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";

export const userCreditTransactionSchema     = new SimpleSchema(
    {
        _id: String,
        type: SimpleSchema.Integer,
        amount: Number,
        created_at: Date
    }
);
export const UserCreditTransactionCollection = CollectionMaker.make<UserCreditTransactionInterface>('user_credit_transaction', userCreditTransactionSchema);