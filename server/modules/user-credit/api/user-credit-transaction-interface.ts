export enum CreditTransactionReason {
    ADD_CREDIT_WHEN_ADJUST_PLAN,
    REDUCE_CREDIT_WHEN_CHECKOUT,
    MANUALLY_CHANGE
}

export interface UserCreditTransactionInterface {
    _id?: string;
    user_id: string;
    plan_id?: string;
    reason: CreditTransactionReason;
    amount: number;
    description: string;
    created_at: Date;
}