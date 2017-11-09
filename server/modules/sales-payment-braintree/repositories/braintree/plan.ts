import {BraintreeGateway} from "../../etc/braintree.config";

export class Plan {
    getPlan() {
        return new Promise((resolve, reject) => {
            BraintreeGateway.Plan.all((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}