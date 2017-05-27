import {PriceInterface} from "../api/price.interface";
import {Prices} from "../collections/prices";

Meteor.publishComposite("prices", function (): PublishCompositeConfig<PriceInterface> {
  return {
    find(){
      return Prices.collection.find();
    }
  };
});
