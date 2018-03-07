import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {ClientStorage} from "../../models/clientstorage";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import * as $q from "q";

new ValidatedMethod({
                        name: "client-storage.remove_storage",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("storage.edit_storage_error", "Access denied");
                            }
                        },
                        run: function (data: string) {
                            let defer     = $q.defer();
                            const storage = OM.create<ClientStorage>(ClientStorage).loadAll(data['license'], 'license');
                            if (!storage) {
                                throw new Meteor.Error("storage.error_edit", "Storage Not Found");
                            }
                            storage.removeStorage(data).then(() => defer.resolve(), (err) => defer.reject(err));
                            return defer.promise;
                        }
    
                    });
