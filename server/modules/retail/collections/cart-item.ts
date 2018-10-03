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
    row_total:{
        type: Number,
        defaultValue: 0,
    },
    row_total_incl_tax:{
        type: Number,
        defaultValue: 0,
    },
    origin_image: {
        type:String,
        optional:true
    },

}));
