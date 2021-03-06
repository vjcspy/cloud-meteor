import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {PlanInterface, PlanStatus} from "../api/plan-interface";
import {User} from "../../account/models/user";
import {License} from "../../retail/models/license";
import {PlanCollection} from "../collection/plan";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {PlanCalculation} from "../models/totals/plan-calculation";
import {Price} from "../../retail/models/price";
import {Payment} from "../../sales-payment/models/payment";
import {InvoiceType} from "../api/invoice-interface";
import {updateExpireDate} from "../../retail/jobs/update-expire-date";

export class HandleAdminChangeLicense implements ObserverInterface {
    observe(dataObject: DataObject): any {
        // Check all license product in this license, if current data in product license different with current plan, we need create new plan for this change
        const {license}          = dataObject.getData('data');
        const license1            = OM.create<License>(License).load(license.getData('key'), 'key');
        const licenseHasProducts = license1.getProducts();
        let calculator = OM.create<PlanCalculation>(PlanCalculation);
        const user               = OM.create<User>(User);
        let payment = OM.create<Payment>(Payment);
        user.loadById(license1.getData('shop_owner_id'));
    
        _.forEach(licenseHasProducts, (_d) => {
            let newPricing = OM.create<Price>(Price).loadById(_d['pricing_id']);
    
            if (!_d['plan_id']) {
                // if license_product haven't had plan_id yet, we must create it now
                const plan = OM.create<Plan>(Plan);
                const requestPlan = {
                    addition_entity: _d['addition_entity'],
                    cycle: _d['billing_cycle'],
                    num_of_cycle: 1,
                    pricing_id: _d['pricing_id']
                };
                let totals;
                if (!newPricing.isTrial()) {
                    totals   = calculator.getTotals(requestPlan, _d['product_id'], user.getId(), null);
                }
                let newPlan: PlanInterface = {
                    user_id: user.getId(),
                    product_id: _d['product_id'],
                    license_id: license1.getId(),
                    pricing_id: _d['pricing_id'],
                    pricing_cycle: _d['billing_cycle'],
                    num_of_cycle: 1,
                    addition_entity: _d['addition_entity'],
                    prev_pricing_id: null,
                    prev_pricing_cycle: null,
                    prev_addition_entity: null,
                    price: !newPricing.isTrial() ? totals.total.price : 0,
                    credit_earn: 0,
                    credit_spent: 0,
                    discount_amount: 0,
                    grand_total: 0,

                    status: PlanStatus.SALE_PENDING,
                    created_by_user_id: Meteor.userId(),
                    created_at: DateTimeHelper.getCurrentDate(),
                    updated_at: DateTimeHelper.getCurrentDate()
                };

                plan.createSalePlan(newPlan);
                _d['plan_id'] = plan.getId();
            } else {
                // Kiểm tra xem nếu license data khác với plan hiện tại (kiểm tra các field: pricing_id,pricing_cycle,addition_entity) thì tạo một plan mới cho license tương tự như trên
                const plan = OM.create<Plan>(Plan);
                const oldPlan = PlanCollection.findOne({_id: _d['plan_id']});
                if(oldPlan['addition_entity'] === _d['addition_entity'] && oldPlan['pricing_cycle'] === _d['billing_cycle'] && oldPlan['pricing_id'] === _d['pricing_id']) {
                   return;
                } else {
                    const requestPlan = {
                        addition_entity: _d['addition_entity'],
                        cycle: _d['billing_cycle'],
                        num_of_cycle: oldPlan['num_of_cycle'],
                        pricing_id: _d['pricing_id']
                    }
                    let totals;
                    if(!newPricing.isTrial()) {
                        totals   = calculator.getTotals(requestPlan, _d['product_id'], user.getId(), null);
                    }
                    let newPlan: PlanInterface = {
                        user_id: user.getId(),
                        product_id: _d['product_id'],
                        license_id: license1.getId(),
                        pricing_id: _d['pricing_id'],
                        pricing_cycle: _d['billing_cycle'],
                        num_of_cycle: oldPlan['num_of_cycle'],
                        addition_entity: _d['addition_entity'],
                        prev_pricing_id: oldPlan['pricing_id'],
                        prev_pricing_cycle: oldPlan['pricing_cycle'],
                        prev_addition_entity: oldPlan['addition_entity'],
                        price: !newPricing.isTrial() ? totals.total.price : 0,
                        credit_earn: 0,
                        credit_spent: 0,
                        discount_amount: 0,
                        grand_total: 0,
                        status: PlanStatus.SALE_PENDING,
                        created_by_user_id: Meteor.userId(),
                        created_at: DateTimeHelper.getCurrentDate(),
                        updated_at: DateTimeHelper.getCurrentDate()
                    };
                    plan.createSalePlan(newPlan);
                }
                _d['plan_id'] = plan.getId();
            }
        });
        license1.setData('has_product',licenseHasProducts).save();
        updateExpireDate();
        return undefined;
    }

}
