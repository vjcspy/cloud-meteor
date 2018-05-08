import * as $q from "q";
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../../account/models/user";
import {Role} from "../../../account/models/role";
import {AdditionFee} from "../../models/additionfee";


new ValidatedMethod({
                        name: "create_addition_fee",
                        validate: function () {
                            const user = OM.create<User>(User).loadById(this.userId);
                            if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
                            } else {
                                throw new Meteor.Error("pricing.create_pricing_error", "Access denied");
                            }
                        },
                        run: function (data: Object) {
                            let defer = $q.defer();

                            let  additionfeeModel = OM.create<AdditionFee>(AdditionFee);
                            if (!!data['_id']) {
                                additionfeeModel.loadById(data['id']);
                            } else {
                                additionfeeModel.addData(data['additionFee'])
                                    .save()
                                    .then(() => defer.resolve(), (err) => defer.reject(err));
                            }

                            return defer.promise;
                        }
});