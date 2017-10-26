import {StoneModuleManager} from "../../../code/core/app/module/stone-module-manager";
import {AccountCreditSchema} from "../db/AccountCreditSchema";

StoneModuleManager.config({
                              name: 'account-credit',
                              version: '0.0.1',
                              providers: [],
                              db: new AccountCreditSchema(),
                              dependencies: [
                                  'account'
                              ]
                          });