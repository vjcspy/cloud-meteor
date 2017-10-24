import {User} from "../../accounts/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../accounts/api/role";
import {License} from "../../retail/models/license";

new ValidatedMethod({
  name: 'user.get_my_license',
  validate: function () {
    if (!this.userId) {
      throw new Meteor.Error("Error", "Access denied");
    }
  },
  run: function () {
    let user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles(Role.USER)) {
      const licenses = user.getLicenses();
      if (_.size(licenses) == 1) {
        return OM.create<License>(License).loadById(licenses[0]['license_id']).getData();
      } else
        return null;
    } else {
      throw new Meteor.Error("Not yet support");
    }
  }
});
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.get_roles",
                       }, 1, 1000);
