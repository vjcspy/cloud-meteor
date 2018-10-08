export interface  CartPaymentInterface {
    cart_id: string,
    type: string,
    title: string,
    amount: number,
    refund_amount: number,
    is_purchase: number,
    created_at: string,
}