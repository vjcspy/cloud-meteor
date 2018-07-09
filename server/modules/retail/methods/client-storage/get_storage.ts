import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {ClientStorage} from "../../models/clientstorage";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import * as $q from "q";
import {ClientStoragesCollection} from "../../collections/clientstorages";

new ValidatedMethod({
                        name: "client-storage.get_storage",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("storage.get_storage_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            console.log(data);
                            let defer     = $q.defer();
                            const storage = ClientStoragesCollection.find().fetch();
                            const dataCount = _.countBy(storage, 'license');
                            console.log(dataCount);
                            // if (!storage) {
                            //     throw new Meteor.Error("storage.error_edit", "Storage Not Found");
                            // }
                            // storage.addData(cStorage)
                            // .save().then(() => defer.resolve(), (err) => defer.reject(err));
                            return defer.promise;
                        }
    
                    });
