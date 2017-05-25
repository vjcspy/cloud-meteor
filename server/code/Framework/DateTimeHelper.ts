import * as moment from 'moment';

export class DateTimeHelper {
  static getCurrentDate(): Date {
    return moment().toDate();
  }
  
  static getDateAsNumber(): number {
    return Date.now();
  }
}
