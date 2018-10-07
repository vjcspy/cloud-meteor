import {OM} from "../../../../code/Framework/ObjectManager";
import {CartPayment} from "../../models/cart-payment";
import {CartPaymentCollection} from "../../collections/cart-payment";

new ValidatedMethod({
    name: "update.payments",
    validate: function () {
    },
    run: function (data: Object) {
        const payment = data['paymentMethodUsed'];
        let cartPayment: CartPayment = OM.create<CartPayment>(CartPayment);
        const cartPaymentData = CartPaymentCollection.findOne({cart_id: data['cart_id'], type:payment['type']});
        if (cartPaymentData) {
            cartPayment.loadById(cartPaymentData['_id']);
            cartPayment.setData('amount', payment['amount'])
                .setData('refund_amount', payment['refund_amount'])
                .save();
        } else {
            cartPayment.addData(payment).save();
        }
    }
});
