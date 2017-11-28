import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {UserHasLicense} from "../api/user-interface";
import {Role} from "./role";
import * as _ from 'lodash';

export class User extends AbstractModel {
    protected $collection = "users";
    
    static LICENSE_PERMISSION_SALES   = 'sales';
    static LICENSE_PERMISSION_AGENCY  = 'agency';
    static LICENSE_PERMISSION_OWNER   = 'owner';
    static LICENSE_PERMISSION_CASHIER = 'cashier';
    
    static DEFAULT_PASSWORD_USER = 'smartosc123';
    
    static STATUS_ACTIVE   = 1;
    static STATUS_DEACTIVE = 0;
    
    getUsername(): string {
        return this.getData('username');
    }
    
    addToRoles(roles: string | string[], group = Role.GROUP_CLOUD): User {
        Roles.addUsersToRoles(this.getData(), roles, group);
        this.loadById(this.getId());
    
        return this;
    }
    
    setRoles(roles: string | string[], group = Role.GROUP_CLOUD): User {
        Roles.setUserRoles(this.getData(), roles, group);
        this.loadById(this.getId());
        
        return this;
    }
    
    isInRoles(roles: string | string[], group = Role.GROUP_CLOUD): boolean {
        return Roles.userIsInRole(this.getData(), roles, group);
    }
    
    getLicenses(): UserHasLicense[] {
        return this.getData('has_license') ? this.getData('has_license') : [];
    }
    
    hasLicense(): boolean {
        return _.size(this.getLicenses()) === 1;
    }
    
    getRoles(group = Role.GROUP_CLOUD): string[] {
        return Roles.getRolesForUser(this.getData(), group);
    }
    
    isShopOwner(): boolean {
        return this.isInRoles(Role.USER) && _.size(this.getLicenses()) == 1 && this.getLicenses()[0].license_permission == User.LICENSE_PERMISSION_OWNER;
    }
    
    isDisabled(): boolean {
        return this.getData("is_disabled") === true;
    }
    
    getProfile(): Object {
        return this.getData('profile');
    }
    
    getFirsName() {
        const profile = this.getProfile();
        
        return profile && profile.hasOwnProperty('first_name') ? profile['first_name'] : null;
    }
    
    getLastName() {
        const profile = this.getProfile();
        
        return profile && profile.hasOwnProperty('last_name') ? profile['last_name'] : null;
    }
    
    getEmail(): string {
        return this.getData('emails')[0]['address'];
    }
}

