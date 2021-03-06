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
    active_type:  {
        type: Number,
        optional: true
    },
    height_qr_code: {
        type: Number,
        optional: true
    },
    width_bar_code: {
        type: Number,
        optional: true
    },
    format_bar_code: {
        type: String,
        optional: true
    },
    height_bar_code: {
        type: Number,
        optional: true
    },
    show_value_bar_code: {
        type: Boolean,
        optional: true
    },
    last_login: {
        type: Date,
        defaultValue: DateTimeHelper.getCurrentDate()
    },
    unlock_type: {
        type: Number,
        optional: true
    },
    minute_unlock: {
        type: Number,
        optional: true
    }
}));