import {DataObject} from "../../../../code/Framework/DataObject";

export class SalesTotal extends DataObject {
    protected _totals = {};
    
    setTotal(id: string, value: number): SalesTotal {
        if (!this._totals.hasOwnProperty(id)) {
            this._totals[id] = 0;
        }
        this._totals[id] += parseFloat(value + '');
        
        return this;
    }
    
    getTotal(id): number {
        if (!this._totals.hasOwnProperty(id)) {
            this._totals[id] = 0;
        }
        
        return this._totals[id];
    }
    
    getTotals(): Object {
        return this._totals;
    }
}