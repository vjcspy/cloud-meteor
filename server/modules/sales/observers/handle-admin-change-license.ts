import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {PlanInterface, PlanStatus} from "../api/plan-interface";
import {User} from "../../account/models/user";

export class HandleAdminChangeLicense implements ObserverInterface {
    observe(dataObject: DataObject): any {
        // Check all license product in this license, if current data in product license different with current plan, we need create new plan for this change
        const {license}          = dataObject.getData('data');
        const licenseHasProducts = license.getProducts();
        const user               = OM.create<User>(User);
        user.load(license.getData('shop_owner_username'), 'username');

        _.forEach(licenseHasProducts, (_d) => {
            if (_d['plan_id']) {
                // if license_product haven't had plan_id yet, we must create it now
                const plan = OM.create<Plan>(Plan);

                let newPlan: PlanInterface = {
                    user_id: user.getId(),
                    product_id: _d['product_id'],
                    license_id: license.getId(),
                    pricing_id: _d['pricing_id'],
                    pricing_cycle: _d['pricing_cycle'],
                    num_of_cycle: 1,
                    addition_entity: _d['addition_entity'],
                    prev_pricing_id: null,
                    prev_pricing_cycle: null,
                    prev_addition_entity: null,
                    price: 0,
                    credit_earn: 0,
                    credit_spent: 0,
                    discount_amount: 0,
                    grand_total: 0,

                    status: PlanStatus.SALE_PENDING,
                    created_at: DateTimeHelper.getCurrentDate(),
                    updated_at: DateTimeHelper.getCurrentDate()
                };

                plan.createSalePlan(newPlan);
            } else {
                // Kiểm tra xem nếu license data khác với plan hiện tại (kiểm tra các field: pricing_id,pricing_cycle,addition_entity) thì tạo một plan mới cho license tương tự như trên
            }
        });

        return undefined;
    }

}