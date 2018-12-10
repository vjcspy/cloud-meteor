import * as moment from 'moment';
import {ClientStoragesCollection} from "../collections/clientstorages";
import {StoneLogger} from "../../../code/core/logger/logger";

SyncedCron.add({
                   name: "Remove old clientstorages",
                   schedule: function (parser) {
                       return parser.text('every 24 hours');
                   },
                   job: function () {
                       deleteClientStorage();
                   }
               });

const deleteClientStorage = () => {
    StoneLogger.info("Clear trash");
    ClientStoragesCollection.remove({created_at: {$lt: moment(new Date()).subtract(1, 'days').format("DD/MM/YYYY")}})
};