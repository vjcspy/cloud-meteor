import {AgencyInvoiceInterface} from "../api/agency-invoice-interface";
import {AgencyInvoicesCollection} from "../collections/agency-invoices";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
Meteor.publishComposite("agency_invoice", function (): PublishCompositeConfig<AgencyInvoiceInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES, Role.AGENCY], Role.GROUP_CLOUD)) {
        return {
            find() {
                return AgencyInvoicesCollection.collection.find();
            }
        };
    }
});
