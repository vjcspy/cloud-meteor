import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {UserCreditCollection} from "../collections/user-credit";

export class UserCredit extends AbstractModel {
    $collection: string = 'user_credit';

    getUserBalanace(user_id: String): number {
        const credit = UserCreditCollection.collection.findOne({user_id});
        if (credit) {
            return credit.balance;
        } else {
            return 0;
        }
    }

    setBalance(point: number) {
        this.setData('balance', point);

        return this;
    }

    getBalance() {
        const p = this.getData('balance');
        return isNaN(p) ? 0 : p;
    }
}