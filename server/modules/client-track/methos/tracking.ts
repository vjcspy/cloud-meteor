import * as _ from "lodash";
import {Tracking} from "../models/Tracking";
import {async} from "rxjs/scheduler/async";

new ValidatedMethod({
    name: "client-track.tracking",
    validate: data => {
    },
    run: async (_data) => {
        const {type, data} = _data;
        if (!_.isString(type)) {
            throw new Meteor.Error("client-track.tracking", "check_your_data");
        }

        let tracking       = new Tracking();
        const trackingData = {
            type,
            data: _.isObject(data) ? JSON.stringify(data) : data
        };
        
        return await tracking.addData(trackingData).save();
    }
});