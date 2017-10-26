import {SalesSchema} from "../db/sales-schema";
import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";

StoneModuleManager.config({
                              name: 'sales',
                              version: '0.0.1',
                              providers: [],
                              db: new SalesSchema(),
                              dependencies: [
                                  'account'
                              ]
                          });