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
    
    getCode(): string {
        return this.getData('code');
    }
    
    getCostMonthly(): number {
        return parseFloat(this.getData('cost_monthly'));
    }
    
    getCostAnnually(): number {
        return parseFloat(this.getData('cost_annually'));
    }
    
    isSubscriptionType() {
        return this.getPriceType() === Price.TYPE_SUBSCRIPTION;
    }
    
    isLifetime() {
        return this.getPriceType() === Price.TYPE_LIFETIME;
    }
    
    isTrial() {
        return this.getPriceType() === Price.TYPE_TRIAL;
    }
}
