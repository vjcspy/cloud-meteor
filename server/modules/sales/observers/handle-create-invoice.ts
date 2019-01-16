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
import {USER_EMAIL_TEMPLATE} from "../../account/api/email-interface";
import {BRAINTREE_ENVIROMENT} from "../../sales-payment-braintree/etc/braintree.config";
import * as listData from "../../../../list-email.json";
import {Price} from "../../retail/models/price";
import {Product} from "../../retail/models/product";
import {License} from "../../retail/models/license";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import * as moment from 'moment';
import {AdditionFee} from "../../retail/models/additionfee";
import {updateExpireDate} from "../../retail/jobs/update-expire-date";

/**
 * Handle after created invoice to change plan
 */
export class HandleCreateInvoice implements ObserverInterface {

    async observe(dataObject: DataObject) {
        const data       = dataObject.getData('data');
        const typePay    = data['typePay'];
        let user = OM.create<User>(User);
        let emailData;
        const payment_data = JSON.parse(data['invoice']['_data']['payment_data']);
        let listEmails: any[] = [];
        if(BRAINTREE_ENVIROMENT !== 'SANDBOX') {
            var fs = require("fs");
            if(!fs.existsSync('../../list-email.json')) {
                const content = {
                    emails: [],
                    sendExp: []
                };
                const data = listData ? listData : content;
                fs.writeFileSync("../../list-email.json", JSON.stringify(data));

            }
            let emailData = fs.readFileSync('../../list-email.json');
            let list = JSON.parse(emailData);
            if (_.isArray(list['emails'])) {
                listEmails = list['emails'];
            }
        }
        if(typePay !== 0) {
            const additionFee: AdditionFee = data['entity'];
            const userId     = additionFee.getUserId();
            user.loadById(userId);
            listEmails = _.concat(listEmails,[user.getEmail()]);
            emailData = {
                user_name  : user.getUsername(),
                fee_name: additionFee.getName(),
                cost  : additionFee.getCost(),
                totals: data['totals'],
                card_number : payment_data.hasOwnProperty('transaction')? payment_data['transaction']['creditCard']['maskedNumber']:"",
                transaction_date: data['invoice']['_data']['created_at'],
                order_number: data['invoice']['_data']['_id'],
                order_status: 'Complete'
            };

            _.forEach(listEmails, (email) => {
                emailData['email'] = email;
                user.sendData(emailData, USER_EMAIL_TEMPLATE.INVOICE_FEE);
            });
            return;
        }
        const plan: Plan = data['entity'];
        const userId     = plan.getUserId();
        user.loadById(userId);
        let pricing = OM.create<Price>(Price);
        pricing.loadById(plan.getPricingId());
        if (!pricing.getId()) {
            throw new Meteor.Error("Error", "can_not_find_pricing_when_create_license");
        }

        let product = OM.create<Product>(Product);
        product.loadById(plan.getProductId());
        if (!pricing.getId()) {
            throw new Meteor.Error("Error", "can_not_find_product_when_create_license");
        }
        let price;
        let pricingCycle;
        if(pricing.getPriceType() === 'trial') {
            price = 0;
            pricingCycle = 'trial';
        } else if(pricing.getPriceType() === 'lifetime') {
            price = pricing.getData('lifetime_cost');
            pricingCycle = 'lifetime';

        } else {
            if (plan.getPricingCycle() === ProductLicenseBillingCycle.MONTHLY) {
                price = pricing.getCostMonthly();
                pricingCycle = 'monthly';
            } else if (plan.getPricingCycle() === ProductLicenseBillingCycle.ANNUALLY) {
                price = pricing.getCostAnnually();
                pricingCycle = 'annually';

            }
        }
        let oldExpDate;
        let expDate;

        let license: License;
        // resolve expire date
        const licenseHelper = OM.create<LicenseHelper>(LicenseHelper);

        if (_.size(user.getLicenses()) > 0) {
            license = licenseHelper.getLicenseOfUser(user);
            const productLicense = license.getProductLicense(plan.getProductId());
            if (productLicense && productLicense.plan_id === plan.getId()) {
                // extend current plan
                oldExpDate = productLicense.expiry_date;
                expDate = licenseHelper.getExpiryDate(plan, pricing, moment(productLicense.expiry_date));
            } else {
                // adjust plan
                expDate = licenseHelper.getExpiryDate(plan, pricing);
            }
        } else {
            expDate = licenseHelper.getExpiryDate(plan, pricing);
        }

        // const users   = Users.findOne({'_id': data['entity']['_data']['user_id']});
        listEmails = _.concat(listEmails,[user.getEmail()]);
        emailData = {
            user_name  : user.getUsername(),
            product_name: product.getData('name'),
            product_id  : data['entity']['_data']['product_id'],
            pricing_plan: pricing.getData('display_name'),
            pricing_cycle: pricingCycle,
            number_cycle: plan.getNumberOfCycle(),
            number_register: plan.getAdditionEntity(),
            old_expire_date: oldExpDate,
            expire_date: expDate,
            price: price,
            totals: data['totals'],
            card_number : payment_data.hasOwnProperty('transaction')? payment_data['transaction']['creditCard']['maskedNumber']:"",
            transaction_date: data['invoice']['_data']['created_at'],
            order_number: data['invoice']['_data']['_id'],
            order_status: 'Complete'
        };

        _.forEach(listEmails, (email) => {
            emailData['email'] = email;
            if(emailData['old_expire_date']) {
                user.sendData(emailData,USER_EMAIL_TEMPLATE.RENEW);
            } else {
                user.sendData(emailData,USER_EMAIL_TEMPLATE.INVOICE);
            }
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
                updateExpireDate();
            } else {
                throw new Meteor.Error("Error", 'some_thing_went_wrong_when_upgrade_plan');
            }
        }
        catch (e) {
            StoneLogger.error("We can not upgrade plan for user, please check", {plan, e})
        }
    }
}