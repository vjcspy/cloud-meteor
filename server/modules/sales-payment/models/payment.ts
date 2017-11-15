import {Plan} from "../../sales/models/plan";
import {Stone} from "../../../code/core/stone";
import {PaymentData, SalesPaymentManager} from "../repositories/sales-payment-manager";
import {OM} from "../../../code/Framework/ObjectManager";
import {Price} from "../../retail/models/price";
import {PayResultInterface, PayResultType} from "./payment/pay-result-interface";
import {Invoice} from "../../sales/models/invoice";

export interface OrderObject {
    plan?: Plan;
}

export interface GatewayAdditionData {
    id: string
}

export class Payment {
    async pay(orderObject: OrderObject, gatewayAdditionData: GatewayAdditionData): Promise<any> {
        const paymentId = gatewayAdditionData.id;
        
        let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');
        
        const payment = paymentManager.getPayment(paymentId);
        if (!payment) {
            throw new Meteor.Error("Error", 'can_not_find_payment');
        }
        
        let result: PayResultInterface;
        
        if (!!orderObject.plan) {
            const plan: Plan = orderObject.plan;
            result           = await this.processPay(plan, payment['data'], gatewayAdditionData);
        }
        
        switch (result.type) {
            case PayResultType.PAY_SUCCESS:
                break;
            case PayResultType.PAY_FAIL:
                throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
            case PayResultType.PAY_ERROR:
                throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
            default:
                throw new Meteor.Error("payment_pay", 'wrong_format_result');
        }
        
        throw new Meteor.Error("payment_pay", 'wrong_data');
    }
    
    protected createInvoice() {
        let invoice = OM.create<Invoice>(Invoice);
    }
    
    protected processPay(plan: Plan, payment: PaymentData, gatewayAdditionData: GatewayAdditionData): Promise<PayResultInterface> {
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