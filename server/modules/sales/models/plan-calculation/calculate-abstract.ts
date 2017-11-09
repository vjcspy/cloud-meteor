import {ProductLicenseBillingCycle} from "../../../retail/api/license-interface";

export abstract class CalculateAbstract {
    abstract total: string;
    
    protected _totals: Object;
    private _userId: string;
    private _credits: Object;
    
    setTotal(amount: number): void {
        if (!this._totals.hasOwnProperty(this.total)) {
            this._totals[this.total] = amount;
        } else {
            this._totals[this.total] += amount;
        }
    }
    
    setTotals(totals: Object): void {
        this._totals = totals;
    }
    
    setCredits(credit: Object): void {
        this._credits = credit;
    }
    
    getTotals(): Object {
        return this._totals;
    }
    
    protected getDayByCycle(cycle: ProductLicenseBillingCycle): number {
        if (cycle === ProductLicenseBillingCycle.ANNUALLY) {
            return 360;
        }
        
        if (cycle === ProductLicenseBillingCycle.MONTHLY) {
            return 30;
        }
        
        throw new Meteor.Error("wrong_data_billing_cycle");
    }
    
    getUserId(): string {
        return this._userId;
    }
    
    setUserId(value: string) {
        this._userId = value;
    }
    
    getCredits(): Object {
        return this._credits;
    }
    
    setCredit(value: number) {
        this._credits[this.total] = value;
    }
}