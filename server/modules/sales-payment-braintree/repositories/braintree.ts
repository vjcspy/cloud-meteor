import {Plan} from "./braintree/plan";
import {Customer} from "./braintree/customer";

export class Braintree {
    protected _customerObject;
    protected _planObject;
    
    getCustomerObject(): Customer {
        if (typeof this._customerObject === 'undefined') {
            this._customerObject = new Customer();
        }
        
        return this._customerObject;
    }
    
    getPlanObject(): Plan {
        if (typeof this._planObject === 'undefined') {
            this._planObject = new Plan();
        }
        
        return this._planObject;
    }
}