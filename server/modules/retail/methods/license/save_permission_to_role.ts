import * as $q from "q";
import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Role} from "../../../account/api/role";
import {License} from "../../models/license";

new ValidatedMethod({
  name: 'license.save_permission_to_role',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("user.get_roles", "Access denied");
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (!userModel.isInRoles([Role.USER], Role.GROUP_CLOUD))
      throw new Meteor.Error("user.save_permission", "You are not shop owner");
  },
  run: function (data) {
    let defer = $q.defer();
    const license = OM.create<License>(License).load(data['license_id']);
    let has_roles = _.map(license.getData('has_roles'), (role) => {
      if (role['code'] == data['role_id']){
        role['has_permissions'] = data['permissions'];
      }
      return role;
    });
    license.setData('has_roles', has_roles);
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});
