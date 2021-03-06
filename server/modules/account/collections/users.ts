import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {UserInterface} from "../api/user-interface";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";
import {Role} from "../models/role";
import SimpleSchema from 'simpl-schema';

export const userSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    username: String,
    services: {
        type: Object,
        optional: true
    },
    email: Array,
    roles: {
        type: Object,
        optional: true
    },
    profile: {
        type: Object,
        optional: true
    },
    has_license: {
        type: Array,
        optional: true
    },
    "has_license.$": Object,
    createdAt: Date,
    created_by_user_id: {
    type: String,
        optional: true
    },
    assign_to_agency: {
        type: Array,
        optional: true
    },
    'assign_to_agency.$': new SimpleSchema(
        {
            agency_id: String,
        }
    ),
    agency : {
        type:Object,
        optional:true
    },
    take_care_by_agency: {
        type: Array,
        optional: true
    },
    'take_care_by_agency.$': new SimpleSchema(
        {
            agency_id: String,
        }
    ),
    company_name: {
        type: String,
        optional: true
    },
    url_customer_domain: {
        type: String,
        optional: true
    },
    submission_status : {
        type: Number,
        optional: true
    },
    reject_reason : {
        type: String,
        optional: true
    }
});
export const Users      = CollectionMaker.makeFromExisting<UserInterface>(Meteor.users);


// hook to add default role and send verify email
CollectionMaker.hookAfterInsert('users', (userId, user) => {
    let userModel = OM.create<User>(User, false, user);
    userModel.addToRoles([Role.USER], Role.GROUP_CLOUD);
    // Accounts.sendVerificationEmail(user['_id'])
});
