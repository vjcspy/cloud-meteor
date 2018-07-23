import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {ClientStoragesCollection} from "../../collections/clientstorages";
import * as _ from "lodash";
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
                                storages = ClientStoragesCollection.collection.aggregate([
                                    { $group: { _id: {license: "$license", base_url: "$base_url"}, records: { $sum: 1} }  },
                                ]);
                            } else if ((!data['licenses'] || data['licenses'].length === 0) && !data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.collection.aggregate([
                                    { $match: {created_at: {$gte: data['startTime'], $lte: data['endTime']}}},
                                    { $group: { _id: {license: "$license", base_url: "$base_url"}, records: { $sum: 1} }  },
                                ]);
                            } else if ((!data['licenses'] || data['licenses'].length === 0) && data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.collection.aggregate([
                                    { $match: {base_url: data['baseUrl'], created_at: {$gte: data['startTime'], $lte: data['endTime']}}},
                                    { $group: { _id: {license: "$license", base_url: "$base_url"}, records: { $sum: 1} }  },
                                ]);
                            } else if ((data['licenses'] && data['licenses'].length > 0) && !data['baseUrl'] && data['startTime'] && data['endTime']) {
                                storages = ClientStoragesCollection.collection.aggregate([
                                    { $match: {license: {$in: data['licenses']}, created_at: {$gte: data['startTime'], $lte: data['endTime']}}},
                                    { $group: { _id: {license: "$license", base_url: "$base_url"}, records: { $sum: 1} }  },
                                ]);
                            } else {
                                storages = ClientStoragesCollection.collection.aggregate([
                                    { $match: {license: {$in: data['licenses']}, base_url: data['baseUrl'], created_at: {$gte: data['startTime'], $lte: data['endTime']}}},
                                    { $group: { _id: {license: "$license", base_url: "$base_url"}, records: { $sum: 1} }  },
                                ]);
                            }
                            
                            if (!storages) {
                                throw new Meteor.Error("storage.error_edit", "Storage Not Found");
                            }

                            const dataGroup = _.groupBy(storages, '_id.license');
                            _.forEach(dataGroup, (value, key) => {
                                dataResolve.push({
                                    license: key,
                                    url: value,
                                    startTime: data['startTime'] ? data['startTime'] : null,
                                    endTime: data['endTime'] ? data['endTime'] : null
                                });
                            });
                            return dataResolve;
                        }
                    });
