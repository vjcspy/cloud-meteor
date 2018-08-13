declare module '*';
declare var ValidatedMethod: any;
declare var Roles: any;
declare var JsonRoutes: any;
declare var _: any;
declare var SyncedCron:any;
declare module Mongo { interface Collection<T> { aggregate(args:any, filter?:any): Array<any>; } }