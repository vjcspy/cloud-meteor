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
                            let dataResolve = [];
                            let storages = [];
                            if ((!data['licenses'] || data['licenses'].length === 0) && !data['startTime'] && !data['endTime']) {
                                storages = ClientStoragesCollection.find().fetch();
                            } else if ((!data['licenses'] || data['licenses'].length === 0) && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.find({created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            } else {
                                storages = ClientStoragesCollection.find({license: {$in: data['licenses']}, created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            }
                            
                            if (!storages) {
                                throw new Meteor.Error("storage.error_edit", "Storage Not Found");
                            }
                            
                            const dataCount = _.countBy(storages, 'license');
                            _.forEach(dataCount, (value, key) => {
                                dataResolve.push({
                                                     license: key,
                                                     records: value,
                                                     startTime: data['startTime'] ? data['startTime'] : null,
                                                     endTime: data['endTime'] ? data['endTime'] : null
                                                 });
                            });
                            return dataResolve;
                        }
                    });
