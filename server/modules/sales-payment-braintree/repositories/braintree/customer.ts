import {BraintreeGateway} from "../../etc/braintree.config";
import {User} from "../../../account/models/user";

export class Customer {
    createCustomer(user: User) {
        return new Promise((resolve, reject) => {
            BraintreeGateway.customer.create({
                                                 id: user.getId(),
                                                 firstName: user.getFirsName(),
                                                 lastName: user.getLastName(),
                                                 email: user.getEmail(),
                                             }, (err, result) => {
                if (!err && result.success) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    
    getCustomer(user: User | string) {
        return new Promise((res, rej) => {
            let userId;
            if (typeof user === 'string') {
                userId = user;
            } else {
                userId = user.getId();
            }
            BraintreeGateway.customer.find(userId, function (err, customer) {
                if (err) {
                    if (err['type'] === 'notFoundError') {
                        return res(null);
                    } else {
                        rej(err);
                    }
                }
                else {
                    return res(customer);
                }
            });
        });
    }
    
    protected generateClientToken(user: User | string) {
        return new Promise((res, rej) => {
            let userId;
            if (typeof user === 'string') {
                userId = user;
            } else {
                userId = user.getId();
            }
            BraintreeGateway.clientToken.generate({customerId: userId}, (err, response) => {
                if (err) {
                    return rej(err);
                }
                if (!response.clientToken) {
                    throw new Meteor.Error("can_get_client_token");
                } else {
                    return res(response.clientToken);
                }
            });
        });
    }
    
    getClientToken(user: User) {
        return new Promise((res, rej) => {
            this.getCustomer(user)
                .then((customer) => {
                    if (!customer) {
                        this.createCustomer(user)
                            .then(() =>
                                      this.generateClientToken(user)
                                          .then((token) => res(token)),
                                  (_err) => rej(_err));
                    } else {
                        this.generateClientToken(user)
                            .then((token) => res(token),
                                  (_err) => rej(_err));
                    }
                })
        });
    }
}