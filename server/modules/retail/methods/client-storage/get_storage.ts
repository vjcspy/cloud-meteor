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
                            if ((!data['licenses'] || data['licenses'].length === 0) && !data['baseUrl'] && !data['startTime'] && !data['endTime']) {
                                storages = ClientStoragesCollection.find().fetch();
                            } else if ((!data['licenses'] || data['licenses'].length === 0) && !data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.find({created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            } else if ((!data['licenses'] || data['licenses'].length === 0) && data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.find({base_url: data['baseUrl'], created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            } else if ((data['licenses'] && data['licenses'].length > 0) && !data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.find({license: {$in: data['licenses']}, created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            } else {
                                storages = ClientStoragesCollection.find({license: {$in: data['licenses']}, base_url: data['baseUrl'], created_at: {$gte: data['startTime'], $lte: data['endTime']}}).fetch();
                            }
                            
                            if (!storages) {
                                throw new Meteor.Error("storage.error_edit", "Storage Not Found");
                            }
                            
                            const dataGroup = _.groupBy(storages, 'license');
                            _.forEach(dataGroup, (value, key) => {
                                dataResolve.push({
                                    license: key,
                                    url: [],
                                    startTime: data['startTime'] ? data['startTime'] : null,
                                    endTime: data['endTime'] ? data['endTime'] : null
                                });
                                _.forEach(_.countBy(value, 'base_url'), (records, base_url) => {
                                    dataResolve[dataResolve.length -1]['url'].push({
                                        base_url: base_url,
                                        records: records,
                                    });
                                })

                            });
                            return dataResolve;
                        }
                    });
