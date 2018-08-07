import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {BraintreeLogCollection} from "../collections/braintree-log";
import {BraintreeLogInterface} from "../api/braintree-log-interface";

Meteor.publishComposite("braintree_log", function (): PublishCompositeConfig<BraintreeLogInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return BraintreeLogCollection.collection.find({});
            }
        }
    } else if (user.isInRoles(Role.USER)) {
        return {
            find: () => {
                return BraintreeLogCollection.collection.find({user_id: this.userId});
            }
        }
    }
});
