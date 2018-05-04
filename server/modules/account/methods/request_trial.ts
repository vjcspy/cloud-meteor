import * as _ from "lodash";
import {RequestTrial} from "../models/request-trial";
import {OM} from "../../../code/Framework/ObjectManager";
import {sales_emails} from "../configs/email/request_trial_emails";

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

        _.forEach(sales_emails, (e)=> {
                        Email.send({
                            to:`${e}`,
                            from: "",
                            subject:" Request Trial ",
                            text:   "Email: " + requestTrial.getData("email") + "\n" +
                                    "Phone: " + requestTrial.getData("phone") + "\n" +
                                    "Note: " + requestTrial.getData("note") + "\n" +
                                    "Name: " + requestTrial.getData("name") + "\n"
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

