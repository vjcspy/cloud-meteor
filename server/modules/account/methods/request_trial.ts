import * as _ from "lodash";
import {RequestTrial} from "../models/request-trial";
import {OM} from "../../../code/Framework/ObjectManager";

new ValidatedMethod({
    name: "client.request_trial",
    validate: data => {
    },
    run: (data) => {
        console.log(data);
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

