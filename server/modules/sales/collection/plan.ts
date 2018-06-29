import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {PlanInterface} from "../api/plan-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const orderSchema = new SimpleSchema(
    {
        _id: {
            type: String,
            optional: true
        },
        user_id: String,
        product_id: String,
        coupon_id: {
            type: String,
            optional: true
        },
        pricing_id: String,
        pricing_cycle: Number,
        addition_entity: Number,
        num_of_cycle: Number,
        
        prev_pricing_id: {
            type: String,
            optional: true
        },
        prev_pricing_cycle: {
            type: Number,
            optional: true
        },
        prev_addition_entity: {
            type: Number,
            optional: true
        },
        
        price: Number,
        credit_earn: Number,
        credit_spent: Number,
        discount_amount: Number,
        grand_total: Number,
        
        status: Number,
        created_by_user_id: {
            type: String,
            optional: true
        },
        created_at: {
            type: Date,
            defaultValue: DateTimeHelper.getCurrentDate()
        },
        updated_at: {
            type: Date,
            defaultValue: DateTimeHelper.getCurrentDate()
        }
    }
);

export const PlanCollection = CollectionMaker.make<PlanInterface>('sales_plan', orderSchema);
