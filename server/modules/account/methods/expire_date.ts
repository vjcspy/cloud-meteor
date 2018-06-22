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
                if(expireDate['pricing_code']==="cpos_trial"){
                    user.sendData(expireDate, USER_EMAIL_TEMPLATE.TRIAL_EXPIRED);
                } else {
                    user.sendData(expireDate, USER_EMAIL_TEMPLATE.EXPIRED);
                }

    }
});