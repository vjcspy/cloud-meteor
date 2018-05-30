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
import {async} from "rxjs/scheduler/async";
import {UserCredit} from "../../user-credit/models/user-credit";
import {UserCreditTransaction} from "../../user-credit/models/user-credit-transaction";
import {
    CreditTransactionReason,
    UserCreditTransactionInterface
} from "../../user-credit/api/user-credit-transaction-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {PlanHelper} from "../../sales/helper/plan-helper";
import {AdditionFee} from "../../retail/models/additionfee";
import {AdditionFeeHelper} from "../../retail/helper/addition-fee-helper";

export class Payment extends DataObject {
    protected plan: Plan;
    protected additionFee: AdditionFee;
    protected pricing: Price;
    protected user: User;
    protected license: License;
    protected licenseProduct: LicenseHasProductInterface;

    async pay(plan: Plan, additionFee: AdditionFee, gatewayAdditionData: PaymentGatewayDataInterface): Promise<any> {
        if(plan) {
            this.plan = plan;
    
            let invoice      = OM.create<Invoice>(Invoice);
            const planHelper = OM.create<PlanHelper>(PlanHelper);
            const totals     = planHelper.getPlanCheckoutData(plan);
    
            if (totals.total === 0) {
                return invoice.createInvoice(plan, null, {}, totals);
            } else {
                this.validatePlanPay(this.plan);
        
                const paymentId = gatewayAdditionData.id;
        
                let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');
        
                const payment = paymentManager.getPayment(paymentId);
        
                if (!payment) {
                    throw new Meteor.Error("Error", 'can_not_find_payment_when_pay_plan');
                }
        
                const result: PayResultInterface = await this.processPay(plan, null, payment['data'], gatewayAdditionData, totals.total);
                switch (result.type) {
                    case PayResultType.PAY_SUCCESS:
                        return invoice.createInvoice(plan, null, result.data, totals);
                    case PayResultType.PAY_FAIL:
                        throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
                    case PayResultType.PAY_ERROR:
                        throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
                    default:
                        throw new Meteor.Error("payment_pay", 'wrong_format_result');
                }
            }
        } else if (additionFee) {
            this.additionFee = additionFee;
    
            let invoice      = OM.create<Invoice>(Invoice);
            const additionFeeHelper = OM.create<AdditionFeeHelper>(AdditionFeeHelper);
            const totals     = additionFeeHelper.getAdditionFeeCheckoutData(additionFee);
    
            if (totals.total === 0) {
                return invoice.createInvoice(null, additionFee, {}, totals);
            } else {
        
                const paymentId = gatewayAdditionData.id;
        
                let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');
        
                const payment = paymentManager.getPayment(paymentId);
        
                if (!payment) {
                    throw new Meteor.Error("Error", 'can_not_find_payment_when_pay_addition_fee');
                }
        
                const result: PayResultInterface = await this.processPay(null, additionFee, payment['data'], gatewayAdditionData, totals.total);
                switch (result.type) {
                    case PayResultType.PAY_SUCCESS:
                        return invoice.createInvoice(null, additionFee, result.data, totals);
                    case PayResultType.PAY_FAIL:
                        throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
                    case PayResultType.PAY_ERROR:
                        throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
                    default:
                        throw new Meteor.Error("payment_pay", 'wrong_format_result');
                }
            }
        }

        
    }

    protected async processPay(plan: Plan, additionFee:AdditionFee, payment: PaymentData, gatewayAdditionData: PaymentGatewayDataInterface, grandTotal): Promise<PayResultInterface> {
        if(plan) {
            let pricing = this.getPricing();
    
            if (pricing.getPriceType() === Price.TYPE_SUBSCRIPTION) {
                if (!payment.sale) {
                    throw new Meteor.Error('payment_pay', 'payment_not_support_sale_transaction');
                }
        
                return payment.sale.place({
                                              pricing: pricing,
                                              transactionType: Price.TYPE_SUBSCRIPTION,
                                              transactionData: {
                                                  entityId: plan.getId(),
                                                  price: plan.getPrice(),
                                                  grandTotal,
                                              },
                                              gatewayAdditionData
                                          });
            } else if (pricing.getPriceType() === Price.TYPE_LIFETIME) {
                throw new Meteor.Error("payment_pay", 'not_yet_support_life_time_sale');
            }
        } else if (additionFee) {
            if (!payment.sale) {
                throw new Meteor.Error('payment_pay', 'payment_not_support_sale_transaction');
            }
    
            return payment.sale.place({
                                          transactionData: {
                                              entityId: additionFee.getId(),
                                              grandTotal,
                                          },
                                          gatewayAdditionData
                                      });
        }

        throw new Meteor.Error("payment_pay", 'some_thing_went_wrong');
    }

    protected validatePlanPay(plan: Plan): boolean {
        const pricing  = this.getPricing();
        const user     = this.getUser();
        const $license = Stone.getInstance().s('$license') as LicenseHelper;
        const license  = $license.getLicenseOfUser(user);

        if (!!license) {
            const licenseProduct = _.find(license['has_product']);
        }

        if (pricing.isSubscriptionType()) {

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