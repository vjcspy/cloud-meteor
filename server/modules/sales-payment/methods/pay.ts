import {OM} from "../../../code/Framework/ObjectManager";
import {Payment} from "../models/payment";
import {Plan} from "../../sales/models/plan";
import {PlanHelper} from "../../sales/helper/plan-helper";
import {Invoice} from "../../sales/models/invoice";
import {AdditionFee} from "../../retail/models/additionfee";

new ValidatedMethod({
    name: 'sales-payment.pay',
    validate: function () {
        if (!this.userId) {
            throw new Meteor.Error("Error", "Access denied");
        }
    },
    run: function (checkoutData) {
        let payment                       = OM.create <Payment>(Payment);
        const {data, gatewayAdditionData} = checkoutData;
        const {entityId}                    = data;
        const {typePay}                     = data;
        let entity
        if(typePay === 0) {
            entity = OM.create<Plan>(Plan).loadById(entityId);
        } else if (typePay === 1) {
            entity = OM.create<AdditionFee>(AdditionFee).loadById(entityId);
        }
            return payment.pay(entity, gatewayAdditionData, typePay);
    }
});

DDPRateLimiter.addRule({
    userId: function () {
        return true;
    },
    type: "method",
    name: "sales-payment.get_sale_payment",
}, 3, 1000);