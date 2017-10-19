import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {RetailSchemal} from "../db/retail-schemal";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.1',
                              providers: [],
                              db: new RetailSchemal(),
                              dependencies: [
                                  'accounts'
                              ]
                          });