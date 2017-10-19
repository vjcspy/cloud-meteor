import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {AccountSchemal} from "../db/account-schemal";

StoneModuleManager.config({
                              name: 'accounts',
                              version: "0.0.1",
                              providers: [],
                              db: new AccountSchemal(),
                              dependencies: []
                          });
