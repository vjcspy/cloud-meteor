export interface  CartItemInterface {
    cart_id: string,
    name?: string,
    sku?: string,
    qty:number,
    origin_price: number,
    row_total?: number,
    row_total_incl_tax?: number,
    origin_image?: string,
    base_row_total?: number,
    base_row_total_incl_tax?: number,
    is_refund_item: boolean,
    type_id?: string,
    product_id?: string,
    super_attribute?: string,
    bundle_option?: string,
    bundle_option_qty?: string,
    time?: string,
    parent_id?: string,
    pos_is_sales?: number,
    item_id?: string,
    children_calculated?: boolean
    is_qty_decimal: string,
    original_custom_price?: string,
    qty_to_refund?: number
}
