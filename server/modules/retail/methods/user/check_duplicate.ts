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
        const listUsers = Users.find().fetch();
        let username_company_names = [];
        let username_domains = [];
        let username_phones = [];
        if(listUsers.length > 0 && null !== userData) {
            for(let temp of listUsers) {
                if(temp['_id'] === userData['_id']) {
                    continue;
                }
                if (temp['company_name'] !== null && userData['company_name'] !== null && (userData['company_name'] === temp['company_name'])) {
                    username_company_names.push(temp['username']);
                }
                if (temp['url_customer_domain'] !== null && userData['url_customer_domain'] !== null && (userData['url_customer_domain'] === temp['url_customer_domain'])) {
                    username_domains.push(temp['username']);
                }
                if(temp['profile'].hasOwnProperty('phone')  && userData['profile'].hasOwnProperty('phone')  && (temp['profile']['phone'] === userData['profile']['phone'])) {
                    username_phones.push(temp['username']);
                }
            }
        }
        return {'user_id' : userData['_id'],'username_domains' :username_domains, 'username_company_names' : username_company_names,'username_phones': username_phones };
    }
});