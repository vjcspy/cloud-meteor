import * as $q from 'q';
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {StringHelper} from "../../../../code/Framework/StringHelper";
import {License} from "../../models/license";
import {UserLicense} from "../../models/userlicense";

new ValidatedMethod({
  name: "license.admin_create_license",
  validate: function () {
    const user = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
    } else {
      throw new Meteor.Error("license.create_license", "Access denied");
    }
  },
  run: function (data: Object) {
    let defer = $q.defer();
    
    data['created_by']       = this.userId;
    data['is_auto_generate'] = false;
    data['key']              = StringHelper.getUnique();
    let shopOwnerId          = data['shop_owner_id'];
    delete data['shop_owner_id'];
    let license = OM.create<License>(License);
    license.addData(data)
           .save()
           .then((_id) => {
             license = OM.create<License>(License).load(_id);
             if (shopOwnerId) {
               let user = OM.create<User>(User).load(shopOwnerId);
               return UserLicense.attach(user, license, User.LICENSE_PERMISSION_OWNER);
             } else {
               return defer.resolve();
             }
           }, err => defer.reject(err))
           .then(() => defer.resolve(), e => defer.reject(e));
    
    return defer.promise;
  }
});
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.license.admin_create_license",
                       }, 1, 1000);
