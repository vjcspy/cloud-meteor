import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {AccountSchema} from "../db/account-schemal";

StoneModuleManager.config({
                              name: 'account',
                              version: "0.0.1",
                              providers: [],
                              db: new AccountSchema(),
                              dependencies: [
                                  'base'
                              ]
                          });
