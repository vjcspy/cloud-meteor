import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {SalesPaymentSchema} from "../db/Schema";
import {SalesPaymentProvider} from "../providers/sales-payment";

StoneModuleManager.config({
                              name: 'sales-payment',
                              version: '0.0.1',
                              providers: [
                                  new SalesPaymentProvider()
                              ],
                              db: new SalesPaymentSchema(),
                              dependencies: [
                                  'sales',
                                  'account'
                              ]
                          });