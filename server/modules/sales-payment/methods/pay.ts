import {OM} from "../../../code/Framework/ObjectManager";
import {Payment} from "../models/payment";
import {Plan} from "../../sales/models/plan";
import {AdditionFee} from "../../retail/models/additionfee";
import {InvoiceType} from "../../sales/api/invoice-interface";

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
        if(typePay === InvoiceType.TYPE_PLAN) {
            entity = OM.create<Plan>(Plan).loadById(entityId);
        } else if (typePay === InvoiceType.TYPE_ADDITIONFEE) {
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
    name: "sales-payment.pay",
}, 3, 1000);