import {Prices} from "../collections/prices";
import {PriceInterface} from "../api/price-interface";

Meteor.publishComposite("prices", function (): PublishCompositeConfig<PriceInterface> {
    return {
        find() {
            return Prices.collection.find();
        }
    };
});
