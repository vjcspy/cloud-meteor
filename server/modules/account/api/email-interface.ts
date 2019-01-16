export enum USER_EMAIL_TEMPLATE  {
    REQUEST_TRIAL,
    SALE,
    TRIAL_EXPIRED,
    EXPIRED,
    INVOICE,
    PENDING_USER,
    REJECT_USER,
    LIST_EXPIRED,
    RENEW,
    SUBMIT_ADDITIONALFEE,
    INVOICE_FEE,
    PAYMENT_ERROR
};
export interface EmailInterface {
    product_id?: string;
    email: string;
    type: USER_EMAIL_TEMPLATE;
    status: number;

    created_at?: Date;
};