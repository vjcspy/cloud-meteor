import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";

export const BraintreePricingPlanSchema = new SimpleSchema({
                                                               _id: {
                                                                   type: String,
                                                                   optional: true
                                                               },
                                                               pricing_code: String,
                                                               braintree_plan_id: String,
                                                           });

export const BraintreePricingPlanCollection = CollectionMaker.make('braintree_pricing_plan', BraintreePricingPlanSchema);