import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {UserPendingInterface} from "../api/user-pending-interface";

export const UserPendingCollection = CollectionMaker.make<UserPendingInterface>("user_pending", new SimpleSchema({
    customer_name: {
        type: String,
        optional: true
    },
    username: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    phone_number: {
        type: String,
        optional: true
    },
    company_name: {
        type: String,
        optional: true
    },
    customer_url: {
        type: String,
        optional: true
    },
    created_by_user_id: {
        type: String,
        optional: true
    },
    duplicated_with: {
        type: String,
        optional: true
    }
}));

