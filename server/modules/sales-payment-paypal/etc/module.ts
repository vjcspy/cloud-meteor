import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {PaypalProvider} from "../providers/paypal";

StoneModuleManager.config({
                              name: 'sales-payment-paypal',
                              version: '0.0.1',
                              providers: [new PaypalProvider()],
                              dependencies: [
                                  'sales',
                                  'sales-payment',
                                  'account'
                              ]
                          });
