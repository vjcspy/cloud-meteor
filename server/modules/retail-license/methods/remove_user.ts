import * as $q from "q";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../accounts/models/user";
import {Role} from "../../accounts/api/role";
import {License} from "../../retail/models/license";

new ValidatedMethod(
    {
        name: "user.remove_user",
        validate: function () {
            const user = OM.create<User>(User).loadById(this.userId);
            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.USER], Role.GROUP_CLOUD)) {
            } else {
                throw new Meteor.Error("user.remove_user_error", "Access denied");
            }
        },
        run: function (data: string) {
            let defer = $q.defer();
            
            const user: User = OM.create<User>(User).loadById(data);
            if (this.userId == data) {
                throw new Meteor.Error("user.error_remove", "You cannot delete yourself");
            }
            if (!user) {
                throw new Meteor.Error("user.error_remove", "User Not Found");
            }
            let license: License, license_id: string;
            if (user.hasData('has_license')) {
                let has_license = user.getData('has_license');
                license_id      = has_license[0]['license_id'];
                license         = OM.create<License>(License).loadById(license_id);
            }
            user.delete().then(() => {
                                   if (license) {
                                       if (license.hasOwnProperty('current_cashier_increment')) {
                                           let current_cashier_increment = license['current_cashier_increment'];
                                           license.setData('current_cashier_increment', parseInt(current_cashier_increment) - 1);
                                       }
                                   }
                                   defer.resolve();
                               },
                               (err) => defer.reject(err)
            );
            
            return defer.promise;
        }
    });