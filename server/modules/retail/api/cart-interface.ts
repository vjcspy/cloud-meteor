export interface  CartInterface {
    customer_name?: string,
    discount: number,
    retail_discount_per_item: number,
    subtotal: number,
    subtotal_incl_tax: number,
    base_subtotal: number,
    base_subtotal_incl_tax: number,
    shipping: number,
    shipping_incl_tax: number,
    tax: number,
    grand_total: number,
    base_shipping: number,
    base_shipping_incl_tax: number,
    base_tax: number,
    base_grand_total: number,
    gift_card_discount_amount: number,
    base_gift_card_discount_amount: number,
    reward_point_discount_amount: number,
    base_reward_point_discount_amount: number,
    points_earn: number,
}
