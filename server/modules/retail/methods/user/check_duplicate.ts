import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Users} from "../../../account/collections/users";

new ValidatedMethod({
    name: "user.check_duplicate",
    validate: function () {
    },run: function (data) {
        const {user_id} = data;
        const user: User = OM.create<User>(User).loadById(user_id);
        const userData = user.getData();
        const listUsers = Users.find({has_license: {$elemMatch: {license_permission: 'owner'}}}).fetch();
        let username_company_name = [];
        let username_domain = [];
        let username_phone = [];
        if(listUsers.length > 0) {
            for(let temp of listUsers) {
                if(temp['_id'] === userData['_id']) {
                    continue;
                }
                if (temp['company_name'] !== null && userData['company_name'] !== null && (userData['company_name'] === temp['company_name'])) {
                    username_company_name.push(temp['username']);
                }
                if (temp['url_customer_domain'] !== null && userData['url_customer_domain'] !== null && (userData['url_customer_domain'] === temp['url_customer_domain'])) {
                    username_domain.push(temp['username']);
                }
                if(temp['profile'].hasOwnProperty('phone')  && userData['profile'].hasOwnProperty('phone')  && (temp['profile']['phone'] === userData['profile']['phone'])) {
                    username_phone.push(temp['username']);
                }
            }
        }
        return {'user_id' : userData['_id'],'username_domains' :username_domain, 'username_company_names' : username_company_name,'users_phones': username_phone };
    }
});