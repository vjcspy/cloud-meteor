import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {CartPaymentInterface} from "../api/cart-payment-interface";

export const CartPaymentCollection = CollectionMaker.make<CartPaymentInterface>("cart_payment", new SimpleSchema({
    cart_id: String,
    type: {
        type:String,
        optional:true
    },
    title: {
        type:String,
        optional:true
    },
    amount:{
        type: Number,
        defaultValue: 0,
    },
    refund_amount:{
        type: Number,
        defaultValue: 0,
    },
    is_purchase:{
        type: Number,
        optional: true,
    },
    created_at: String,
}));
