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

        fs.stat('./braintree.log', (exists) => {
            if (exists == null) {
                fs.readFile('./braintree.log', function read(err, data) {
                    if (err) {
                        throw err;
                    };
                    console.log(1);
                    let content = JSON.parse(data.toString());
                    let day = _.find(content, (log) => log['date'] === date.toLocaleDateString());
                    if(day) {
                        fs.writeFile("./braintreeLog.log", JSON.stringify(day['data']), (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            } else {

                            }
                        });
                    } else {
                        return;
                    }
                });
            } else if (exists.code === 'ENOENT') {
                return;
            }
        });

    }
});