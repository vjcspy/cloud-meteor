import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {UserPendingModel} from "../../../account/models/user-pending-model";
import {USER_EMAIL_TEMPLATE} from "../../../account/api/email-interface";

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
        const pending_user_id = data['rejectId'];
        const pendingUser: UserPendingModel = OM.create<UserPendingModel>(UserPendingModel).loadById(pending_user_id);
        if(!pendingUser){
            throw new Meteor.Error("user.error_edit", "Pending User Not Found");
        }
        if(data['rejectReason']) {
            console.log(2222);
            const agency: User = OM.create<User>(User).loadById(pendingUser.getData('created_by_user_id'));
            if (agency) {
                const emailData = {
                    email: agency.getEmail(),
                    username: agency.getUsername(),
                    reject_reason: data['rejectReason'],
                    pending_user: pendingUser.getData()

                };
                console.log(1111);
                agency.sendData(emailData, USER_EMAIL_TEMPLATE.REJECT_USER);
            }
        }
        pendingUser.remove().then(() => defer.resolve(), (err) => defer.reject(err));
        return defer.promise;
    }
});

