import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";
import {CartItemCollection} from "../../collections/cart-item";
import {CartCollection} from "../../collections/cart";

new ValidatedMethod({
                        name: "update.totals",
                        validate: function () {
                        },
                        run: function (data: Object) {
                            const totals           = data['totals'];
                            let cart: Cart         = OM.create<Cart>(Cart).loadById(data['cart_id']);
        
                            cart.setData('discount', totals['discount'])
                                .setData('retail_discount_per_item', totals['retail_discount_per_item'])
                                .setData('gift_card_discount_amount', totals['gift_card_discount_amount'])
                                .setData('base_gift_card_discount_amount', totals['base_gift_card_discount_amount'])
                                .setData('grand_total', totals['grand_total'])
                                .setData('base_grand_total', totals['base_grand_total'])
                                .setData('points_earn', totals['points_earn'])
                                .setData('reward_point_discount_amount', totals['reward_point_discount_amount'])
                                .setData('base_reward_point_discount_amount', totals['base_reward_point_discount_amount'])
                                .setData('shipping', totals['shipping'])
                                .setData('subtotal', totals['subtotal'])
                                .setData('subtotal_incl_tax', totals['subtotal_incl_tax'])
                                .setData('shipping_incl_tax', totals['shipping_incl_tax'])
                                .setData('tax', totals['tax'])
                                .setData('base_shipping', totals['base_shipping'])
                                .setData('base_subtotal', totals['base_subtotal'])
                                .setData('base_subtotal_incl_tax', totals['base_subtotal_incl_tax'])
                                .setData('base_shipping_incl_tax', totals['base_shipping_incl_tax'])
                                .setData('base_tax', totals['base_tax'])
                                .setData('remain', totals['remain'])
                                .setData('cash_rounding', totals['cash_rounding'])
                                .setData('refunded_total', totals['refunded_total'])
                                .setData('subtotal_refund', totals['subtotal_refund'])
                                .setData('is_complete_order', data['is_complete_order'])
                                .setData('refund_discount', totals['refund_discount'])
                                .setData('refund_tax', totals['refund_tax'])
                                .setData('refund_shipping', totals['refund_shipping'])
                                .setData('adjustment', totals['adjustment'])
                                .setData('hasShipment', totals['hasShipment'])
                                .setData('is_integrate_reward_points', totals['is_integrate_reward_points'])
                                .setData('subtotal_refund_incl_tax', totals['subtotal_refund_incl_tax'])
                                .setData('refund_shipping_incl_tax', totals['refund_shipping_incl_tax'])
                                .setData('total_exchange_amount', totals['total_exchange_amount'])
                                .save();
                        }
                    });
