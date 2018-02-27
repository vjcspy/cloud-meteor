import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {InvoiceInterface} from "../api/invoice-interface";
import {InvoiceCollection} from "../collection/invoice";

Meteor.publishComposite("sales_invoice", function (): PublishCompositeConfig<InvoiceInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return InvoiceCollection.collection.find({user_id: user.getId()});
            }
        }
    }

    return;
});
