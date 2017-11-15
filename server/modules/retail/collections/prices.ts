import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PriceInterface} from "../api/price-interface";

export const Prices            = CollectionMaker.make<PriceInterface>("prices",
                                                                      new SimpleSchema(
                                                                          {
                                                                              _id: {
                                                                                  type: String,
                                                                                  optional: true
                                                                              },
                                                                              code: String,
                                                                              display_name: String,
                                                                              type: String,
                                                                              entity_type: Number,
                                                                              free_entity: Number,
                                                                              trial_day: {
                                                                                  type: Number,
                                                                                  optional: true
                                                                              },
                                                                              cost_monthly: {
                                                                                  type: Number,
                                                                                  optional: true
                                                                              },
                                                                              cost_annually: {
                                                                                  type: Number,
                                                                                  optional: true
                                                                              },
                                                                              description: {
                                                                                  type: String,
                                                                                  optional: true
                                                                              }
                                                                          }));
export const PricingCollection = Prices;