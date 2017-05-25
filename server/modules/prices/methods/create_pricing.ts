import * as $q from "q";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../accounts/models/user";
import {Role} from "../../accounts/api/role";
import {Price} from "../models/price";

new ValidatedMethod({
  name: "pricing.create_pricing",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("pricing.create_pricing_error", "Access denied");
    }
  },
  run: function (data: Object) {
    let defer = $q.defer();

    let pricingModel = OM.create<Price>(Price);

    pricingModel.addData(data)
                .save()
                .then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});