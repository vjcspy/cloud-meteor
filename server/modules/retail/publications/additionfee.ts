import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import {OM} from "../../../code/Framework/ObjectManager";
import {AdditionFeeInterface} from "../api/addition-fee-interface";
import {AdditionFeeCollection} from "../collections/additionfee";

Meteor.publishComposite("addition_fee", function (): PublishCompositeConfig <AdditionFeeInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return AdditionFeeCollection.collection.find({});
            }
        }
    }
});