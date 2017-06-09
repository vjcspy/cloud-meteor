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
                                                             cost_monthly: {
                                                               type: String,
                                                               optional: true
                                                             },
                                                             cost_annually: {
                                                               type: String,
                                                               optional: true
                                                             },
                                                             cost_adding: {
                                                               type: String,
                                                               optional: true
                                                             },
                                                             visibility: SimpleSchema.Integer,
                                                             description: {
                                                               type: String,
                                                               optional: true
                                                             }
                                                           }));
