import * as _ from "lodash";
import {OM} from "../../../code/Framework/ObjectManager";
import {Users} from "../collections/users";
import {License} from "../../retail/models/license";

new ValidatedMethod({
    name: "client.get_user_data_by_license",
    validate: data => {
    },
    run: (data) => {
        let userData = [];
        if (data['license_key']) {
            const licenseModel: License = OM.create<License>(License).load(data['license_key'], 'key');
            if (licenseModel && licenseModel.getId()) {
                Users.collection.find({has_license: {$elemMatch: {license_id: licenseModel.getId()}}})
                    .forEach(user => {
                        userData.push(user);
                    });
            }
        }
        return {
            isError: false,
            userData
        };
    }
});


DDPRateLimiter.addRule({
    userId: userId => true,
    type: "method",
    name: "client.get_user_data",
}, 10, 1000);

