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
import {USER_EMAIL_TEMPLATE} from "../../account/api/email-interface";
import {PricingCollection} from "../../retail/collections/prices";
import {Users} from "../../account/collections/users";
import {BRAINTREE_ENVIROMENT} from "../../sales-payment-braintree/etc/braintree.config";
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
        let emailData;
        let user = OM.create<User>(User);
        user.loadById(userId);
        const payment_data = JSON.parse(data['invoice']['_data']['payment_data']);
        const product = ProductCollection.findOne({'_id': data['entity']['_data']['product_id']});
        const pricing = PricingCollection.findOne({'_id': data['entity']['_data']['pricing_id']});
        const users   = Users.findOne({'_id': data['entity']['_data']['user_id']});
        let listEmails: any[] = [user.getEmail()];
        emailData = {
            user_name  : users['username'],
            product_name: product['name'],
            product_id  : data['entity']['_data']['product_id'],
            pricing_plan: pricing['display_name'],
            total_amount: data['totals']['total'],
            card_number : payment_data.hasOwnProperty('transaction')? payment_data['transaction']['creditCard']['maskedNumber']:"",
            transaction_date: data['invoice']['_data']['created_at'],
            order_number: data['invoice']['_data']['_id'],
            order_status: 'Complete'
        };
        if(BRAINTREE_ENVIROMENT === 'SANDBOX') {
            var fs = require("fs");
            if(!fs.existsSync('../../list-email.json')) {
                if(fs.existsSync('../../../../../list-email.json')) {
                    fs.copyFileSync('../../../../../list-email.json', '../../list-email.json');
                } else {
                    const data = {
                        emails: [],
                        sendExp: []
                    }
                    fs.writeFileSync("../../list-email.json", JSON.stringify(data));
                }
            }
            let emailData = fs.readFileSync('../../list-email.json');
            let list = JSON.parse(emailData);
            if (_.isArray(list['emails'])) {
                listEmails = _.concat(listEmails,list['emails']);
            }
        }
        _.forEach(listEmails, (email) => {
            emailData['email'] = email;
            user.sendData(emailData,USER_EMAIL_TEMPLATE.INVOICE);
        });
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