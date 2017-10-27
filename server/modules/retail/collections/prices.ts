import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PriceInterface} from "../api/price-interface";

export const Prices            = CollectionMaker.make<PriceInterface>("prices",
                                                                      new SimpleSchema({
                                                                                           _id: {
                                                                                               type: String,
                                                                                               optional: true
                                                                                           },
                                                                                           display_name: String,
                                                                                           type: String,
                                                                                           trialDay: {
                                                                                               type: SimpleSchema.Integer,
                                                                                               optional: true
                                                                                           },
                                                                                           nouser: {
                                                                                               type: Number,
                                                                                               optional: true
                                                                                           },
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
                                                                                           description: {
                                                                                               type: String,
                                                                                               optional: true
                                                                                           }
                                                                                       }));
export const PricingCollection = Prices;