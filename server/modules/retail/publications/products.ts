import {ProductInterface} from "../api/product-interface";
import {Products} from "../collections/products";

Meteor.publishComposite("products", function (): PublishCompositeConfig<ProductInterface> {
  return {
    find: function () {
      return Products.collection.find();
    }
  };
});
