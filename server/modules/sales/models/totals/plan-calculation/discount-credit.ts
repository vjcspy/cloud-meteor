import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import * as _ from 'lodash';
import {UserCredit} from "../../../../user-credit/models/user-credit";
import {RequestPlan} from "../../../api/data/request-plan";

export class DiscountCredit extends CalculateAbstract implements CalculateInterface {
    total: string = 'discount_amount';

    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
    }

}