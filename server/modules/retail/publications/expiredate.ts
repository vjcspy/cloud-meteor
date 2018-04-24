import {ExpireDateInterface} from "../api/expire-date-interface";
import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import {OM} from "../../../code/Framework/ObjectManager";
import {ExpireDateCollection} from "../collections/expiredate";

Meteor.publishComposite("expire_date", function (): PublishCompositeConfig <ExpireDateInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return ExpireDateCollection.collection.find({});
            }
        }
    }
});