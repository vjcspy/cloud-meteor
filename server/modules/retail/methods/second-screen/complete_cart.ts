import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItemCollection} from "../../collections/cart-item";
import {CartPaymentCollection} from "../../collections/cart-payment";
new ValidatedMethod({
    name: "complete.cart",
    validate: function () {
    },
    run: function (data: Object) {
        CartItemCollection.remove({cart_id: data['cart_id']});
        CartPaymentCollection.remove({cart_id: data['cart_id']});
        let cart: Cart         = OM.create<Cart>(Cart).loadById(data['cart_id']);
        if(cart) {
            cart.setData('discount', 0)
                .setData('retail_discount_per_item', 0)
                .setData('gift_card_discount_amount', 0)
                .setData('base_gift_card_discount_amount', 0)
                .setData('grand_total', 0)
                .setData('base_grand_total', 0)
                .setData('points_earn', 0)
                .setData('reward_point_discount_amount', 0)
                .setData('base_reward_point_discount_amount', 0)
                .setData('shipping', 0)
                .setData('subtotal', 0)
                .setData('subtotal_incl_tax', 0)
                .setData('shipping_incl_tax', 0)
                .setData('tax', 0)
                .setData('base_shipping', 0)
                .setData('base_subtotal', 0)
                .setData('base_subtotal_incl_tax', 0)
                .setData('base_shipping_incl_tax', 0)
                .setData('base_tax', 0)
                .setData('remain', 0)
                .setData('cash_rounding', 0)
                .setData('refunded_total', 0)
                .setData('subtotal_refund', 0)
                .setData('refund_discount', 0)
                .setData('refund_tax', 0)
                .setData('refund_shipping', 0)
                .setData('adjustment', 0)
                .setData('total_exchange_amount', 0)
                .setData('is_integrate_reward_points', false)
                .setData('is_complete_order', data['is_complete_order'])
                .save();
        }
    }
});
