import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {Coupon} from "../../models/coupon";

new ValidatedMethod({
                        name: "coupon.save",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("pricing.create_pricing_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer = $q.defer();
        
                            let couponModel = OM.create<Coupon>(Coupon);
    
                            couponModel.addData(data['coupon'])
                                        .save()
                                        .then(() => defer.resolve(), (err) => defer.reject(err));
                            return defer.promise;
                        }
                    });