import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {License} from "../models/license";
import {ClientStoragesCollection} from "../collections/clientstorages";
import * as _ from "lodash";
import * as moment from "moment";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {ClientStorageInterface} from "../api/client_storage-interface";

Meteor.publishComposite('client_storages', function (): PublishCompositeConfig<ClientStorageInterface> {
    
    if (!this.userId)
        return;
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return ClientStoragesCollection.collection.find({});
            },
        };
    } else { return; }
    
});