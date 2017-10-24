import * as $q from "q";
import * as _ from "lodash";
import {User} from "../../../accounts/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Role} from "../../../accounts/api/role";
import {Price} from "../../models/price";

new ValidatedMethod({
  name: "pricing.remove_pricing",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("product.edit_product_error", "Access denied");
    }
  },
  run: function (data: string) {
    let defer = $q.defer();
    const product = OM.create<Price>(Price).loadById(data);
    if(!product){
      throw new Meteor.Error("product.error_edit", "Product Not Found");
    }
    product.remove().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});