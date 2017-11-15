import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {Pricing} from "../providers/pricing";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.4',
                              providers: [
                                  new Pricing(),
                              ],
                              dependencies: [
                                  'account'
                              ]
                          });