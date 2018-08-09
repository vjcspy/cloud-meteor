import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {InvoiceInterface, InvoiceType} from "../api/invoice-interface";
import {InvoiceCollection} from "../collection/invoice";
import {Users} from "../../account/collections/users";
import * as _ from "lodash";
import {ExpireDateCollection} from "../../retail/collections/expiredate";
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

    if (user.isInRoles([Role.AGENCY], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return InvoiceCollection.collection.find({agency_id:  Meteor.userId()});
            }
        }
    }
    
    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return InvoiceCollection.collection.find();
            }
        }
    }
    return;
});
