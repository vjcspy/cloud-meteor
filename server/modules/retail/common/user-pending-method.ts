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
        user_pending.setData('first_name',data['profile']['first_name'])
            .setData('last_name',data['profile']['last_name'])
            .setData('username',data['username'])
            .setData('email', data["email"])
            .setData('phone_number', data['profile']["phone"])
            .setData('company_name', data["company_name"])
            .setData('customer_url', data["url_customer_domain"])
            .setData('created_by_user_id', Meteor.userId())
            .setData('duplicated_with', duplicated_with)
            .save()
            .then(() => {
                return defer.resolve();
            }).catch((err) => defer.reject(err));
        return defer.promise;
    }


}