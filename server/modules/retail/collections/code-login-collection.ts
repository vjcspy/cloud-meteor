import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {CodeLoginInterface} from "../api/code-login-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const CodeLoginsCollection  = CollectionMaker.make<CodeLoginInterface>("code_login", new SimpleSchema({
    user_id: String,
    license_id: String,
    username: String,
    pin_code: {
        type: String,
        optional: true
    },
    bar_code: {
        type: String,
        optional: true
    },
    last_login: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
}));