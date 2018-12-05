import * as _ from "lodash";
import * as moment from 'moment';
import {ClientStoragesCollection} from "../collections/clientstorages";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

SyncedCron.add({
                   name: "Remove old clientstorages",
                   schedule: function (parser) {
                       return parser.text('every 1 day');
                   },
                   job: function () {
                       deleteClientStorage();
                   }
               });

const deleteClientStorage = () => {
    const allClientStorages = ClientStoragesCollection.find().fetch();
    if (allClientStorages.length > 0) {
        _.forEach(allClientStorages, (clientStorage) => {
            let createTime  = moment(clientStorage['created_at'], 'YYYY-MM-DD');
            let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
            let diff        = createTime.diff(currentTime, 'days');
            if (diff > 1) {
                ClientStoragesCollection.remove(clientStorage);
            }
        });
    }
};