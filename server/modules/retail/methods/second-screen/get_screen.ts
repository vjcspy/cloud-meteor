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
        let defer = $q.defer();
        let secondScreenModel: SecondScreen = OM.create<SecondScreen>(SecondScreen);
        let secondScreen = SecondScreenCollection.findOne({license_key: data['license_key'], url: data['url'], register_id: data['register_id'], user_id: this.userId});
        let cartModel: Cart = OM.create<Cart>(Cart);
        if (secondScreen){
            return secondScreen['cart_id'];
        } else {
            cartModel.addData({customer_name: 'Guest Customer'}).save()
                     .then(() => {
                         secondScreenModel.addData({
                                                       license_key: data['license_key'],
                                                       url: data['url'],
                                                       register_id: data['register_id'],
                                                       user_id: this.userId,
                                                       cart_id: cartModel.getId()
                                                   }).save()
                                          .then(() => {
                                              return defer.resolve(secondScreenModel.getData('cart_id'));
                                          })
                                          .catch((err) => defer.reject(err));
                     });
        }
        return defer.promise;
    }
});
