import * as $q from "q";
import * as _ from "lodash";
import {User} from "../../../../../account/models/user";
import {OM} from "../../../../../../code/Framework/ObjectManager";
import {License} from "../../../../models/license";

new ValidatedMethod({
                        name: 'license.update_role',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("license.update_role", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {name, code}  = data;
                            let defer           = $q.defer();
                            let userModel: User = OM.create<User>(User).loadById(this.userId);
                            if (userModel.getLicenses().length != 1) {
                                throw new Meteor.Error("license.update_role", "can_not_find_license");
                            }
                            let license_id       = userModel.getLicenses()[0]['license_id'];
                            let license: License = OM.create<License>(License).load(license_id);
        
                            if (!license.getId()) {
                                throw new Meteor.Error("license.update_role", "can_not_find_license");
                            }
        
                            let roles = license.getRoles();
                            if (_.find(roles, (r) => r['code'] === code)) {
                                roles = _.map(roles, (rol) => {
                                    if (rol['code'] === code) {
                                        rol['name'] = name;
                                    }
                                    return rol;
                                });
                            } else {
                                roles.push({code, name, has_permissions: []});
                            }
                            license.setData('has_roles', roles)
                                   .save()
                                   .then(() => setTimeout(() => defer.resolve(), 1000), (err) => defer.reject(err));
                            return defer.promise;
                        }
                    });
