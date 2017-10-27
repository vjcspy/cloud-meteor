import * as moment from 'moment';
import {Moment} from "moment";

export class DateTimeHelper {
    static getCurrentDate(): Date {
        return moment().toDate();
    }
    
    static getCurrentMoment(): Moment {
        return moment();
    }
    
    static getDateAsNumber(): number {
        return Date.now();
    }
}
