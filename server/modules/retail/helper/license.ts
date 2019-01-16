import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {License} from "../models/license";
import {LicenseHasProductInterface, LicenseInterface, ProductLicenseBillingCycle} from "../api/license-interface";
import {Price} from "../models/price";
import {Plan} from "../../sales/models/plan";
import {UserLicense} from "../models/userlicense";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {Product} from "../models/product";
import {StringHelper} from "../../../code/Framework/StringHelper";
import {SelectOptionsInterface} from "../../base/api/data-provider/select-options";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";

export class LicenseHelper {
    async updateLicense(plan: Plan) {
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

        let license: License;
        // resolve expire date
        const licenseHelper = OM.create<LicenseHelper>(LicenseHelper);

        if (_.size(user.getLicenses()) > 0) {
            license              = licenseHelper.getLicenseOfUser(user);
            const productLicense = license.getProductLicense(plan.getProductId());
            if (productLicense) {
                if (productLicense.plan_id === plan.getId()) {
                    // extend current plan
                    Object.assign(productLicense, {
                        expiry_date: this.getExpiryDate(plan, pricing, moment(productLicense.expiry_date)),
                        // status: 1,
                        last_invoice: DateTimeHelper.getCurrentDate(),
                        created_by: user.getId(),
                        updated_by: user.getId()
                    });
                } else {
                    // adjust plan
                    Object.assign(productLicense, {
                        // base_url: [],
                        plan_id: plan.getId(),
                        // has_user: [],
                        // purchase_date: DateTimeHelper.getCurrentDate(),
                        product_id: product.getId(),
                        // product_version: "",
                        addition_entity: plan.getAdditionEntity(),
                        pricing_id: pricing.getId(),
                        billing_cycle: pricing.getPriceType() === Price.TYPE_TRIAL ? null : plan.getPricingCycle(),
                        expiry_date: this.getExpiryDate(plan, pricing),
                        // status: 1,
                        last_invoice: DateTimeHelper.getCurrentDate(),
                        created_by: user.getId(),
                        updated_by: user.getId()
                    });
                }
            } else {
                // new product for this license
                const hasProduct = license.getProducts();
                hasProduct.push({
                    base_url: [],
                    plan_id: plan.getId(),
                    has_user: [],
                    purchase_date: DateTimeHelper.getCurrentDate(),
                    product_id: product.getId(),
                    product_version: "",
                    addition_entity: plan.getAdditionEntity(),
                    pricing_id: pricing.getId(),
                    billing_cycle: pricing.getPriceType() === Price.TYPE_TRIAL ? null : plan.getPricingCycle(),
                    expiry_date: this.getExpiryDate(plan, pricing),
                    status: 1,
                    last_invoice: DateTimeHelper.getCurrentDate(),
                    created_by: user.getId(),
                    updated_by: user.getId()
                });

                license.setData('has_product', hasProduct);
            }
            await license.save();
        } else {
            // chưa có license
            license = OM.create<License>(License);

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
                        product_version: "",
                        addition_entity: plan.getAdditionEntity(),
                        pricing_id: pricing.getId(),
                        billing_cycle: pricing.getPriceType() === Price.TYPE_TRIAL ? null : plan.getPricingCycle(),
                        expiry_date: this.getExpiryDate(plan, pricing),
                        status: 1,
                        last_invoice: DateTimeHelper.getCurrentDate(),
                        created_by: user.getId(),
                        updated_by: user.getId()
                    }
                ],
                has_roles: [],
            };
            await license.addData(licenseData).save();

            // attack user to this license
            await UserLicense.attach(user, license, User.LICENSE_PERMISSION_OWNER);
        }
    }

    public getExpiryDate(plan: Plan, pricing: Price, startDate = DateTimeHelper.getCurrentMoment()) {
        let expiry_date;
        if (pricing.getPriceType() === Price.TYPE_LIFETIME) {
            expiry_date = DateTimeHelper.getCurrentDate();
        } else if (pricing.getPriceType() === Price.TYPE_SUBSCRIPTION) {
            if (plan.getPricingCycle() === ProductLicenseBillingCycle.MONTHLY) {
                expiry_date = startDate.add(plan.getNumberOfCycle(), 'M').toDate();
            } else if (plan.getPricingCycle() === ProductLicenseBillingCycle.ANNUALLY) {
                expiry_date = startDate.add(plan.getNumberOfCycle(), 'y').toDate();
            }
        } else if (pricing.getPriceType() === Price.TYPE_TRIAL) {
            expiry_date = DateTimeHelper.getCurrentMoment().add(pricing.getTrialDay(), 'd').toDate();
        } else {
            throw new Meteor.Error("Error", "can_not_resolve_expire_date");
        }

        return expiry_date;
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

    async saveLicenseByAdmin(licenseData: Object, user: User, hasProduct: any[]): Promise<any> {
        const license = OM.create<License>(License);

        if (!!licenseData['_id']) {
            license.loadById(licenseData['_id']);
            if (!license.getId()) {
                throw new Meteor.Error("License_Helper", "can_not_find_license");
            }
        }

        if (!license.getId()) {
            if (user.hasLicense()) {
                throw new Meteor.Error("License_Helper", "user_already_has_license");
            }


            let _licenseData: LicenseInterface = {
                key: StringHelper.getUnique(),
                status: licenseData['status'],
                shop_owner_id: user.getId(),
                shop_owner_username: user.getUsername(),
                current_cashier_increment: 0,
                has_product: [],
                has_roles: [],
            };
            _.forEach(hasProduct, (licenseHasProduct) => {
                if (licenseHasProduct['checked'] === true) {
                    let licenseHasProductData: LicenseHasProductInterface = {
                        base_url: licenseHasProduct['base_url'],
                        plan_id: null,
                        has_user: [],
                        purchase_date: DateTimeHelper.getCurrentDate(),
                        product_id: licenseHasProduct['product_id'],
                        product_version: licenseHasProduct['product_version'],
                        addition_entity: licenseHasProduct['addition_entity'],
                        pricing_id: licenseHasProduct['pricing_id'],
                        billing_cycle: licenseHasProduct['billing_cycle'],
                        expiry_date: licenseHasProduct['expiry_date'],
                        status: licenseHasProduct['status'],
                        created_by: Meteor.userId(),
                        updated_by: Meteor.userId(),
                    };

                    _licenseData.has_product.push(licenseHasProductData);
                }
            });

            await license.addData(_licenseData).save();
            await UserLicense.attach(user, license, User.LICENSE_PERMISSION_OWNER, []);
        } else {
            license.setData('status', licenseData['status'],);

            const licenseHasProducts = license.getProducts();
            _.forEach(hasProduct, (_d) => {
                const licenseHasProduct = _.find(licenseHasProducts, (lhp) => lhp['product_id'] === _d['product_id']);
                if (licenseHasProduct) {
                    Object.assign(licenseHasProduct, {
                        base_url: _d['base_url'],
                        plan_id: licenseHasProduct['plan_id'],
                        addition_entity: _d['addition_entity'],
                        pricing_id: _d['pricing_id'],
                        product_version: _d['product_version'],
                        billing_cycle: _d['billing_cycle'],
                        expiry_date: moment(_d['expiry_date']).toDate(),
                        status: _d['status'],
                        updated_by: Meteor.userId(),
                        has_user: _.isArray(licenseHasProduct['has_user']) ? licenseHasProduct['has_user'] : [],
                        created_by: !!licenseHasProduct['created_by'] ? licenseHasProduct['created_by'] : Meteor.userId(),
                    });
                } else if (_d['checked'] === true) {
                    let data: LicenseHasProductInterface = {
                        base_url: _d['base_url'],
                        plan_id: null,
                        has_user: [],
                        purchase_date: DateTimeHelper.getCurrentDate(),
                        product_id: _d['product_id'],
                        product_version: _d['product_version'],
                        addition_entity: _d['addition_entity'],
                        pricing_id: _d['pricing_id'],
                        billing_cycle: _d['billing_cycle'],
                        expiry_date: moment(_d['expiry_date']).toDate(),
                        status: _d['status'],
                        created_by: Meteor.userId(),
                        updated_by: Meteor.userId()
                    };

                    licenseHasProducts.push(data);
                }
            });

            await license.setData('has_product', licenseHasProducts).save().then(() => {
                StoneEventManager.dispatch("admin_mannualy_change_license", {license});
            });
        }
    }

    getProductLicenseBillingCycleData(): SelectOptionsInterface[] {
        let options: SelectOptionsInterface[] = [];

        _.forEach(ProductLicenseBillingCycle, (c) => {
            switch (c) {
                case ProductLicenseBillingCycle.MONTHLY:
                    options.push({
                        value: c,
                        name: 'Monthly'
                    });
                    break;
                case ProductLicenseBillingCycle.ANNUALLY:
                    options.push({
                        value: c,
                        name: 'Annually'
                    });
                    break;
            }
        });

        return options;
    }
}