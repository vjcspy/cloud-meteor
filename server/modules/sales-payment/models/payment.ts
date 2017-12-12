import {Plan} from "../../sales/models/plan";
import {Stone} from "../../../code/core/stone";
import {PaymentData, SalesPaymentManager} from "../repositories/sales-payment-manager";
import {OM} from "../../../code/Framework/ObjectManager";
import {Price} from "../../retail/models/price";
import {PayResultInterface, PayResultType} from "./payment/pay-result-interface";
import {Invoice} from "../../sales/models/invoice";
import {PaymentGatewayDataInterface} from "./payment/payment-gateway-data-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {LicenseHelper} from "../../retail/helper/license";
import {User} from "../../account/models/user";
import {License} from "../../retail/models/license";
import {LicenseHasProductInterface} from "../../retail/api/license-interface";

export class Payment extends DataObject {
    protected plan: Plan;
    protected pricing: Price;
    protected user: User;
    protected license: License;
    protected licenseProduct: LicenseHasProductInterface;
    
    async pay(plan: Plan, gatewayAdditionData: PaymentGatewayDataInterface): Promise<any> {
        this.plan = plan;
        
        let invoice = OM.create<Invoice>(Invoice);
        if (plan.getGrandtotal() === 0) {
            return invoice.createInvoice(plan, {});
        } else {
            this.validatePlanPay(this.plan);
            
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
        let pricing = this.getPricing();
        
        if (pricing.getPriceType() === 'subscription') {
            if (!payment.subscription) {
                throw new Meteor.Error('payment_pay', 'payment_not_support_subscription');
            }
            
            return payment.subscription.place({
                                                  pricing: pricing,
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
    
    protected validatePlanPay(plan: Plan): boolean {
        const pricing       = this.getPricing();
        const user          = this.getUser();
        const licenseHelper = OM.create<LicenseHelper>(LicenseHelper);
        const license       = licenseHelper.getLicenseOfUser(user);
        
        if (!!license) {
            const licenseProduct = _.find(license['has_product']);
        }
        
        if (pricing.isSubscriptionType()) {
            /*
            * Neu la supscription thi se khong duoc pay vao cung 1 ki
            * */
            
        } else if (pricing.isLifetime()) {
            return false;
        }
        
        return false;
    }
    
    protected getPricing(): Price {
        if (typeof this.pricing === 'undefined') {
            this.pricing = OM.create<Price>(Price);
            this.pricing.loadById(this.plan.getPricingId());
            
            if (!this.pricing.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_price");
            }
        }
        
        return this.pricing;
    }
    
    protected getUser(): User {
        if (typeof this.user === 'undefined') {
            this.user = OM.create<User>(User);
            this.user.loadById(this.plan.getUserId());
            
            if (!this.user.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_user");
            }
        }
        
        return this.user;
    }
}