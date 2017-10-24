import {$log} from "./initialization";
import {Stone} from "../stone";

export class StoneLogger {
    static info(message: string, data?: Object, userId?: string): void {
        $log.info(message, data, userId);
    }
    
    static debug(message: string, data?: Object, userId?: string): void {
        $log.debug(message, data, userId);
    }
    
    static fatal(message: string, data?: Object, userId?: string): void {
        $log.fatal(message, data, userId);
    }
    
    static error(message: string, data?: Object, userId?: string): void {
        $log.error(message, data, userId);
    }
    
    static warn(message: string, data?: Object, userId?: string): void {
        $log.warn(message, data, userId);
    }
    
    static trace(message: string, data?: Object, userId?: string): void {
        $log.trace(message, data, userId);
    }
    
    static _(message: string, data?: any, userId?: string): void {
        $log._(message, data, userId);
    }
}

const $stoneLogger = new StoneLogger();
Stone.getInstance().singleton('$stoneLogger', $stoneLogger);