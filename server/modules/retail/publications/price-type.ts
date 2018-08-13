import {PriceTypeInterface} from "../api/price-type-interface";
import {PriceTypesCollection} from "../collections/price-types";

Meteor.publishComposite("price_type", function (): PublishCompositeConfig<PriceTypeInterface> {
    return {
        find() {
            return PriceTypesCollection.collection.find();
        }
    };
});
