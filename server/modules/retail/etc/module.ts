import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {PricingProvider} from "../providers/pricing";
import {ProductProvider} from "../providers/product";
import {LicenseProvider} from "../providers/license";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.4',
                              providers: [
                                  new PricingProvider(),
                                  new ProductProvider(),
                                  new LicenseProvider()
                              ],
                              dependencies: [
                                  'account'
                              ]
                          });