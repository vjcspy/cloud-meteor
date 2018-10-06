export interface  CartInterface {
    customer_name?: string,
    discount: number,
    subtotal: number,
    subtotal_incl_tax: number,
    shipping: number,
    shipping_incl_tax: number,
    tax: number,
    grand_total: number,
    gift_card_discount_amount: number,
    reward_point_discount_amount: number,
    point_earn: number,
}