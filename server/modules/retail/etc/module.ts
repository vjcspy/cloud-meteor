import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {RetailSchema} from "../db/retail-schemal";
import {InitDefaultPriceCpos} from "../providers/init-default-price-cpos";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.4',
                              providers: [
                                  new InitDefaultPriceCpos(),
                              ],
                              db: new RetailSchema(),
                              dependencies: [
                                  'account'
                              ]
                          });