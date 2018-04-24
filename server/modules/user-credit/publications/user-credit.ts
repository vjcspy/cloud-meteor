import {UserCreditInterface} from "../api/user-credit-interface";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {UserCreditCollection} from "../collections/user-credit";

Meteor.publishComposite('user_credit', function (): PublishCompositeConfig<UserCreditInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (userModel.isInRoles([Role.ADMIN, Role.SUPERADMIN, Role.SALES])) {
        return {
            find: () => {
                return UserCreditCollection.collection.find();
            }
        };
    } else if (userModel.isInRoles(Role.USER)) {
        return {
            find: () => {
                return UserCreditCollection.collection.find({user_id: this.userId});
            }
        }
    }
});