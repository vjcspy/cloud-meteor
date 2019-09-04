import {UserInterface, UserHasLicense} from "../api/user-interface";
import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../models/role";
import {Users} from "../collections/users";
import {License} from "../../retail/models/license";
import * as _ from "lodash";

Meteor.publishComposite('users', function (): PublishCompositeConfig<UserInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (userModel.isInRoles([Role.ADMIN, Role.SUPERADMIN, Role.SALES])) {
        return {
            find: () => {
                return Users.collection.find({});
            }
        };
    } else if (userModel.isInRoles([Role.AGENCY])) {
        return {
            find: () => {
                return Users.collection.find({ $or: [ { _id: Meteor.userId() }, {  assign_to_agency: {$in: [{agency_id: Meteor.userId()}]}}]});
            }
        }
    } else if (userModel.isInRoles(Role.USER)) {
        let license: UserHasLicense[] = userModel.getLicenses();
        if (_.isArray(license)
            && _.size(license) == 1
            && _.indexOf([User.LICENSE_PERMISSION_OWNER, User.LICENSE_PERMISSION_CASHIER], license[0].license_permission) > -1) {
            const licenseModel: License = OM.create<License>(License).loadById(license[0].license_id);
            if (!licenseModel) {
                // Wtf error?
                return;
            }
            return {
                find: () => {
                    return Users.collection.find({has_license: {$elemMatch: {license_id: license[0].license_id}}},
                        {fields: {_id: 1, emails: 1, has_license: 1, roles: 1, username: 1, profile: 1}});
                }
            }
        } else {
            return {
                find: () => {
                    return Users.collection.find({_id: this.userId}, {
                        fields: {
                            _id: 1,
                            emails: 1,
                            has_license: 1,
                            roles: 1,
                            username: 1,
                            profile:1
                        }
                    });
                }
            }
        }
    }
});
