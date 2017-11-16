export enum CreditTransactionReason {
    ADJUST_PLAN,
    MANUALLY_CHANGE
}

export interface UserCreditTransactionInterface {
    _id?: string;
    user_id: string;
    plan_id: string;
    reason: CreditTransactionReason;
    amount: number;
    description: string;
    created_at: Date;
}