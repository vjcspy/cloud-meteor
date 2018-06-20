import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {sendEmailExpireDate, updateExpireDate} from "../../jobs/update-expire-date";

new ValidatedMethod ({
    name: "license.cron_job",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("user.cron_job_error", "Access denied");
        }
    },
    run: function () {
        updateExpireDate();
        sendEmailExpireDate();
    }
});