import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {ExpireDateInterface} from "../api/expire-date-interface";

export const ExpireDateCollection = CollectionMaker.make<ExpireDateInterface>("expire_date", new SimpleSchema({
    license: String,
    shop_owner_id: String,
    shop_owner_username: String,
    product_id: String,
    purchase_date: String,
    expiry_date: String
}));
