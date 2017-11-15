import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {InitDefaultPriceCpos} from "../providers/pricing-type";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.4',
                              providers: [
                                  new InitDefaultPriceCpos(),
                              ],
                              dependencies: [
                                  'account'
                              ]
                          });