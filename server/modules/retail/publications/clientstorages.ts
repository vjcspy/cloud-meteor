import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {License} from "../models/license";
import {ClientStoragesCollection} from "../collections/clientstorages";
import * as _ from "lodash";

Meteor.publish('client_storages', function (data) {
    if (!this.userId)
        return;
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles(Role.USER)) {
        const licenses = user.getLicenses();
        const cacheTime = !!data && data.hasOwnProperty("cacheTime") ? parseFloat(data['cacheTime']) - 1 : 0;
        if (_.size(licenses) == 1) {
            const license: License = OM.create<License>(License).loadById(licenses[0].license_id);
            if (license) {
                return ClientStoragesCollection.collection.find({
                    license: license.getData('key'),
                    cache_time: {$gt: cacheTime}
                });
            } else {
                return;
            }
        } else {
            return;
        }
    } else {
        return;
    }
});
