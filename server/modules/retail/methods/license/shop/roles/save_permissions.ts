import {OM} from "../../../../../../code/Framework/ObjectManager";
import {License} from "../../../../models/license";
import {User} from "../../../../../account/models/user";

new ValidatedMethod({
                        name: 'license.save_permissions',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("license.delete_role", "Access denied");
                            }
                        },
                        run: function (data) {
                            return new Promise((resolve, reject) => {
                                const {permissions, code} = data;
                                if (!permissions || !code) {
                                    throw new Meteor.Error("license.save_permissions", "save_permissions_wrong_data");
                                }
            
                                let userModel: User = OM.create<User>(User).loadById(this.userId);
                                if (userModel.getLicenses().length != 1) {
                                    throw new Meteor.Error("license.save_permissions", "can_not_find_license");
                                }
                                let license_id       = userModel.getLicenses()[0]['license_id'];
                                let license: License = OM.create<License>(License).load(license_id);
            
                                if (!license.getId()) {
                                    throw new Meteor.Error("license.save_permissions", "can_not_find_license");
                                }
            
                                let has_roles = _.map(license.getRoles(), (role) => {
                                    if (role['code'] == code) {
                                        role['has_permissions'] = _.reduce(permissions, (init, _group) => {
                                            init.push(..._.reduce(_group['sections'], (_acc, _section) => {
                                                _acc.push(..._section['permissions']);
                            
                                                return _acc;
                                            }, []));
                        
                                            return init;
                                        }, []);
                                    }
                                    return role;
                                });
            
                                license.setData('has_roles', has_roles)
                                       .save()
                                       .then(() => setTimeout(() => resolve(), 1000), (err) => reject(err));
                            });
                        }
                    });
