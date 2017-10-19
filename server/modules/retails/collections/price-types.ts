import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PriceInterface} from "../api/price.interface";

export const PriceTypes = CollectionMaker.make<PriceInterface>("price_types",
                                                               new SimpleSchema({
                                                                                    _id: {
                                                                                        type: String,
                                                                                        optional: true
                                                                                    },
                                                                                    name: String,
                                                                                    value: String
                                                                                }));
