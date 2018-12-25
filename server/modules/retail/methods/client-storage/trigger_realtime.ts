import {OM} from "../../../../code/Framework/ObjectManager";
// import {ClientStorage} from "../../models/clientstorage";
import {License} from "../../models/license";
import * as _ from "lodash";
import {StoneLogger} from "../../../../code/core/logger/logger";
import {ClientStoragesCollection} from "../../collections/clientstorages";

export let licenseInvalid = [];
export let licenseValid   = [];

new ValidatedMethod({
                        name: "client.trigger_realtime",
                        validate: () => {},
                        run: (data) => {
                            // let getClientStorageModel = (): ClientStorage => OM.create<ClientStorage>(ClientStorage);
        
                            // const clientStorageModel: ClientStorage = getClientStorageModel();
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
                    
                                        if (licenseValid.indexOf(licenseKey) === -1) {
                        
                                            if (licenseInvalid.indexOf(licenseKey) > -1) {
                                                return;
                                            }
                                            console.log('here');
                        
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
                                        } else {
                                            passLicense = true;
                                        }
                                    }
                
                                    if (passLicense === true) {
                                        StoneLogger.info("save realtime data: " + _d['license']);
                                        ClientStoragesCollection.insert(_d);
                                    }
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
                           type: "method",
                           name: "client.trigger_realtime",
                       }, 2, 1000);

