import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PlanInterface} from "../api/plan-interface";

export const orderSchema = new SimpleSchema(
    {
        _id: {
            type: String,
            optional: true
        },
        user_id: String,
        product_id: String,
        
        pricing_id: String,
        pricing_code: String,
        pricing_cycle: Number,
        prev_pricing_id: {
            type: String,
            optional: true
        },
        prev_pricing_cycle: {
            type: Number,
            optional: true
        },
        
        cost_new_plan: Number,
        credit_change_plan: Number,
        discount_amount: Number,
        grand_total: Number,
    }
);

export const PlanCollection = CollectionMaker.make<PlanInterface>('sales_plan', orderSchema);