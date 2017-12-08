import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {License} from "../models/license";
import {LicenseInterface, ProductLicenseBillingCycle} from "../api/license-interface";
import {Price} from "../models/price";
import {Plan} from "../../sales/models/plan";
import {UserLicense} from "../models/userlicense";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {Product} from "../models/product";
import {StringHelper} from "../../../code/Framework/StringHelper";

export class LicenseHelper {
    async createLicense(plan: Plan) {
        let license = OM.create<License>(License);
        
        let user = OM.create<User>(User);
        user.loadById(plan.getUserId());
        if (!user.getId()) {
            throw new Meteor.Error("Error", "can_not_find_user_when_create_license");
        }
        
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
        
        // resolve expire date
        let expiry_date;
        if (pricing.getPriceType() === Price.TYPE_LIFETIME) {
            expiry_date = DateTimeHelper.getCurrentDate();
        } else if (pricing.getPriceType() === Price.TYPE_SUBSCRIPTION) {
            if (plan.getPricingCycle() === ProductLicenseBillingCycle.MONTHLY) {
                expiry_date = moment().add(1, 'M').toDate();
            } else if (plan.getPricingCycle() === ProductLicenseBillingCycle.ANNUALLY) {
                expiry_date = moment().add(1, 'y').toDate();
            }
        } else if (pricing.getPriceType() === Price.TYPE_TRIAL) {
            expiry_date = DateTimeHelper.getCurrentMoment().add(pricing.getTrialDay(), 'd').toDate();
        } else {
            throw new Meteor.Error("Error", "can_not_resolve_expire_date");
        }
        
        // save License
        let licenseData: LicenseInterface = {
            key: StringHelper.getUnique(),
            status: 1,
            shop_owner_id: user.getId(),
            shop_owner_username: user.getUsername(),
            current_cashier_increment: 0,
            has_product: [
                {
                    base_url: [],
                    plan_id: plan.getId(),
                    has_user: [],
                    purchase_date: DateTimeHelper.getCurrentDate(),
                    product_id: product.getId(),
                    addition_entity: plan.getAdditionEntity(),
                    pricing_id: pricing.getId(),
                    billing_cycle: plan.getPricingCycle(),
                    expiry_date
                }
            ],
            has_roles: [],
        };
        await license.addData(licenseData).save();
        
        // attack user to this license
        await UserLicense.attach(user, license, User.LICENSE_PERMISSION_OWNER);
    }
    
    getLicenseOfUser(user: User): License {
        const licenses = user.getLicenses();
        
        if (_.size(licenses) === 1) {
            const userLicense = _.first(licenses);
            const license     = OM.create<License>(License);
            license.loadById(userLicense['license_id']);
            
            if (!license.getId()) {
                throw new Meteor.Error("Error", "can_not_find_license");
            }
            
            return license;
        }
        
        return null;
    }
}