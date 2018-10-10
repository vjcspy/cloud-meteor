import {CartPaymentInterface} from "../api/cart-payment-interface";
import {CartPaymentCollection} from "../collections/cart-payment";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {LicenseCollection} from "../collections/licenses";
import {SecondScreenCollection} from "../collections/second-screen";
import * as _ from "lodash";
Meteor.publishComposite("cart_payment", function (): PublishCompositeConfig<CartPaymentInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if(userModel.getLicenses()) {
        const license = LicenseCollection.findOne({_id: userModel.getLicenses()[0]['license_id']});
        if (license) {
            const secondScreens = SecondScreenCollection.find({license_key: license['key']}).fetch();
            const cartIds = _.map(secondScreens, (s)=> s['cart_id']);
            return {
                find: function () {
                    return CartPaymentCollection.collection.find({cart_id: {$in: cartIds}});
                }
            };
        }
    }
});
