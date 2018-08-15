import {UserPendingInterface} from "../api/user-pending-interface";
import {UserPendingCollection} from "../collections/user-pending-collection";
import {Role} from "../models/role";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";

Meteor.publishComposite('user_pending', function (): PublishCompositeConfig<UserPendingInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return UserPendingCollection.collection.find({});
            }
        }
    }

});
