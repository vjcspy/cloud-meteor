import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../api/role";
import {UserLicense} from "../../accounts/models/userlicense";
import {License} from "../../retails/models/license";

new ValidatedMethod({
  name: 'user.create_user',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("user.get_roles", "Access denied");
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (!userModel.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.USER], Role.GROUP_CLOUD)){
      throw new Meteor.Error("user.create_user_error", "Access denied");
    }
  },
  run: function (data) {
    let user = OM.create<User>(User).load(data['username'], "username");
    if (!user){
      let user_id = Accounts.createUser(data);
      Accounts.sendEnrollmentEmail(user_id);

    }
    user = OM.create<User>(User).load(data['username'], "username");
    if(!!data['license_id']){
      const license = OM.create<License>(License).load(data['license_id']);
      if (user) {
        if (data.hasOwnProperty('role')){
          user.setRoles(data['role'], Role.GROUP_SHOP);
        }
        return UserLicense.attach(user, license, User.LICENSE_PERMISSION_CASHIER, data['products']);
      }else
        throw new Meteor.Error("user.create_cashier_by_shop_owner", "Can't create cashier account");
    }
  }
});


DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.create_user",
                       }, 1, 1000);
