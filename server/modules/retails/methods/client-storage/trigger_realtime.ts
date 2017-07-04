import * as _ from "lodash";
import {ClientStorage} from "../../models/clientstorage";
import {OM} from "../../../../code/Framework/ObjectManager";

new ValidatedMethod({
                        name: "client.trigger_realtime",
                        validate: function (data) {
                            return data.hasOwnProperty('license');
                        },
                        run: function (data) {
                            let getClientStorageModel = (): ClientStorage => OM.create<ClientStorage>(ClientStorage);
        
                            let clientStorageModel: ClientStorage = getClientStorageModel();
        
                            if (data.hasOwnProperty('batch')) {
                                _.forEach(data['batch'], datum => {
                                    let clientStorageModel: ClientStorage = getClientStorageModel();
                                    clientStorageModel.addData(datum)
                                                      .save();
                                });
                            } else {
                                clientStorageModel.addData(data)
                                                  .save();
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
