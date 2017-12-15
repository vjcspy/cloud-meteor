import * as _ from "lodash";
import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {LicenseHasProductInterface, LicenseHasRoleInterface} from "../api/license-interface";

export class License extends AbstractModel {
    protected $collection = "licenses";
    
    static STATUS_BASE_URL_ACTIVE   = 1;
    static STATUS_BASE_URL_INACTIVE = 0;
    
    /*
     * License nếu được tự động generate hoặc do admin thì sẽ ở trạng thái STATUS_FRESH.
     * Khi user tự subscribe thì sẽ ở trạng thái STATUS_ACTIVATED
     * Admin muốn ngừng quyền sử dụng của 1 license thì chuyển về STATUS_DEACTIVATED
     */
    static STATUS_ACTIVATED   = 1;
    static STATUS_DEACTIVATED = 0;
    static STATUS_FRESH       = 2;
    
    getProducts(): LicenseHasProductInterface[] {
        return this.getData("has_product") ? this.getData("has_product") : [];
    }
    
    /*
     * Retrieve all user id belong to license
     */
    getUserIds(): string[] {
        let _users = [];
        _.forEach(this.getProducts(), p => {
            if (!p.has_user || !_.isArray(p.has_user))
                p.has_user = [];
            _users = _.concat(_users, _.map(p.has_user, 'user_id'));
        });
        return _users;
    }
    
    getRoles(): LicenseHasRoleInterface[] {
        return this.getData('has_roles');
    }
    
    getCurrentCashierIncrement(): number {
        return !!this.getData('current_cashier_increment') ? parseInt(this.getData('current_cashier_increment') + '') : 0;
    }
    
    getStatus(): number {
        return this.getData('status');
    }
    
    save() {
        // validate licenseHasProduct
        const countProduct = _.countBy(this.getProducts(), (p) => p['product_id']);
        _.forEach(countProduct, (c) => {
            if (c > 1) {
                throw new Meteor.Error("license", "duplicate_product_in_license");
            }
        });
        
        return super.save();
    }
    
    protected validateLicense() {
    
    }
}
