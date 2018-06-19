import * as _ from "lodash";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {LicenseInterface} from "../api/license-interface";
import {Role} from "../../account/models/role";
import {Licenses} from "../collections/licenses";
import {Users} from "../../account/collections/users";

Meteor.publishComposite("licenses", function (): PublishCompositeConfig<LicenseInterface> {
  if (!this.userId) {
    return;
  }
  const user: User = OM.create<User>(User).loadById(this.userId);
  if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN,Role.AGENCY, Role.SALES], Role.GROUP_CLOUD)) {
    return {
      find: () => {
        return Licenses.collection.find({});
      },
    };
  } else if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
    return {
      find: () => {
        return Licenses.collection.find({ _id: { $in: user.getLicenses().map(_v => _v.license_id) } });
      },
      children: [{
        find: (license) => {
          if (user.isInRoles([Role.USER]) && user.getLicenses()[0] && user.getLicenses()[0]['license_permission'] == User.LICENSE_PERMISSION_OWNER) {
            let _userIds = [];
            _.forEach(license.has_product, product => {
              _.forEach(product.has_user, _u => { _userIds.push(_u.user_id) });
            });
            return Users.collection.find({ _id: { $in: _userIds } })
          }
          else
            return;
        }
      }]
    }
  }
});
