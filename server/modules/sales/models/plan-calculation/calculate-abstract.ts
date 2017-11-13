import {ProductLicenseBillingCycle} from "../../../retail/api/license-interface";
import {SalesTotal} from "../sales-total";

export abstract class CalculateAbstract {
    abstract total: string;
    
    protected _totals: SalesTotal;
    private _userId: string;
    
    setTotals(totals: SalesTotal) {
        this._totals = totals;
        
        return this;
    }
    
    getTotals(): SalesTotal {
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
        
        return this;
    }
}