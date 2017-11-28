import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Plan} from "../models/plan";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../../account/models/user";
import {Role} from "../../account/models/role";
import * as _ from 'lodash';
import {LicenseHelper} from "../../retail/helper/license";
import {StoneLogger} from "../../../code/core/logger/logger";

/**
 * Handle after created invoice to change plan
 */
export class HandleCreateInvoice implements ObserverInterface {
    async observe(dataObject: DataObject) {
        const data       = dataObject.getData('data');
        const plan: Plan = data['plan'];
        const userId     = plan.getUserId();
        
        let user = OM.create<User>(User);
        user.loadById(userId);
        
        try {
            if (!user.getId()) {
                throw new Meteor.Error('Error', 'can_not_found_user_when_upgrade_plan');
            }
            
            if (user.isInRoles([Role.AGENCY], Role.GROUP_CLOUD)) {
                throw new Meteor.Error("Error", 'not_yet_support_agency_buy_license');
            } else if (user.isInRoles([Role.USER], Role.GROUP_CLOUD)) {
                if (_.size(user.getLicenses()) > 0) {
                
                } else {
                    let licenseHelper = OM.create<LicenseHelper>(LicenseHelper);
                    await licenseHelper.createLicense(plan);
                }
            } else {
                throw new Meteor.Error("Error", 'some_thing_went_wrong_when_upgrade_plan');
            }
        }
        catch (e) {
            StoneLogger.error("We can not upgrade plan for user, please check", {plan, e})
        }
    }
}