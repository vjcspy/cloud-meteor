import * as $q from "q";
import * as _ from "lodash";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import {UserCredit} from "../models/user-credit";
import {UserCreditTransaction} from "../models/user-credit-transaction";
import {CreditTransactionReason, UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

new ValidatedMethod({
                        name: "user-credit.save",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("user.edit_user_credit_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer = $q.defer();
                            const userCreditData = data['userCredit'];
                            let amount = 0;
                            let userCreditModel = OM.create<UserCredit>(UserCredit);
                            if (userCreditData['_id']) {
                                userCreditModel.loadById(userCreditData['_id']);
                                amount = userCreditData['balance'] - userCreditModel.getBalance();
                            }
    
                            userCreditModel.addData(userCreditData)
                                .save()
                                .then(() => {
                                let userCreditTransaction                       = OM.create<UserCreditTransaction>(UserCreditTransaction);
                                let transaction: UserCreditTransactionInterface = {
                                    user_id: userCreditData['user_id'],
                                    description: "Admin add credit",
                                    reason: CreditTransactionReason.MANUALLY_CHANGE,
                                    amount: amount,
                                    created_at: DateTimeHelper.getCurrentDate(),
                                };
                                if(amount != 0) {
                                    userCreditTransaction.addData(transaction)
                                                         .save();
                                }
                            })
                              .then(() => {
                                  return defer.resolve();
                              })
                              .catch((err) => defer.reject(err));
        
                            return defer.promise;
                        }
                    });