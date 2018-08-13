import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {updateExpireDate} from "../../jobs/update-expire-date";
import {ClientStoragesCollection} from "../../collections/clientstorages";
import * as moment from "moment";

new ValidatedMethod ({
                    name: "license.refresh_expire_date",
                    validate: function () {
                        const user = OM.create<User>(User).loadById(this.userId);
                        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                        } else {
                            throw new Meteor.Error("user.edit_user_credit_error", "Access denied");
                        }
                    },
                    run: function () {
                        updateExpireDate();
                    }
});