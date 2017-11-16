import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../../sales/models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {UserCredit} from "../models/user-credit";
import {NumberHelper} from "../../../code/Framework/NumberHelper";
import {UserCreditTransaction} from "../models/user-credit-transaction";
import {CreditTransactionReason, UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export class ReducerCreditAfterCreatePlan implements ObserverInterface {
    observe(dataObject: DataObject): void {
        let plan: Plan    = dataObject.getData('data')['plan'];
        const creditSpent = plan.getCreditSpent();
        const userId      = plan.getUserId();
        if (!!creditSpent) {
            let userCredit = OM.create<UserCredit>(UserCredit);
            userCredit.load(userId, 'user_id');
            
            if (!userCredit.getId()) {
                throw new Meteor.Error("Error", 'can_not_find_user_credit');
            }
            
            const currentBalance = userCredit.getBalance();
            if (currentBalance < creditSpent) {
                throw new Meteor.Error("Error", 'current_balance_not_enough');
            }
            
            userCredit.setData('balance', NumberHelper.round(currentBalance - creditSpent, 2))
                      .save()
                      .then(() => {
                          let userCreditTransaction                       = OM.create<UserCreditTransaction>(UserCreditTransaction);
                          let transaction: UserCreditTransactionInterface = {
                              user_id: plan.getUserId(),
                              plan_id: plan.getId(),
                              description: "Reduce credit after create plan",
                              reason: CreditTransactionReason.ADJUST_PLAN,
                              amount: -creditSpent,
                              created_at: DateTimeHelper.getCurrentDate(),
                          };
                
                          userCreditTransaction.addData(transaction)
                                               .save();
                      });
        }
    }
}