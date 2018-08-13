import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {PricingProvider} from "../providers/pricing";
import {ProductProvider} from "../providers/product";
import {LicenseProvider} from "../providers/license";
import {RetailDB} from "./db";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.95',
                              db: new RetailDB(),
                              providers: [
                                  new PricingProvider(),
                                  new ProductProvider(),
                                  new LicenseProvider()
                              ],
                              dependencies: [
                                  'account'
                              ]
                          });