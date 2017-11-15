import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {PricingProvider} from "../providers/pricing";
import {ProductProvider} from "../providers/product";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.4',
                              providers: [
                                  new PricingProvider(),
                                  new ProductProvider()
                              ],
                              dependencies: [
                                  'account'
                              ]
                          });