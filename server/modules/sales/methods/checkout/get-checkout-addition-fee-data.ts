import {Stone} from "../../../../code/core/stone";
import {SalesPaymentManager} from "../../../sales-payment/repositories/sales-payment-manager";
import {OM} from "../../../../code/Framework/ObjectManager";
import {AdditionFee} from "../../../retail/models/additionfee";
import {UserCredit} from "../../../user-credit/models/user-credit";
import {AdditionFeeHelper} from "../../../retail/helper/addition-fee-helper";

new ValidatedMethod({
                        name: "sales.get_addition_fee_checkout_data",
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const {additionFeeId} = data;
        
                            let salePaymentManager = <SalesPaymentManager>Stone.getInstance().s('sales-payment-manager');
                            const payments         = salePaymentManager.getPayments();
        
                            let totals;
                            let additionFee = OM.create<AdditionFee>(AdditionFee);
                            additionFee.loadById(additionFeeId);
        
                            if (additionFee.getId()) {
                                const additionFeeHelper = OM.create<AdditionFeeHelper>(AdditionFeeHelper);
                                if (!additionFee.canInvoice()) {
                                    throw new Meteor.Error("Error", "can_not_create_invoice_for_addition_fee");
                                }
            
                                totals = {
                                    total: additionFeeHelper.getAdditionFeeCheckoutData(additionFee)
                                };
                            } else {
                                throw new Meteor.Error("can_find_addition_fee");
                            }
        
                            return {payments, totals};
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.get_addition_fee_checkout_data",
                       }, 3, 1000);