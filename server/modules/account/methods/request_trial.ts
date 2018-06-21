import * as _ from "lodash";
import {RequestTrial} from "../models/request-trial";
import {OM} from "../../../code/Framework/ObjectManager";
import {sales_emails} from "../configs/email/request_trial_emails";
import {User} from "../models/user";
import {USER_EMAIL_TEMPLATE} from "../api/user-interface";

new ValidatedMethod({
    name: "client.request_trial",
    validate: data => {
    },
    run: (data) => {
        const requestTrial: RequestTrial = OM.create(RequestTrial);
        if (!_.isObject(data) || !data['email']) {
            return {
                isError: true,
                mess: "Please define email"
            };
        }

        requestTrial.setData("email", data['email'])
                    .setData("phone", data['phone'])
                    .setData("note", data['note'])
                    .setData("name", data['name'])
                    .save();
        const user: User = OM.create(User);
        user.sendData(requestTrial,USER_EMAIL_TEMPLATE.REQUEST_TRIAL);

        _.forEach(sales_emails, (e)=> {
                        Email.send({
                            to:`${e}`,
                            from: "",
                            subject:"Request Trial From Customer",
                            html:   `<span style="color: black;">Email: ${requestTrial.getData("email")}<br>
                                     Phone: ${requestTrial.getData("phone")}<br>
                                     Name: ${requestTrial.getData("name")}<br>
                                     Note: ${requestTrial.getData("note")}<br></span>`
                        })
                    });

        return {
            isError: false,
            mess: "Saved"
        };
    }
});


DDPRateLimiter.addRule({
    userId: userId => true,
    type: "method",
    name: "client.request_trial",
}, 1, 1000);

