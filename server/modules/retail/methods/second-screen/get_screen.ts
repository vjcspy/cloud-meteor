import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {SecondScreenCollection} from "../../collections/second-screen";
import {SecondScreen} from "../../models/second-screen";

new ValidatedMethod({
    name: "get.screen",
    validate: function () {
    },
    run: function (data: Object) {
        let secondScreenModel: SecondScreen = OM.create<SecondScreen>(SecondScreen);
        let secondScreen = SecondScreenCollection.find({license_key: data['license_key'], url: data['url'], register_id: data['register_id'], user_id: this.userId});
        let cartModel: Cart = OM.create<Cart>(Cart);
        if (secondScreen){
            return secondScreen['cart_id'];
        } else {
            cartModel.addData({name:'Guest Customer'}).save();
            secondScreenModel.addData({license_key: data['license_key'], url: data['url'], register_id: data['register_id'], user_id: this.userId, cart_id: cartModel.getId()}).save();
            return secondScreenModel.getData('cart_id');
        }
    }
});
