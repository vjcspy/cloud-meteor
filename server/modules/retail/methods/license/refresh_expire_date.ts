import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {updateExpireDate} from "../../jobs/update-expire-date";
import {ClientStoragesCollection} from "../../collections/clientstorages";
import * as moment from "moment";

new ValidatedMethod ({
                    name: "license.refresh_expire_date",
                    validate: function () {
                        const user = OM.create<User>(User).loadById(this.userId);
                        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                        } else {
                            throw new Meteor.Error("user.edit_user_credit_error", "Access denied");
                        }
                    },
                    run: function () {
                       let  data = {
                            license: '321858e894665b09d494eaaed0081c65',
                            base_url: 'http://cloud.local',
                            data: {
                                entity: 'abc',
                                entity_id: 3,
                                type_change: 'xyz'
                            },
                            cache_time: 1,
                            created_at: moment().toDate()
                        }
                        for (var i = 1; i <= 100000; i++) {
                            ClientStoragesCollection.insert( data )
                        }
                        updateExpireDate();
                    }
});