import {PlanInterface} from "../api/plan-interface";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../account/models/role";
import {PlanCollection} from "../collection/plan";

Meteor.publishComposite("sales_plan", function (): PublishCompositeConfig<PlanInterface> {
    if (!this.userId) {
        return;
    }
    const user: User = OM.create<User>(User).loadById(this.userId);
    if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
        return {
            find: () => {
                return PlanCollection.collection.find({user_id: user.getId()});
            }
        }
    }
    
    return;
});
