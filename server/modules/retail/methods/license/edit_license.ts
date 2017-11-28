import * as $q from "q";
import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {License} from "../../models/license";
new ValidatedMethod({
  name: "license.edit_license",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("license.edit_license_error", "Access denied");
    }
  },
  run: function (data: Object) {
    let defer = $q.defer();
    const license = OM.create<License>(License).loadById(data['_id']);
    if(!license){
      throw new Meteor.Error("license.error_edit", "License Not Found");
    }
    _.forEach(license._data, function(value, key){
        license.unsetData(key);
    });
    license.addData(data);
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});