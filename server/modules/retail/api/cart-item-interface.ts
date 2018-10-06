export interface  CartItemInterface {
    cart_id: string,
    name?: string,
    sku?: string,
    qty:number,
    origin_price: number,
    row_total: number,
    row_total_incl_tax: number,
    origin_image?: string,
    base_row_total: number,
    base_row_total_incl_tax: number,
    is_refund_item: boolean,
}