import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import SimpleSchema from 'simpl-schema';
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {CouponInterface} from "../api/coupon-interface";

export const CouponsCollection = CollectionMaker.make<CouponInterface>("coupons", new SimpleSchema({
    code: String,
    name: String,
    license_compatible: {
        type: Array
    },
    "license_compatible.$": new SimpleSchema(
        {
            license_id: String
        }
    ),
    description: {
        type: String,
        optional: true
    },
    quantity: {
        type: Number,
        optional: true
    },
    used: Number,
    quantity_user: {
        type: Number,
        optional: true
    },
    method: Number,
    amount: Number,
    min_total: {
        type: Number,
        optional: true
    },
    from_date: {
        type: Date,
        optional: true
    },
    to_date: {
        type: Date,
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
    
    
}));