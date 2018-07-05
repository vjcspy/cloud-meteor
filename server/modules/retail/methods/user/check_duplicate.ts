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
        let ids_domain = [];
        let ids_company_name = [];
        let ids_phone = [];
        if(listUsers.length > 0) {
            for(let temp of listUsers) {
                if(temp['_id'] === userData['_id']) {
                    continue;
                }
                if (temp['company_name'] !== null && userData['company_name'] !== null && (userData['company_name'] === temp['company_name'])) {
                    ids_company_name.push(temp['_id']);
                }
                if (temp['url_customer_domain'] !== null && userData['url_customer_domain'] !== null && (userData['url_customer_domain'] === temp['url_customer_domain'])) {
                    ids_domain.push(temp['_id']);
                }
                if(temp['profile'].hasOwnProperty('phone')  && userData['profile'].hasOwnProperty('phone')  && (temp['profile']['phone'] === userData['profile']['phone'])) {
                    ids_phone.push(temp['_id']);
                }
            }
        }
        return {'user_id' : userData['_id'],'ids_domain' :ids_domain, 'ids_company_name' : ids_company_name,'ids_phone': ids_phone };
    }
});