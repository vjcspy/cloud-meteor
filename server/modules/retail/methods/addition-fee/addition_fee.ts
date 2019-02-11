import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {AdditionFee} from "../../models/additionfee";
import {USER_EMAIL_TEMPLATE} from "../../../account/api/email-interface";
import {BRAINTREE_ENVIROMENT} from "../../../sales-payment-braintree/etc/braintree.config";
import * as listData from "../../../../../list-email";
import * as _ from "lodash";


new ValidatedMethod({
    name: "create_addition_fee",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("pricing.create_pricing_error", "Access denied");
        }
    },
    run: function (data: Object) {
        let defer = $q.defer();

        let additionfeeModel = OM.create<AdditionFee>(AdditionFee);
        additionfeeModel.addData(data)
            .save()
            .then(() => {
                if(!data['_id']) {
                    let user = OM.create<User>(User);
                    user.loadById(data['user_id']);
                    let listEmails: any[] = [user.getEmail()];
                    if (BRAINTREE_ENVIROMENT !== 'SANDBOX') {
                        var fs = require("fs");
                        if (!fs.existsSync('../../list-email.json')) {
                            const content = {
                                emails: [],
                                sendExp: []
                            };
                            const data = listData ? listData : content;
                            fs.writeFileSync("../../list-email.json", JSON.stringify(data));

                        }
                        let emailData = fs.readFileSync('../../list-email.json');
                        let list = JSON.parse(emailData);
                        if (_.isArray(list['emails'])) {
                            listEmails = _.concat(listEmails, list['emails']);
                        }
                    }
                    _.forEach(listEmails, (email) => {
                        data['email'] = email;
                        user.sendData(data, USER_EMAIL_TEMPLATE.SUBMIT_ADDITIONALFEE);

                    });
                }
            })
            .then(() => defer.resolve(), (err) => defer.reject(err));


        return defer.promise;
    }
});