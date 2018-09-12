import {CodeLoginInterface} from "../api/code-login-interface";
import {CodeLoginsCollection} from "../collections/code-login-collection";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {License} from "../models/license";
import {UserHasLicense} from "../../account/api/user-interface";
import {Role} from "../../account/models/role";
import * as _ from "lodash";
Meteor.publishComposite("code_login", function (): PublishCompositeConfig<CodeLoginInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (userModel.isInRoles(Role.USER)) {
        let license: UserHasLicense[] = userModel.getLicenses();
        if (_.isArray(license)
            && _.size(license) == 1
            && _.indexOf([User.LICENSE_PERMISSION_OWNER, User.LICENSE_PERMISSION_CASHIER], license[0].license_permission) > -1) {
            return {
                find: () => {
                    return CodeLoginsCollection.collection.find({license_id: license[0].license_id});
                }
            }
        }
    } else {
        return {
            find() {
                return CodeLoginsCollection.collection.find({user_id: Meteor.userId()});
            }
        };}
});
