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
                const  users = Users.collection.find({$or: [{  take_care_by_agency: Meteor.userId() } , {  created_by_user_id: Meteor.userId() } ,{ assign_to_agency: Meteor.userId()}] } ).fetch();
                let ids = _.map(users, (user) => user['_id']);
                return InvoiceCollection.collection.find({user_id:  {$in : ids} , type: InvoiceType.TYPE_PLAN});
            }
        }
    }

    if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return InvoiceCollection.collection.find({type: InvoiceType.TYPE_PLAN});
            }
        }
    }
    return;
});
