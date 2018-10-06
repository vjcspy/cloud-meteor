import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {CartInterface} from "../api/cart-interface";

export const CartCollection = CollectionMaker.make<CartInterface>("cart", new SimpleSchema({
    customer_name: {
        type:String,
        optional:true
    },
    discount:{
        type: Number,
        defaultValue: 0,
    },
    subtotal:{
        type: Number,
        defaultValue: 0,
    },
    subtotal_in_tax: {
        type: Number,
        defaultValue: 0,
    },
    shipping: {
        type: Number,
        defaultValue: 0,
    },
    shipping_incl_tax: {
        type: Number,
        defaultValue: 0,
    },
    tax: {
        type: Number,
        defaultValue: 0,
    },
    grand_total: {
        type: Number,
        defaultValue: 0,
    },
    gift_card_discount_amount: {
        type: Number,
        defaultValue: 0,
    },
    reward_point_discount_amount: {
        type: Number,
        defaultValue: 0,
    },
    point_earn: {
        type: Number,
        defaultValue: 0,
    },
}));
