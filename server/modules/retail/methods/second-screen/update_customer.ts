import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {SecondScreenCollection} from "../../collections/second-screen";
import {SecondScreen} from "../../models/second-screen";

new ValidatedMethod({
    name: "update.customer",
    validate: function () {
    },
    run: function (data: Object) {
        let cartModel: Cart = OM.create<Cart>(Cart).loadById(data['cart_id']);
        if (cartModel) {
            cartModel.setData('customer_name' , data['customer_name']).save();
        }
    }
});
