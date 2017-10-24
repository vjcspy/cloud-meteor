import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {ClientStorage} from "../../models/clientstorage";

new ValidatedMethod({
                        name: "client.trigger_realtime",
                        validate: function (data) {
                        },
                        run: function (data) {
                            let getClientStorageModel = (): ClientStorage => OM.create<ClientStorage>(ClientStorage);
        
                            const clientStorageModel: ClientStorage = getClientStorageModel();
        
                            const addToClientStorage = (_d) => {
                                if (!_d.hasOwnProperty('license')) {
                                    throw new Meteor.Error("client.trigger_realtime", "can_not_find_license");
                                }
                                clientStorageModel.addData(_d)
                                                  .save();
                            };
        
                            if (data.hasOwnProperty('batch')) {
                                _.forEach(data['batch'], datum => {
                                    addToClientStorage(datum);
                                });
                            } else {
                                addToClientStorage(data);
                            }
                        }
                    });
DDPRateLimiter.addRule({
                           userId: function (userId) {
                               return true;
                           },
                           type: "method",
                           name: "client.trigger_realtime",
                       }, 3, 1000);

