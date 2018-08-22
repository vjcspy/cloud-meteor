import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import * as _ from "lodash";
new ValidatedMethod ({
    name: "license.download_braintree_log",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("license.download_braintree_log_error", "Access denied");
        }
    },
    run: function (data: any) {
        const {date} = data;
        var fs = require("fs");

        if(fs.existsSync('./braintree.log')) {
            var logData = fs.readFileSync('./braintree.log', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
            });
            let content = JSON.parse(logData.toString());
            let day = _.find(content, (log) => log['date'] === date.toLocaleDateString());
            if (day) {
                return day;
            } else {
                return;
            }
        } else {
            return;
        }
    }
});