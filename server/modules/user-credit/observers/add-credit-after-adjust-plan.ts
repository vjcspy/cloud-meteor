import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Role} from "../../account/models/role";
import {Plan} from "../../sales/models/plan";
import {StoneLogger} from "../../../code/core/logger/logger";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {UserCreditTransaction} from "../models/user-credit-transaction";
import {CreditTransactionReason, UserCreditTransactionInterface} from "../api/user-credit-transaction-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {UserCredit} from "../models/user-credit";

export class AddCreditAfterAdjustPlan implements ObserverInterface {
    async observe(dataObject: DataObject) {
        const data       = dataObject.getData('data');
        const typePay = data['typePay'];
        if (typePay !== 0) {
            return;
        }
        const entity: Plan = data['entity'];
        const userId     = entity.getUserId();

        let user = OM.create<User>(User);
        user.loadById(userId);

        try {
            if (!user.getId()) {
                throw new Meteor.Error('Error', 'can_not_found_user_when_upgrade_plan');
            }

            if (user.isInRoles([Role.AGENCY], Role.GROUP_CLOUD)) {
                throw new Meteor.Error("Error", 'not_yet_support_agency_buy_license');
            } else if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
                // We just add credit one time. So we need check plan id has existed in user_credit_transactions
                const userCreditTransaction = OM.create<UserCreditTransaction>(UserCreditTransaction);
                const existedTransaction    = userCreditTransaction.getMongoCollection().findOne({
                    plan_id: entity.getId(),
                    reason: CreditTransactionReason.ADD_CREDIT_WHEN_ADJUST_PLAN
                });
                if ((existedTransaction && existedTransaction['_id']) || entity.getCreditEarn() === 0) {
                    return;
                } else {
                    let transaction: UserCreditTransactionInterface = {
                        user_id: entity.getUserId(),
                        amount: entity.getCreditEarn(),
                        created_at: DateTimeHelper.getCurrentDate(),
                        description: "add credit point when user adjust plan",
                        entity_id: entity.getId(),
                        reason: CreditTransactionReason.ADD_CREDIT_WHEN_ADJUST_PLAN
                    };
                    await userCreditTransaction.addData(transaction).save();

                    let userCredit = OM.create<UserCredit>(UserCredit);
                    userCredit.load(userId, 'user_id');
                    if (userCredit.getId()) {
                        await userCredit.setBalance(userCredit.getBalance() + entity.getCreditEarn()).save();
                    } else {
                        userCredit = OM.create<UserCredit>(UserCredit);
                        await userCredit.addData({
                            user_id: userId,
                            balance: entity.getCreditEarn()
                        }).save();
                    }
                }
            } else {
                throw new Meteor.Error("Error", 'some_thing_went_wrong_when_upgrade_plan');
            }
        }
        catch (e) {
            StoneLogger.error("We can not add credit when adjust plan, please check", {entity, e})
        }
    }
}