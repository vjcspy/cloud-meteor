import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {SecondScreenCollection} from "../../collections/second-screen";
import {SecondScreen} from "../../models/second-screen";

new ValidatedMethod({
    name: "create.screen",
    validate: function () {
    },
    run: function (data: Object) {
        let defer = $q.defer();
        let cartModel: Cart = OM.create<Cart>(Cart).loadById(data['retail_id']);
        if (!cartModel) {
            cartModel.addData({retail_id: data['retail_id']}).save();
        }
        let secondScreenModel: SecondScreen = OM.create<SecondScreen>(SecondScreen);
        let secondScreen = SecondScreenCollection.find({license_key: data['license_key'], url: data['url'], register_id: data['register_id']});
        if (secondScreen){
            if(secondScreen['cart_id'] !== cartModel.getId()) {
                secondScreenModel.loadById(secondScreen['_id']);
                secondScreenModel.setData('cart_id', cartModel.getId());
            }
        } else {
            secondScreenModel.addData({license_key: data['license_key'], url: data['url'], register_id: data['register_id'], cart_id: cartModel.getId()}).save();
        }

        return defer.promise;
    }
});
