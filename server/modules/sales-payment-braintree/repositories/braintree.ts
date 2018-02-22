import {Plan} from "./braintree/plan";
import {Customer} from "./braintree/customer";
import {OM} from "../../../code/Framework/ObjectManager";
import {Subscription} from "./braintree/subscription";
import {Sale} from "./braintree/sale";

export class Braintree {
    protected _customerObject;
    protected _planObject;
    protected _subscription;
    protected _sale: Sale;

    getCustomerObject(): Customer {
        if (typeof this._customerObject === 'undefined') {
            this._customerObject = OM.create<Customer>(Customer);
        }

        return this._customerObject;
    }

    getPlanObject(): Plan {
        if (typeof this._planObject === 'undefined') {
            this._planObject = OM.create<Plan>(Plan);
        }

        return this._planObject;
    }

    getSubscription(): Subscription {
        if (typeof this._subscription === 'undefined') {
            this._subscription = OM.create<Subscription>(Subscription);
        }

        return this._subscription;
    }

    getSale(): Sale {
        if (typeof this._sale === 'undefined') {
            this._sale = OM.create<Sale>(Sale);
        }

        return this._sale;
    }
}