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
            if(data['type_id'] === 'configurable') {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], product_id: item['product_id'], super_attribute: item['super_attribute'], created_at: item['created_at']});
            } else if(data['type_id'] === 'bundle') {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], product_id: item['product_id'], bundle_option: item['bundle_option'], bundle_option_qty: item['bundle_option_qty'], created_at: item['created_at']});
            } else {
                cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], sku: item['sku'], product_id: item['product_id'], created_at: item['created_at']})
            }
            cartItem.loadById(cartItemData['_id']);
            cartItem.remove();
        }

        cart.setData('discount', totals['discount'])
            .setData('gift_cart_discount_amount', totals['gift_cart_discount_amount'])
            .setData('grand_total', totals['grand_total'])
            .setData('points_earn', totals['points_earn'])
            .setData('reward_point_discount_amount', totals['reward_point_discount_amount'])
            .setData('shipping', totals['shipping'])
            .setData('subtotal', totals['subtotal'])
            .setData('subtotal_incl_tax', totals['subtotal_incl_tax'])
            .setData('shipping_incl_tax', totals['shipping_incl_tax'])
            .setData('tax', totals['tax'])
            .save();
    }
});
