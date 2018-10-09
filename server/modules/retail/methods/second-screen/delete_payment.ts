import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";
import {CartItemCollection} from "../../collections/cart-item";
import {CartCollection} from "../../collections/cart";
import {CartPayment} from "../../models/cart-payment";
import {CartPaymentCollection} from "../../collections/cart-payment";

new ValidatedMethod({
    name: "delete.payment",
    validate: function () {
    },
    run: function (data: Object) {
        const payment = data['paymentMethodUsed'];
        let cartPayment: CartPayment = OM.create<CartPayment>(CartPayment);
        if(data['deleteAllPayment'] == true) {
            CartPaymentCollection.remove({cart_id: data['cart_id']});
        } else {
            const paymentData = CartPaymentCollection.findOne({cart_id: data['cart_id'], type: payment['type'], time: payment['time']});
            cartPayment.loadById(paymentData['_id']);
            cartPayment.remove();
        }
    }
});
