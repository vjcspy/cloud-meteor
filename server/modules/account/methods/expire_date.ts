import {ExpireDateCollection} from "../../retail/collections/expiredate";

new ValidatedMethod({
            name: "license.admin_send_emails",
            validate: data => {

            },
    run: (data) => {
                const  expireDate = ExpireDateCollection.findOne({ _id: data['data'] });
                Email.send({
                    to: `${expireDate['email']}`,
                    from: "",
                    subject: " Expire Date ",
                    text: "hello guy"
                })

    }
});