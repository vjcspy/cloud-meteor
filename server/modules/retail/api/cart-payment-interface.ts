export interface  CartPaymentInterface {
    cart_id: string,
    name?: string,
    sku?: string,
    amount: number,
    refund_amount: number,
}