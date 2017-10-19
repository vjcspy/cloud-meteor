import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../MeteorBase/CollectionMaker";
import {CoreConfigInterface} from "../api/core-config-interface";

export const CoreConfigCollection = CollectionMaker.make<CoreConfigInterface>("core_config",
                                                                              new SimpleSchema({
                                                                                                   _id: {
                                                                                                       type: String,
                                                                                                       optional: true
                                                                                                   },
                                                                                                   path: String,
                                                                                                   value: SimpleSchema.oneOf(String, SimpleSchema.Integer),
                                                                                               }));
