import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../../MeteorBase/CollectionMaker";

export const StoneModule = CollectionMaker.make("stone_module",
                                                new SimpleSchema({
                                                                     _id: {
                                                                         type: String,
                                                                         optional: true
                                                                     },
                                                                     name: String,
                                                                     version: String
                                                                 }));
