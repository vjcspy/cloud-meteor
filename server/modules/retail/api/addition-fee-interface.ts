export enum AdditionFeeStatus {
    SALE_PENDING, // plan hasn't had any invoice yet (include lifetime,subscription or any type)
    SALE_COMPLETE, // plan is life time and has completed
    SALE_CLOSE
}

export interface AdditionFeeInterface {
    user_id: String,
    name: String,
    description?: String ,
    cost: Number,
    status: AdditionFeeStatus,
    created_at?: Date,
    updated_at?: Date
}