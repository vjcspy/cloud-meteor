import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../../sales/models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {UserCredit} from "../models/user-credit";
import {NumberHelper} from "../../../code/Framework/NumberHelper";
import {UserCreditTransaction} from "../models/user-credit-transaction";
import {CreditTransactionReason, UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {AdditionFee} from "../../retail/models/additionfee";

export class ReducerCreditAfterCreateInvoice implements ObserverInterface {
    observe(dataObject: DataObject): void {
        const data        = dataObject.getData('data');
        let plan: Plan    = data['plan'];
        let additionFee: AdditionFee = data['additionFee'];
        let userId;
        let entityId;
        if(plan) {
            userId      = plan.getUserId();
            entityId    = plan.getId();
        } else if (additionFee) {
            userId      = additionFee.getUserId();
            entityId    = additionFee.getId();
        }
        const totals      = data['totals'];
        const creditSpent = totals['credit_spent'];
        if (!isNaN(creditSpent) && parseFloat(creditSpent) > 0) {
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
                              user_id: userId,
                              entity_id: entityId,
                              description: "Reduce credit after create invoice",
                              reason: CreditTransactionReason.REDUCE_CREDIT_WHEN_CHECKOUT,
                              amount: -creditSpent,
                              created_at: DateTimeHelper.getCurrentDate(),
                          };

                          userCreditTransaction.addData(transaction)
                                               .save();
                      });
        }
    }
}