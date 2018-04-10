import SimpleSchema from "simpl-schema";
import {RequestTrialInterface} from "../api/request-trial-interface";
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";

export const RequestTrial = CollectionMaker.make<RequestTrialInterface>("request_trial", new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    email: String,
    note: {
        type: String,
        optional: true
    },
    phone: {
        type: String,
        optional: true
    },
    created_at: String
}));
