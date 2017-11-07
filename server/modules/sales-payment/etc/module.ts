import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {SalesPaymentSchema} from "../db/Schema";

StoneModuleManager.config({
                              name: 'sales-payment',
                              version: '0.0.1',
                              providers: [],
                              db: new SalesPaymentSchema(),
                              dependencies: [
                                  'sales',
                                  'account'
                              ]
                          });