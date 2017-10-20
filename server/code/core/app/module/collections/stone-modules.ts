import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../../MeteorBase/CollectionMaker";

export interface StoneModulesInterface {
    _id?: string;
    name: string;
    version: string;
}


export const StoneModuleCollection = CollectionMaker.make<StoneModulesInterface>("stone_module",
                                                                                 new SimpleSchema({
                                                                                                      _id: {
                                                                                                          type: String,
                                                                                                          optional: true
                                                                                                      },
                                                                                                      name: String,
                                                                                                      version: String
                                                                                                  }));
