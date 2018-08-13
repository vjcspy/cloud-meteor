import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";

new ValidatedMethod({
                        name: "user.get_username",
                        validate: function () {
                        },
                        run: function (data) {
                            const {user_id} = data;
                            const user: User = OM.create<User>(User).loadById(user_id);
                            return {username: user.getUsername()};
                        }
                    });