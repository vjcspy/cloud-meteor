import * as $q from "q";
import {User} from "../../../../../account/models/user";
import {OM} from "../../../../../../code/Framework/ObjectManager";
import {License} from "../../../../models/license";

new ValidatedMethod({
                        name: 'license.delete_role',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("license.delete_role", "Access denied");
                            }
                        },
                        run: function (data) {
                            let defer           = $q.defer();
                            let userModel: User = OM.create<User>(User).loadById(this.userId);
                            if (userModel.getLicenses().length != 1) {
                                throw new Meteor.Error("license.delete_role", "can_not_find_license");
                            }
                            let license_id       = userModel.getLicenses()[0]['license_id'];
                            let license: License = OM.create<License>(License).load(license_id);
        
                            if (!license.getId()) {
                                throw new Meteor.Error("license.update_role", "can_not_find_license");
                            }
        
                            if (!!data['code']) {
                                let has_roles = _.reject(license.getData('has_roles'), (rol) => rol['code'] === data['code']);
                                license.setData('has_roles', has_roles)
                                       .save().then(() => setTimeout(() => defer.resolve(), 1000), (err) => defer.reject(err));
            
                                return defer.promise;
                            }
                        }
                    });
