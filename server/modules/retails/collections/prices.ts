import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PriceInterface} from "../api/price.interface";

export const Prices = CollectionMaker.make<PriceInterface>("prices",
                                                           new SimpleSchema({
                                                             _id: {
                                                               type: String,
                                                               optional: true
                                                             },
                                                             code: String,
                                                             name: String,
                                                             display_name: String,
                                                             type: SimpleSchema.Integer,
                                                             cost: String,
                                                             visibility: SimpleSchema.Integer,
                                                             description: {
                                                               type: String,
                                                               optional: true
                                                             }
                                                           }));
