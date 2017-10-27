import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import * as _ from 'lodash';

new ValidatedMethod({
                        name: 'sales.order_submit',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const user: User = OM.create<User>(User).loadById(this.userId);
                            const plan       = data['plan'];
                            const product_id = data['product_id'];
        
                            if (_.size(user.getLicenses()) === 0 || user.isShopOwner()) {
            
                            } else {
                                throw new Meteor.Error("Error", "you_are_not_shop_owner");
                            }
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.order_submit",
                       }, 3, 1000);