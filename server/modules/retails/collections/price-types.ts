import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PriceInterface} from "../api/price.interface";
import {PriceTypeInterface} from "../api/price-type-interface";

export const PriceTypesCollection = CollectionMaker.make<PriceTypeInterface>("price_type",
                                                                             new SimpleSchema({
                                                                                                  _id: {
                                                                                                      type: String,
                                                                                                      optional: true
                                                                                                  },
                                                                                                  name: String,
                                                                                                  data: {
                                                                                                      type: Object,
                                                                                                      optional: true
                                                                                                  }
                                                                                              }));
