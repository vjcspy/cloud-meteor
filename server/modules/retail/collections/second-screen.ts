import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {SecondScreenInterface} from "../api/second-screen-interface";

export const SecondScreenCollection = CollectionMaker.make<SecondScreenInterface>("second_screen", new SimpleSchema({
    license_key: String,
    url: String,
    register_id: String,
    cart_id: String,
    user_id: String,
}));