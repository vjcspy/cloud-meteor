import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {CartItemInterface} from "../api/cart-item-interface";

export const CartItemCollection = CollectionMaker.make<CartItemInterface>("cart_item", new SimpleSchema({
    cart_id: String,
    name: {
        type:String,
        optional:true
    },
    sku: {
        type:String,
        optional:true
    },
    qty: {
        type: Number,
        defaultValue: 0,
    },
    origin_price: {
        type: Number,
        defaultValue: 0,
    },
    row_total:{
        type: Number,
        defaultValue: 0,
    },
    row_total_incl_tax:{
        type: Number,
        defaultValue: 0,
    },
    base_row_total:{
        type: Number,
        defaultValue: 0,
    },
    base_row_total_incl_tax:{
        type: Number,
        defaultValue: 0,
    },
    is_refund_item:{
        type: Boolean,
        defaultValue: false,
    },
    origin_image: {
        type:String,
        optional:true
    },
    type: {
        type:String,
        optional:true
    },
    product_id: {
        type:String,
        optional:true
    },
    super_attribute: {
        type: Object,
        optional:true
    },
    bundle_option: {
        type: Object,
        optional:true
    },
    bundle_option_qty: {
        type: Object,
        optional:true
    },
    parent_id: {
        type: String,
        optional:true
    },
    created_at: String,

}));
