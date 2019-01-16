import * as moment from 'moment';
import {ExpireDateCollection} from "../collections/expiredate";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {extendPlan} from "../../sales/methods/plan/extend-plan";

SyncedCron.add({
    name: "Auto extend plan (00:00 everyday)",
    schedule: function (parser) {
        return parser.text('at 00:00 am');
    },
    job: function () {
        autoExtend();
    }
});

const autoExtend = () => {
    const listExpires = ExpireDateCollection.find({pricing_code: {$ne: 'cpos_trial'}}).fetch();
    const today = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
    _.forEach(listExpires, (exp) => {
        const expiryDate = moment(exp['expiry_date'], 'YYYY-MM-DD');
        if(expiryDate.isSame(today, 'day')) {
            extendPlan(exp);
        }
    });
};