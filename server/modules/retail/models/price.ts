import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class Price extends AbstractModel {
    protected $collection = 'prices';
    
    static TYPE_SUBSCRIPTION = 'subscription';
    static TYPE_TRIAL        = 'trial';
    static TYPE_LIFETIME     = 'lifetime';
    
    getPriceType() {
        return this.getData('type');
    }
    
    getTrialDay(): number {
        if (this.getPriceType() === Price.TYPE_TRIAL) {
            return this.getData('trial_day');
        } else {
            throw new Meteor.Error("Error", "this_pricing_is_not_trial");
        }
    }
}
