import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {CartInterface} from "../api/cart-interface";

export const CartCollection = CollectionMaker.make<CartInterface>("cart", new SimpleSchema({
                                                                                               customer_name: {
                                                                                                   type: String,
                                                                                                   optional: true
                                                                                               },
                                                                                               discount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               retail_discount_per_item: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               subtotal: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               subtotal_incl_tax: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_subtotal: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_subtotal_incl_tax: {
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
                                                                                               base_shipping: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_shipping_incl_tax: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_tax: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_grand_total: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               gift_card_discount_amount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_gift_card_discount_amount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               reward_point_discount_amount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               base_reward_point_discount_amount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               points_earn: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                               },
                                                                                               remain: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               cash_rounding: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               refunded_total: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               subtotal_refund: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               refund_discount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               refund_tax: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               refund_shipping: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               adjustment: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                               total_exchange_amount: {
                                                                                                   type: Number,
                                                                                                   defaultValue: 0,
                                                                                                   optional: true
                                                                                               },
                                                                                           }));
