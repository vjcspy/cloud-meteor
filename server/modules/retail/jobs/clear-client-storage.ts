import * as moment from 'moment';
import {ClientStoragesCollection} from "../collections/clientstorages";
import {StoneLogger} from "../../../code/core/logger/logger";

SyncedCron.add({
                   name: "Remove old clientstorages",
                   schedule: function (parser) {
                       return parser.text(' at 00:00 am');
                   },
                   job: function () {
                       deleteClientStorage();
                   }
               });

const deleteClientStorage = () => {
    StoneLogger.info("Clear trash");
    ClientStoragesCollection.remove({created_at: {$lt: moment(new Date()).subtract(1, 'days').toDate()}})
};