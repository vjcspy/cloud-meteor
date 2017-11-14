import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {SalesPaymentBraintreeSchema} from "../db/Schema";
import {BraintreeProvider} from "../providers/braintree-provider";

StoneModuleManager.config({
                              name: 'sales-payment-braintree',
                              version: '0.0.1',
                              providers: [
                                  new BraintreeProvider(),
                              ],
                              dependencies: [
                                  'sales',
                                  'sales-payment',
                                  'account'
                              ]
                          });