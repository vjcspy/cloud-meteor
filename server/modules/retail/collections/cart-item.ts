import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {CartItemInterface} from "../api/cart-item-interface";

export const CartItemCollection = CollectionMaker.make<CartItemInterface>("cart_item", new SimpleSchema({
                                                                                                            cart_id: String,
                                                                                                            name: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            sku: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            qty: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                            },
                                                                                                            qty_to_refund: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0
                                                                                                            },
                                                                                                            origin_price: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                            },
                                                                                                            row_total: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            row_total_incl_tax: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            base_row_total: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            base_row_total_incl_tax: {
                                                                                                                type: Number,
                                                                                                                defaultValue: 0,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            is_refund_item: {
                                                                                                                type: Boolean,
                                                                                                                defaultValue: false,
                                                                                                            },
                                                                                                            origin_image: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            type_id: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            product_id: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            super_attribute: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            bundle_option: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            bundle_option_qty: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            parent_id: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            pos_is_sales: {
                                                                                                                type: Number,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            item_id: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            time: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            children_calculated: {
                                                                                                                type: Boolean,
                                                                                                                defaultValue: false,
                                                                                                                optional: true
                                                                                                            },
                                                                                                            is_qty_decimal: {
                                                                                                                type: String,
                                                                                                                defaultValue: 0
                                                                                                            },
                                                                                                            original_custom_price: {
                                                                                                                type: String,
                                                                                                                optional: true
                                                                                                            }
    
                                                                                                        }));
