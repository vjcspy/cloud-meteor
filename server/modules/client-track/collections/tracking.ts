import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {TrackingInterface} from "../api/tracking-interface";

export const TrackingCollection = CollectionMaker.make<TrackingInterface>("tracking", new SimpleSchema({
    type: String,
    data: String
}));
