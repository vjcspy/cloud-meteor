import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {UserPendingModel} from "../../../account/models/user-pending-model";

new ValidatedMethod({
    name: "user.reject_user_pending",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES , Role.AGENCY], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("user.edit_user_error", "Access denied");
        }
    },
    run: function (data: Object) {
        let defer = $q.defer();
        const pending_user_id = data['pending_user_id'];
        const pendingUser: UserPendingModel = OM.create<UserPendingModel>(UserPendingModel).loadById(pending_user_id);
        if(!pendingUser){
            throw new Meteor.Error("user.error_edit", "Pending User Not Found");
        }
        pendingUser.remove().then(() => defer.resolve(), (err) => defer.reject(err));
        return defer.promise;
    }
});

