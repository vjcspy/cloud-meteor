import * as _ from "lodash";
import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import {License} from "./license";

export class UserLicense {
    /**
     * Attach License vào user, có thể dùng cho sales, agency, user(shop owner or cashier)
     */
    static attach(user: User, license: License, userHasLicensePermission: string, products: string[] = []): Promise<any> {
        if (!user.getId() || !license.getId()) {
            throw new Meteor.Error("Error", "required data missing");
        }
        if (user.isInRoles(Role.USER)) {
            let isAttachNewUser = true;
            
            // Nếu user đã tồn tại license và license đó không phải là cái hiện tại thì báo lỗi
            if (_.size(user.getLicenses()) > 0) {
                isAttachNewUser = false;
                if (user.getLicenses()[0].license_id != license.getId()) {
                    throw new Meteor.Error("Error", "User already has license");
                }
            }
            
            if (_.indexOf([User.LICENSE_PERMISSION_OWNER, User.LICENSE_PERMISSION_CASHIER], userHasLicensePermission) < 0) {
                throw new Meteor.Error("Error", "permission_must_be_shop_owner_or_cashier");
            }
            
            if (isAttachNewUser) {
                user.setData('has_license',
                             [
                                 {
                                     license_id: license.getId(),
                                     license_permission: userHasLicensePermission,
                                     license_increment: license.getCurrentCashierIncrement() + 1
                                 }
                             ]);
            }
            
            if (userHasLicensePermission == User.LICENSE_PERMISSION_OWNER) {
                if (license.getData('shop_owner_id') && license.getData('shop_owner_id') != user.getId()) {
                    throw new Meteor.Error("Error", "This license already has shop owner");
                }
                
                license.setData("shop_owner_id", user.getId())
                       .setData("shop_owner_username", user.getUsername())
            } else if (userHasLicensePermission == User.LICENSE_PERMISSION_CASHIER) {
                if (_.size(products) == 0) {
                    throw new Meteor.Error("Error", "must_attach_cashier_at_least_one_product");
                }
                let licenseHasProduct = license.getProducts();
                // ensure remove user from all product before add.
                licenseHasProduct     = _.map(license.getProducts(), (_p) => {
                    if (_.isArray(_p.has_user)) {
                        let has_user   = _.reject(_p.has_user, (_u) => {
                            return _u['username'] == user.getData('username');
                        });
                        _p['has_user'] = has_user;
                    }
                    return _p;
                });
                
                _.forEach(products, productId => {
                    let _pInLicense = _.find(licenseHasProduct, pInLicense => pInLicense.product_id == productId);
                    if (!_pInLicense)
                        throw new Meteor.Error("Error", "License has not purchased product");
                    if (!_.isArray(_pInLicense.has_user)) {
                        _pInLicense.has_user = [];
                    }
                    if (!_.find(_pInLicense.has_user, _u => _u.user_id === user.getId())) {
                        _pInLicense.has_user.push({user_id: user.getId(), username: user.getData('username')});
                    }
                });
                
                license.setData('has_product', licenseHasProduct);
            }
            
            if (isAttachNewUser) {
                license.setData('current_cashier_increment', license.getCurrentCashierIncrement() + 1);
            }
            
            return Promise.all([user.save(), license.save()]);
        } else if (user.isInRoles([Role.SALES, Role.AGENCY])) {
            if (_.indexOf([User.LICENSE_PERMISSION_AGENCY, User.LICENSE_PERMISSION_SALES], userHasLicensePermission) < 0)
                throw new Meteor.Error("Error", "some_thing_went_wrong_went_attach_license_to_user");
            
            let _license = _.find(user.getLicenses(), l => l['_id'] == license.getId());
            if (!_license) {
                user.setData('has_license',
                             [
                                 {
                                     license_id: license.getId(),
                                     license_permission: userHasLicensePermission
                                 }
                             ]);
            }
            return user.save();
        }
    }
}
