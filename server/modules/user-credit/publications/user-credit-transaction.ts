import {UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {UserCreditTransactionCollection} from "../collections/user-credit-transaction";

Meteor.publishComposite('user_credit_transaction', function (): PublishCompositeConfig<UserCreditTransactionInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if (userModel.isInRoles([Role.ADMIN, Role.SUPERADMIN, Role.SALES])) {
        return {
            find: () => {
                return UserCreditTransactionCollection.collection.find();
            }
        };
    } else if (userModel.isInRoles(Role.USER)) {
        return {
            find: () => {
                return UserCreditTransactionCollection.collection.find({user_id: this.userId});
            }
        }
    }
});