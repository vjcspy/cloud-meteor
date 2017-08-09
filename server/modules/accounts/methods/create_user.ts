import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../api/role";
import {License} from "../../retails/models/license";
import {UserLicense} from "../models/userlicense";

new ValidatedMethod({
  name: 'user.create_user',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("user.get_roles", "Access denied");
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (!userModel.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.USER], Role.GROUP_CLOUD)) {
      throw new Meteor.Error("user.create_user_error", "Access denied");
    }
  },
  run: function (data) {
    let user = OM.create<User>(User).load(data['username'], "username");
    if (!user) {
      let user_id = Accounts.createUser(data);
      Accounts.sendEnrollmentEmail(user_id);
      user = OM.create<User>(User).load(data['username'], "username");
      if(!!data['license_id']) {
        Accounts.setPassword(user_id, 'smartosc123');
        const license = OM.create<License>(License).load(data['license_id']);

        //count current number of cashiers
        let license_cashier = 0;
        let has_product = license.getData('has_product')[0];
        if (has_product.hasOwnProperty('has_user')) {
          _.forEach(has_product['has_user'], (us) => {
            let find_us = OM.create<User>(User).loadById(us['user_id']);
            if (!!find_us) {
              license_cashier++;
            }
          });
        }

        if (user) {
          license_cashier++;
          if (data.hasOwnProperty('role')){
            user.setRoles(data['role'], Role.GROUP_SHOP);
          }
          license.setData('current_cashier_increment', license_cashier);

          return UserLicense.attach(user, license, User.LICENSE_PERMISSION_CASHIER, data['products']);
        } else
          throw new Meteor.Error("user.create_cashier_by_shop_owner", "Can't create cashier account");
      } else {
        user.setRoles(data['role_cloud'], Role.GROUP_CLOUD);
      }
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
