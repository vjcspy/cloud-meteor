import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {ClientStorage} from "../../models/clientstorage";
import {License} from "../../models/license";

new ValidatedMethod({
    name: "client.trigger_realtime",
    validate: data => {
    },
    run: (data) => {
        let getClientStorageModel = (): ClientStorage => OM.create<ClientStorage>(ClientStorage);

        const clientStorageModel: ClientStorage = getClientStorageModel();

        let passLicense;
        const addToClientStorage = (_d) => {
            if (!_d.hasOwnProperty('license')) {
                throw new Meteor.Error("client.trigger_realtime", "can_not_find_license");
            }
            if (typeof passLicense === 'undefined') {
                const licenseKey   = _d['license'];
                const licenseModel = OM.create<License>(License);
                licenseModel.load(licenseKey, 'key');
                if (licenseModel.getId()) {
                    if (!isNaN(licenseModel.getStatus()) && parseInt(licenseModel.getStatus() + '') === 0) {
                        passLicense = false;
                        throw new Meteor.Error("client.trigger_realtime", "license_has_been_disabled");
                    } else {
                        passLicense = true;
                    }
                } else {
                    passLicense = false;
                    throw new Meteor.Error("client.trigger_realtime", "can_not_find_license");
                }
            }

            clientStorageModel.addData(_d)
                              .save();
        };

        if (data.hasOwnProperty('batch')) {
            for (let i = 0; i < data['batch'].length; i++) {
                addToClientStorage(data['batch'][i]);
            }

        } else {
            addToClientStorage(data);
        }

        return {result: "success", passLicense}
    }
});
DDPRateLimiter.addRule({
    userId: userId => true,
    type: "method",
    name: "client.trigger_realtime",
}, 3, 1000);

