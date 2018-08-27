import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {Users} from "../../../account/collections/users";
import * as _ from "lodash";
new ValidatedMethod({
    name: "user.approve_user_pending",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("user.edit_user_error", "Access denied");
        }
    },
    run: function (data: Object) {
        let defer = $q.defer();
        let user: User = OM.create<User>(User).loadById(data['_id']);
        if(data['assign_to_agency']) {
            let agency: User = OM.create<User>(User).loadById(_.findLast(data['assign_to_agency'])['agency_id']);
            let user_assigned = [];
            let agencyDetail = agency.getData('agency');
            user_assigned = agencyDetail['user_assigned'];
            if(user_assigned) {
                user_assigned.push({
                    user_id: data['_id']
                });
            } else {
                const listAssigned = Users.collection.find({assign_to_agency: {$in: [{agency_id: agency.getId()}]}}).fetch();
                if (listAssigned) {
                    _.forEach(listAssigned, (u) => {
                        user_assigned.push({
                            user_id: u['_id']
                        });
                    });
                }
                user_assigned.push({
                    user_id: data['_id']
                })
            }
            agencyDetail['user_assigned'] = user_assigned;
            agency.setData('agency', agencyDetail)
                .save();
        }
        user.setData('assign_to_agency',data['assign_to_agency'])
            .setData('take_care_by_agency', data['take_care_by_agency'])
            .save()
            .then(() => {
                return defer.resolve();
            }).catch((err) => defer.reject(err));
        return defer.promise;
    }
});

