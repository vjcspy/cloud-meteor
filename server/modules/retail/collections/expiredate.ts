import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {ExpireDateInterface} from "../api/expire-date-interface";

export const ExpireDateCollection = CollectionMaker.make<ExpireDateInterface>("expire_date", new SimpleSchema({
    license_id: String,
    shop_owner_id: {
        type: String,
        optional: true
    },
    shop_owner_username : {
        type: String,
        optional: true
    },
    product_id: String,
    purchase_date: String,
    expiry_date: String
}));
