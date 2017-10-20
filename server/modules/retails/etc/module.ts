import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {RetailSchema} from "../db/retail-schemal";

StoneModuleManager.config({
                              name: 'retail',
                              version: '0.0.2',
                              providers: [],
                              db: new RetailSchema(),
                              dependencies: [
                                  'accounts'
                              ]
                          });