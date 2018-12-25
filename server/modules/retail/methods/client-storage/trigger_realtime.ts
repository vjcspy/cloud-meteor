import {OM} from "../../../../code/Framework/ObjectManager";
import {ClientStorage} from "../../models/clientstorage";
import {License} from "../../models/license";
import * as _ from "lodash";

export let licenseInvalid = [];
export let licenseValid   = [];

new ValidatedMethod({
                        name: "client.trigger_realtime",
                        validate: data => {
                        },
                        run: (data) => {
                            let getClientStorageModel = (): ClientStorage => OM.create<ClientStorage>(ClientStorage);
        
                            const clientStorageModel: ClientStorage = getClientStorageModel();
                            const licenseModel                      = OM.create<License>(License);
                            let passLicense                         = false;
        
                            const addToClientStorage = (_d) => {
                                Meteor.setTimeout(() => {
                                    if (!_d.hasOwnProperty('license')) {
                                        // StoneLogger.info("can not find license" + JSON.stringify(_d));
                    
                                        return;
                                    }
                                    if (passLicense === false) {
                                        const licenseKey = _d['license'];
                    
                                        if (licenseValid.indexOf(licenseKey) > -1) {
                        
                                            if (licenseInvalid.indexOf(licenseKey) > -1) {
                                                return;
                                            }
                        
                                            if (!licenseModel.getId()) {
                                                licenseModel.load(licenseKey, 'key');
                                            }
                                            if (licenseModel.getId()) {
                                                if (!isNaN(licenseModel.getStatus()) && parseInt(licenseModel.getStatus() + '') === 0) {
                                                    passLicense = false;
                                                    licenseInvalid.push(licenseKey);
                                                    return;
                                                    // return StoneLogger.info("License: " + licenseKey + " " + "Username: " +
                                                    // licenseModel.getData('shop_owner_username') + " deactive");
                                                } else {
                                                    licenseValid.push(licenseKey);
                                                    passLicense = true;
                                                }
                                            } else {
                                                passLicense = false;
                                                licenseInvalid.push(licenseKey);
                                                return;
                                                // return StoneLogger.info("can not find license" + JSON.stringify(_d));
                                            }
                                        }
                                    }
                
                                    clientStorageModel.addData(_d)
                                                      .save();
                                }, 500);
                            };
        
                            if (data.hasOwnProperty('batch') && _.isArray(data['batch']) && _.size(data['batch']) > 0) {
                                _.forEach(data['batch'], _dt => addToClientStorage(_dt));
                            } else {
                                addToClientStorage(data);
                            }
        
                            return {result: "success", passLicense}
                        }
                    });
DDPRateLimiter.addRule({
                           userId: () => true,
                           type: "method",
                           name: "client.trigger_realtime",
                       }, 2, 1000);

