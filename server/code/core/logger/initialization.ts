import {Logger} from 'meteor/ostrio:logger';
import {LoggerConsole} from 'meteor/ostrio:loggerconsole';
import {LoggerMongo} from 'meteor/ostrio:loggermongo';
import * as moment from 'moment';
import * as _ from 'lodash'

// Initialize Logger:
export const $log = new Logger();

// Initialize and enable LoggerConsole with custom formatting:
(new LoggerConsole($log, {
    filter: ['*'],
    client: false,
    server: true,
    format(opts) {
        let output = `[${opts['level']}] - ${moment(opts['time']).format("YYYY/MM/DD HH:mm:ss")}: ${opts['message']}`;
        if (_.isObject(opts['data'])) {
            output += ` ~> ${JSON.stringify(opts['data'])}`;
        } else if (_.isString(opts['data'])) {
            output += ` ~> ${opts['data']}`;
        }
        return output;
    }
})).enable();

const $LogMongo = new LoggerMongo($log, {
    collectionName: 'AppErrors'
});
$LogMongo.enable({
                     enable: true,
                     filter: ['ERROR', 'FATAL', 'WARN'], // Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*'
                     client: true, // Set to `false` to avoid Client to Server logs transfer
                     server: true  // Allow logging on Server
                 });