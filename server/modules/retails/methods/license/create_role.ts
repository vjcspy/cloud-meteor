import * as $q from "q";
import {User} from "../../../accounts/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {Role} from "../../../accounts/api/role";
import {License} from "../../models/license";
import {StringHelper} from "../../../../code/Framework/StringHelper";


new ValidatedMethod({
  name: 'license.create_role',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("user.get_roles", "Access denied");
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (!userModel.isShopOwner() && !userModel.isInRoles([Role.USER], Role.GROUP_SHOP))
      throw new Meteor.Error("user.create_cashier_by_shop_owner", "You are not shop owner");
  },
  run: function (data) {
    let defer = $q.defer();
    const license = OM.create<License>(License).load(data['license_id']);
    let role = {
      name: data['name']
    };
    role['code'] = StringHelper.getUnique();

    if (!!license.getData('has_roles') && _.isArray(license.getData('has_roles'))){
      let has_roles = license.getData('has_roles');
      has_roles.push(role);
      license.setData('has_roles', has_roles);
    }else{
      license.setData('has_roles', [role]);
    }
    license.save().then(() => defer.resolve(), (err) => defer.reject(err));
    return defer.promise;
  }
});
