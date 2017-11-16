import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import {RequestPlan} from "../../../api/request-plan";

export interface CalculateInterface {
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void;
}