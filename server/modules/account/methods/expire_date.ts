import {OM} from "../../../code/Framework/ObjectManager";
import {ExpireDateCollection} from "../../retail/collections/expiredate";
import {Users} from "../collections/users";

new ValidatedMethod({
            name: "license.admin_send_emails",
            validate: data => {

            },
    run: (data) => {
                const  expireDate = ExpireDateCollection.findOne({ _id: data['data'] });
                const user = Users.findOne({_id: expireDate['shop_owner_id']});
                console.log(user['emails'][0]['address']);
                Email.send({
                    to: `${user['emails'][0]['address']}`,
                    from: "",
                    subject: " Expire Date ",
                    text: "hello guy"
                })

    }
});