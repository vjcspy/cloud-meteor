import * as $q from 'q';
import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../models/license";
import {Products} from "../../collections/products";
import * as _ from "lodash";

new ValidatedMethod({
  name: "license.add_product_to_license",
  validate: function () {
  },
  run: function (data: Object) {
    let defer = $q.defer();
    const license: License = OM.create<License>(License).loadById(data['license_id']);
    if (data.hasOwnProperty('license_id')) {
      if (data.hasOwnProperty('product_id') && data.hasOwnProperty('pricing_id')) {
        let product_id = data['product_id'];
        let pricing_id = data['pricing_id'];
        let product = Products.collection.findOne({"_id": data['product_id']});
        if (!!product) {

          if (!!license) {
            //create object in has product to add new product to license
            let product_in_license = {
              "product_id": product_id,
              "pricing_id": pricing_id,
              "status": 1,
              "start_version": product['versions'][0]['version'],
              "purchase_date": new Date(),
              "active_date": new Date(),
              "expired_date": new Date(),
            };
            let has_product = [];
            if (!!license.getData('has_product')) {
              has_product = license.getData('has_product');
              let findProductInHasProduct = _.find(has_product, (p) => {
                return p['product_id'] == data['product_id'];
              });
              if (!!findProductInHasProduct) {
                throw new Meteor.Error('add_product_to_license', 'Product is assigned in license');
              }

              has_product.push(product_in_license);
            }
            has_product = [product_in_license];
          }
          license.unsetData('has_product');
          license.addData('has_product');
        }
      }
    }
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));

    return defer.promise;
  }
});
