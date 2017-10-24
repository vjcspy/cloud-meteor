import * as $q from 'q';
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../accounts/models/user";
import {StringHelper} from "../../../../code/Framework/StringHelper";
import {License} from "../../models/license";
import {UserLicense} from "../../models/userlicense";

new ValidatedMethod({
  name: "license.create_license_after_register",
  validate: function () {
  },
  run: function (data: Object) {
    let defer = $q.defer();

    let user_id = Accounts.createUser(data);
    let data_license = {};
    data_license['is_auto_generate'] = false;
    data_license['key']              = StringHelper.getUnique();
    data_license['status']           = 1;
    let shopOwnerId          = user_id;
    let license = OM.create<License>(License);
    license.addData(data_license)
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
