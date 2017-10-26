import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {License} from "../../models/license";
new ValidatedMethod({
  name: "license.edit_license_user",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isShopOwner()) {
    } else {
      throw new Meteor.Error("license.edit_license_error", "Access denied");
    }
  },
  run: function (data: Object) {
    let defer = $q.defer();
    const license = OM.create<License>(License).loadById(data['license_id']);
    if(!license){
      throw new Meteor.Error("license.error_edit", "License Not Found");
    }
    license.setData('has_product', data['has_product']);
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});