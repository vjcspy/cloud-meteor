import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItemCollection} from "../../collections/cart-item";
import {CartPaymentCollection} from "../../collections/cart-payment";
new ValidatedMethod({
    name: "compete.cart",
    validate: function () {
    },
    run: function (data: Object) {
        CartItemCollection.remove({cart_id: data['cart_id']});
        CartPaymentCollection.remove({cart_id: data['cart_id']});
        let cart: Cart         = OM.create<Cart>(Cart).loadById(data['cart_id']);
        if(cart) {
            cart.setData('discount', 0)
                .setData('gift_card_discount_amount', 0)
                .setData('grand_total', 0)
                .setData('points_earn', 0)
                .setData('reward_point_discount_amount', 0)
                .setData('shipping', 0)
                .setData('subtotal', 0)
                .setData('subtotal_incl_tax', 0)
                .setData('shipping_incl_tax', 0)
                .setData('tax', 0)
                .save();
        }
    }
});
