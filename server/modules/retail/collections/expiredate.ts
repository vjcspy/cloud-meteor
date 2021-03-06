import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {ExpireDateInterface} from "../api/expire-date-interface";

export const ExpireDateCollection = CollectionMaker.make<ExpireDateInterface>("expire_date", new SimpleSchema({
    license_id: String,
    email: {
        type: String,
        optional: true
    },
    shop_owner_username : {
        type: String,
        optional: true
    },
    product_id: String,
    purchase_date: Date,
    expiry_date: Date,
    plan_id: String,
    pricing_code: String,
    pricing_id: String
}));
