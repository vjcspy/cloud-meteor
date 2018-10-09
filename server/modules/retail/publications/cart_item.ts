import {CartItemInterface} from "../api/cart-item-interface";
import {CartItemCollection} from "../collections/cart-item";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {LicenseCollection} from "../collections/licenses";
import {SecondScreenCollection} from "../collections/second-screen";
import * as _ from "lodash";

Meteor.publishComposite("cart_item", function (): PublishCompositeConfig<CartItemInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if(userModel.getLicenses()) {
        const license = LicenseCollection.find({_id: userModel.getLicenses()['license_id']});
        if (license) {
            const secondScreens = SecondScreenCollection.find({license_key: license['key']}).fetch();
            const cartIds = _.map(secondScreens, (s)=> s['cart_id']);
            return {
                find: function () {
                    return CartItemCollection.collection.find({cart_id: {$in: cartIds}});
                }
            };
        }
    }
});
