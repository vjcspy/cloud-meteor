import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import * as _ from 'lodash';
import {LicenseHelper} from "../../retail/helper/license";
import {StoneLogger} from "../../../code/core/logger/logger";
import {Stone} from "../../../code/core/stone";
import {ProductCollection} from "../../retail/collections/products";
import {PricingCollection} from "../../retail/collections/prices";
import {USER_EMAIL_TEMPLATE} from "../../account/api/user-interface";
import {Users} from "../../account/collections/users";

/**
 * Handle after created invoice to change plan
 */
export class HandleCreateInvoice implements ObserverInterface {
    async observe(dataObject: DataObject) {
        const data       = dataObject.getData('data');
        const typePay    = data['typePay'];
        if(typePay !== 0) {
            return;
        }
        const plan: Plan = data['entity'];
        const userId     = plan.getUserId();

        let user = OM.create<User>(User);
        user.loadById(userId);
        const braintree: any[] = [];
        const payment_data = JSON.parse(data['invoice']['_data']['payment_data']);
        const product = ProductCollection.findOne({'_id': data['entity']['_data']['product_id']});
        const pricing = PricingCollection.findOne({'_id': data['entity']['_data']['pricing_id']});
        const users   = Users.findOne({'_id': data['entity']['_data']['user_id']});
        braintree.push({
            user_name  : users['username'],
           product_name: product['name'],
           pricing_plan: pricing['display_name'],
           total_amount: data['totals']['total'],
           email       : user.getEmail(),
           card_number : payment_data.hasOwnProperty('transaction')? payment_data['transaction']['creditCard']['maskedNumber']:"",
           transaction_date: data['invoice']['_data']['created_at'],
           order_number: data['invoice']['_data']['_id'],
           order_status: 'Complete'
        });
        user.sendData(braintree,USER_EMAIL_TEMPLATE.INVOICE);
        try {
            if (!user.getId()) {
                throw new Meteor.Error('Error', 'can_not_found_user_when_upgrade_plan');
            }

            if (user.isInRoles([Role.AGENCY], Role.GROUP_CLOUD)) {
                throw new Meteor.Error("Error", 'not_yet_support_agency_buy_license');
            } else if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
                const $license = Stone.getInstance().s('$license') as LicenseHelper;
                await $license.updateLicense(plan);
            } else {
                throw new Meteor.Error("Error", 'some_thing_went_wrong_when_upgrade_plan');
            }
        }
        catch (e) {
            StoneLogger.error("We can not upgrade plan for user, please check", {plan, e})
        }
    }
}