import * as $q from "q";
import * as _ from "lodash";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";

new ValidatedMethod({
                        name: "user.get_username",
                        validate: function () {
                        },
                        run: function (data) {
                            let defer = $q.defer();
                            const {user_id} = data;
                            let user: User = OM.create<User>(User).loadById(user_id);
                            return {username: user.getUsername()};
                        }
                    });