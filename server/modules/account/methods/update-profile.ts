import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";
import {SupportToken} from "../../retail/common/support_token";
import * as $q from "q";

new ValidatedMethod({
    name: "accounts.user_update_profile",
    validate: function () {
        if (!this.userId) throw new Meteor.Error('unauthorized', 'User must be logged-in to edit profile');
    },
    run: function (userData: Object) {
        const userModel = OM.create<User>(User);
       return userModel.updateProfile(this.userId,userData);
    }
});

DDPRateLimiter.addRule({
    userId: function () {
        return true;
    },
    type: "method",
    name: "accounts.user_update_profile",
}, 1, 1000);
