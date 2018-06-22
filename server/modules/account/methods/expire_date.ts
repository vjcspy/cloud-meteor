import {ExpireDateCollection} from "../../retail/collections/expiredate";
import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {USER_EMAIL_TEMPLATE} from "../api/user-interface";

new ValidatedMethod({
            name: "license.admin_send_emails",
            validate: data => {

            },
    run: (data) => {
                const  expireDate = ExpireDateCollection.findOne({ _id: data['data'] });
                const user: User = OM.create(User);
                user.sendData(expireDate, USER_EMAIL_TEMPLATE.EXPIRED);

    }
});