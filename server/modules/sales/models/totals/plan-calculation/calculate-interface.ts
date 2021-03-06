import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import {RequestPlan} from "../../../api/data/request-plan";
import {CouponInterface} from "../../../../retail/api/coupon-interface";

export interface CalculateInterface {
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, coupon:CouponInterface): void;
}