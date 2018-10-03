export interface  CartItemInterface {
    cart_id: string,
    name?: string,
    sku?: string,
    row_total: number,
    row_total_incl_tax: number,
    origin_image?: string
}