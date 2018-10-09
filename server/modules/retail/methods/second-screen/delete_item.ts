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
        if(data['deleteAllItems']) {
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
            .save();
    }
});
