import {Users} from "../../account/collections/users";
import * as $q from "q";
import {OM} from "../../../code/Framework/ObjectManager";
import {UserPendingModel} from "../../account/models/user-pending-model";
import * as _ from "lodash";

export class CommonUser {
    public static checkUserSystem(username: string, email: string): Object {
        const listUser = Users.find().fetch();
        return _.find(listUser, (user) => user['username'] === username || user['emails'][0]['address'] === email);

    }

    public  static  storeUserPending(data:Object, duplicated_with: string): void {
        let defer = $q.defer();
        let user_pending: UserPendingModel = OM.create<UserPendingModel>(UserPendingModel);
        user_pending.setData('customer_name',data['customer_name'])
            .setData('username',data['username'])
            .setData('email', data["email"])
            .setData('phone_number', data["phone_number"])
            .setData('company_name', data["company_name"])  // Waiting_For_Approval, Approved  , Rejected
            .setData('customer_url', data["customer_url"])
            .setData('created_by_user_id', data["created_by_user_id"])
            .setData('duplicated_with', duplicated_with)
            .save()
            .then(() => {
                return defer.resolve();
            }).catch((err) => defer.reject(err));
        return defer.promise;
    }


}