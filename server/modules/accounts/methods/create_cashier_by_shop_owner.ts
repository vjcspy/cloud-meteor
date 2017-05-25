import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../api/role";
import {License} from "../../licenses/models/license";
import {UserLicense} from "../models/userlicense";

new ValidatedMethod({
  name: 'user.create_cashier_by_shop_owner',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("user.get_roles", "Access denied");
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (!userModel.isShopOwner() || !userModel.isInRoles([Role.USER], Role.GROUP_SHOP))
      throw new Meteor.Error("user.create_cashier_by_shop_owner", "You do not have permission to action this");
  },
  run: function (data) {
    let cashier = OM.create<User>(User).load(data['username'], "username");
    if (!cashier)
      Accounts.createUser(
        {
          username: data['username'],
          email: data['email'],
          profile: {
            first_name: data['first_name'],
            last_name: data['last_name'],
            is_disabled: data['isDisabled']
          }
        });
    
    cashier       = OM.create<User>(User).load(data['username'], "username");
    const license = OM.create<License>(License).load(data['license_id']);
    if (cashier) {
      if (data.hasOwnProperty('role')){
        cashier.setRoles(data['role'], Role.GROUP_SHOP);
      }
      return UserLicense.attach(cashier, license, User.LICENSE_PERMISSION_CASHIER, data['products']);
    }
    else
      throw new Meteor.Error("user.create_cashier_by_shop_owner", "Can't create cashier account");
  }
});
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.create_cashier_by_shop_owner",
                       }, 1, 1000);
