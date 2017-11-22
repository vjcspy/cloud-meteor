import {Plan} from "../../sales/models/plan";
import {Stone} from "../../../code/core/stone";
import {PaymentData, SalesPaymentManager} from "../repositories/sales-payment-manager";
import {OM} from "../../../code/Framework/ObjectManager";
import {Price} from "../../retail/models/price";
import {PayResultInterface, PayResultType} from "./payment/pay-result-interface";
import {Invoice} from "../../sales/models/invoice";
import {PaymentGatewayDataInterface} from "./payment/payment-gateway-data-interface";

export class Payment {
    async pay(plan: Plan, gatewayAdditionData: PaymentGatewayDataInterface): Promise<any> {
        let invoice = OM.create<Invoice>(Invoice);
        if (plan.getGrandtotal() === 0) {
            return invoice.createInvoice(plan, {});
        } else {
            const paymentId = gatewayAdditionData.id;
            
            let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');
            
            const payment = paymentManager.getPayment(paymentId);
            
            if (!payment) {
                throw new Meteor.Error("Error", 'can_not_find_payment_when_pay_plan');
            }
            
            const result: PayResultInterface = await this.processPay(plan, payment['data'], gatewayAdditionData);
            
            switch (result.type) {
                case PayResultType.PAY_SUCCESS:
                    return invoice.createInvoice(plan, result.data);
                case PayResultType.PAY_FAIL:
                    throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
                case PayResultType.PAY_ERROR:
                    throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
                default:
                    throw new Meteor.Error("payment_pay", 'wrong_format_result');
            }
        }
    }
    
    protected processPay(plan: Plan, payment: PaymentData, gatewayAdditionData: PaymentGatewayDataInterface): Promise<PayResultInterface> {
        let pricing = OM.create<Price>(Price);
        pricing.loadById(plan.getPricingId());
        
        if (!pricing.getId()) {
            throw new Meteor.Error("payment_pay", "can_not_find_price");
        }
        
        if (pricing.getPriceType() === 'subscription') {
            if (!payment.subscription) {
                throw new Meteor.Error('payment_pay', 'payment_not_support_subscription');
            }
            
            return payment.subscription.place({
                                                  pricing: pricing.getData(),
                                                  transactionType: 'subscription',
                                                  transactionData: {
                                                      price: plan.getPrice(),
                                                      discountAmount: plan.getDiscountAmount()
                                                  },
                                                  gatewayAdditionData
                                              });
        } else if (pricing.getPriceType() === 'lifetime') {
        
        }
        
        throw new Meteor.Error("payment_pay", 'some_thing_went_wrong');
    }
}