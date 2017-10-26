export enum CreditTransactionType {
    ADJUST_PLAN,
    MANUALLY_CHANGE
}

export interface UserCreditTransactionInterface {
    _id?: string;
    type: CreditTransactionType;
    amount: number;
    created_at: Date;
}