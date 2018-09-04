import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {UserHasLicense} from "../api/user-interface";
import {USER_EMAIL_TEMPLATE} from "../api/email-interface";
import {EmailModel} from "./email";
import {EmailCollection} from "../collections/email";
import {Role} from "./role";
import * as _ from 'lodash';
import {ExtendEmailTemplate} from "../configs/email/email-config";
import {OM} from "../../../code/Framework/ObjectManager";
import moment = require("moment");
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

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
    getDiff(data) {
        const created_at  = moment(data['created_at'],'YYYY-MM-DD');
        const currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
        return currentTime.diff(created_at, 'days');
    }
    saveEmailCollection(data,type) {
        const emailModel = OM.create<EmailModel>(EmailModel);
        emailModel.saveEmail(data,type).then(()=>{}, (e)=>{console.log(e)});
    }

    sendData(data,type:USER_EMAIL_TEMPLATE){
        const emailCollection = EmailCollection.find({email: data['email'], type: type, product_id: data['product_id']}).fetch();
        switch (type){
            case USER_EMAIL_TEMPLATE.REQUEST_TRIAL:{
                Email.send(ExtendEmailTemplate.request_trial(data));
                this.saveEmailCollection(data,type);
                break;
            }
            case USER_EMAIL_TEMPLATE.EXPIRED:{
                if (emailCollection.length == 0){
                    Email.send(ExtendEmailTemplate.expired(data));
                    this.saveEmailCollection(data,type);
                } else {
                    const lastEmail     = emailCollection[emailCollection.length-1];
                        if (this.getDiff(lastEmail) > 29) {
                            Email.send(ExtendEmailTemplate.expired(data));
                            this.saveEmailCollection(data,type);
                        }
                }
                break;
            }
            case USER_EMAIL_TEMPLATE.TRIAL_EXPIRED: {
                if (emailCollection.length == 0){
                    Email.send(ExtendEmailTemplate.trial_expired(data));
                    this.saveEmailCollection(data,type);
                } else {
                    const lastEmail     = emailCollection[emailCollection.length-1];
                        if (this.getDiff(lastEmail) > 29) {
                            Email.send(ExtendEmailTemplate.trial_expired(data));
                            this.saveEmailCollection(data,type);
                        }
                }
                break;
            }
            case USER_EMAIL_TEMPLATE.INVOICE: {
                 Email.send(ExtendEmailTemplate.invoice(data));
                 this.saveEmailCollection(data,type);
                break;
            }
            case USER_EMAIL_TEMPLATE.PENDING_USER: {
                Email.send(ExtendEmailTemplate.pendingUser(data));
                this.saveEmailCollection(data,type);
                break;
            }
            case USER_EMAIL_TEMPLATE.REJECT_USER: {
                Email.send(ExtendEmailTemplate.rejectUser(data));
                this.saveEmailCollection(data,type);
                break;
            }
            case USER_EMAIL_TEMPLATE.LIST_EXPIRED: {
                Email.send(ExtendEmailTemplate.listExp(data));
                this.saveEmailCollection(data,type);
                break;
            }
            default: {
                break;
            }
        }

    }

}

