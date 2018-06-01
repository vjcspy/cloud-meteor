import {OM} from "../../../code/Framework/ObjectManager";
import {AdditionFee} from "../models/additionfee";
import {AdditionFeeInterface, AdditionFeeStatus} from "../api/addition-fee-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {Payment} from "../../sales-payment/models/payment";
import {RequestPlan} from "../api/data/request-plan";
import {User} from "../../account/models/user";
import * as _ from 'lodash';
import {LicenseHelper} from "../../retail/helper/license";
import {UserCredit} from "../../user-credit/models/user-credit";

export class AdditionFeeHelper {
    
    getCheckoutData(additionFee: AdditionFee) {
        let credit_balance = 0;
        const userCredit   = OM.create<UserCredit>(UserCredit);
        userCredit.load(additionFee.getUserId(), 'user_id');
        
        if (userCredit.getId()) {
            credit_balance = userCredit.getBalance();
        }
        let grand_total = 0;
        if (!isNaN(additionFee.getCost())) {
            grand_total = parseFloat(additionFee.getData('cost'));
        }
        let credit_spent = Math.min(grand_total, credit_balance);
        let total        = grand_total - credit_spent;
        
        return {
            credit_spent,
            total,
            credit_balance,
            grand_total
        }
    }
    
    getCurrentUser(userId): User {
        return OM.create<User>(User).loadById(userId);
    }
    
}
