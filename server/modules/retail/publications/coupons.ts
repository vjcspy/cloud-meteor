import {CouponInterface} from "../api/coupon-interface";
import {CouponsCollection} from "../collections/coupons";

Meteor.publishComposite("coupons", function (): PublishCompositeConfig<CouponInterface> {
    return {
        find() {
            return CouponsCollection.collection.find();
        }
    };
});
