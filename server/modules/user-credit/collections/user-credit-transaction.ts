import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";

export const userCreditTransactionSchema     = new SimpleSchema(
    {
        _id: String,
        user_id: String,
        plan_id: String,
        reason: SimpleSchema.Integer,
        description: String,
        amount: Number,
        created_at: Date
    }
);
export const UserCreditTransactionCollection = CollectionMaker.make<UserCreditTransactionInterface>('user_credit_transaction', userCreditTransactionSchema);