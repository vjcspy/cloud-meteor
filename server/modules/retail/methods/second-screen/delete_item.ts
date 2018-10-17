import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";
import {CartItemCollection} from "../../collections/cart-item";
import {CartCollection} from "../../collections/cart";

new ValidatedMethod({
    name: "delete.item",
    validate: function () {
    },
    run: function (data: Object) {
        const item = data['item'];
        const totals = data['totals'];
        let cartItem: CartItem = OM.create<CartItem>(CartItem);
        let cart: Cart = OM.create<Cart>(Cart).loadById(data['cart_id']);
        if(data['deleteAllItems'] == true) {
            CartItemCollection.remove({cart_id: data['cart_id']});
        } else {
            let cartItemData;
            if(item['type_id'] === 'configurable') {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], product_id: item['product_id'], super_attribute: JSON.stringify(item['super_attribute']), time: item['time']});
            } else if(item['type_id'] === 'bundle') {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], product_id: item['product_id'], bundle_option: JSON.stringify(item['bundle_option']), bundle_option_qty: JSON.stringify(item['bundle_option_qty']), time: item['time']});
            } else {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], sku: item['sku'], product_id: item['product_id'], time: item['time']})
            }
            cartItem.loadById(cartItemData['_id']);
            cartItem.remove();
        }
        
        if(data['deleteAllItems'] == true) {
            cart.setData('discount', 0)
                .setData('customer_name' , data['customer_name'])
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
                .setData('subtotal_refund_incl_tax', 0)
                .setData('refund_shipping_incl_tax', 0)
                .setData('refund_tax', 0)
                .setData('refund_shipping', 0)
                .setData('adjustment', 0)
                .setData('total_exchange_amount', 0)
                .setData('is_integrate_reward_points', false)
                .setData('hasShipment', false)
                .setData('hasPointsEarn', false)
                .setData('email_subscribe', '')
                .setData('is_subscribe', true)
                .setData('is_complete_order', data['is_complete_order'])
                .save();
        } else {
            cart.setData('discount', totals['discount'])
                .setData('customer_name' , data['customer_name'])
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
                .setData('is_complete_order', data['is_complete_order'])
                .setData('base_shipping', totals['base_shipping'])
                .setData('base_subtotal', totals['base_subtotal'])
                .setData('base_subtotal_incl_tax', totals['base_subtotal_incl_tax'])
                .setData('base_shipping_incl_tax', totals['base_shipping_incl_tax'])
                .setData('base_tax', totals['base_tax'])
                .setData('remain', totals['remain'])
                .setData('cash_rounding', totals['cash_rounding'])
                .setData('refunded_total', totals['refunded_total'])
                .setData('subtotal_refund', totals['subtotal_refund'])
                .setData('refund_discount', totals['refund_discount'])
                .setData('refund_tax', totals['refund_tax'])
                .setData('subtotal_refund_incl_tax', totals['subtotal_refund_incl_tax'])
                .setData('refund_shipping_incl_tax', totals['refund_shipping_incl_tax'])
                .setData('refund_shipping', totals['refund_shipping'])
                .setData('adjustment', totals['adjustment'])
                .setData('hasShipment', totals['hasShipment'])
                .setData('total_exchange_amount', totals['total_exchange_amount'])
                .setData('email_subscribe', totals['email_subscribe'])
                .setData('is_subscribe', totals['is_subscribe'])
                .setData('is_integrate_reward_points', totals['is_integrate_reward_points'])
                .save();
        }
    }
});
