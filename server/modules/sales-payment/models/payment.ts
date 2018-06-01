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
import {InvoiceType} from "../../sales/api/invoice-interface";

export class Payment extends DataObject {
    protected entity: Plan | AdditionFee;
    protected pricing: Price;
    protected user: User;
    protected license: License;
    protected licenseProduct: LicenseHasProductInterface;
    protected totals;
    async pay(entity: Plan|AdditionFee, gatewayAdditionData: PaymentGatewayDataInterface, typePay): Promise<any> {
            this.entity = entity;
    
            let invoice      = OM.create<Invoice>(Invoice);
            const planHelper = OM.create<PlanHelper>(PlanHelper);
            const additionFeeHelper = OM.create<AdditionFeeHelper>(AdditionFeeHelper);
            if (typePay === InvoiceType.TYPE_PLAN) {
                this.totals     = planHelper.getCheckoutData((entity as Plan));
            } else if (typePay === InvoiceType.TYPE_ADDITIONFEE) {
                this.totals     = additionFeeHelper.getCheckoutData((entity as AdditionFee));
            }
        if (this.totals.total === 0) {
                return invoice.createInvoice(entity, {}, this.totals, typePay);
            } else {
                if(typePay === InvoiceType.TYPE_PLAN) {
                    this.validatePlanPay(entity as Plan);
                }
                const paymentId = gatewayAdditionData.id;
        
                let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');
        
                const payment = paymentManager.getPayment(paymentId);
        
                if (!payment) {
                    throw new Meteor.Error("Error", 'can_not_find_payment_when_pay');
                }
                const result: PayResultInterface = await this.processPay(entity, payment['data'], gatewayAdditionData, this.totals.total, typePay);
                switch (result.type) {
                    case PayResultType.PAY_SUCCESS:
                        return invoice.createInvoice(entity, result.data, this.totals, typePay);
                    case PayResultType.PAY_FAIL:
                        throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
                    case PayResultType.PAY_ERROR:
                        throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
                    default:
                        throw new Meteor.Error("payment_pay", 'wrong_format_result');
                }
            }
    }

    protected async processPay(entity: Plan|AdditionFee, payment: PaymentData, gatewayAdditionData: PaymentGatewayDataInterface, grandTotal, typePay): Promise<PayResultInterface> {
            let pricing;
            if(typePay === InvoiceType.TYPE_PLAN) {
                pricing = this.getPricing();
            }
            if ((typePay === InvoiceType.TYPE_PLAN && pricing.getPriceType() === Price.TYPE_SUBSCRIPTION) || typePay === InvoiceType.TYPE_ADDITIONFEE) {
                if (!payment.sale) {
                    throw new Meteor.Error('payment_pay', 'payment_not_support_sale_transaction');
                }
        
                return payment.sale.place({
                                              pricing: pricing,
                                              transactionType: typePay === InvoiceType.TYPE_PLAN ? Price.TYPE_SUBSCRIPTION : '',
                                              transactionData: {
                                                  entityId: entity.getId(),
                                                  price: entity.getData('price'),
                                                  grandTotal,
                                              },
                                              gatewayAdditionData
                                          });
            } else if ( typePay === InvoiceType.TYPE_PLAN && pricing.getPriceType() === Price.TYPE_LIFETIME) {
                throw new Meteor.Error("payment_pay", 'not_yet_support_life_time_sale');
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
            this.pricing.loadById((this.entity as Plan).getPricingId());

            if (!this.pricing.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_price");
            }
        }

        return this.pricing;
    }

    protected getUser(): User {
        if (typeof this.user === 'undefined') {
            this.user = OM.create<User>(User);
            this.user.loadById(this.entity.getUserId());

            if (!this.user.getId()) {
                throw new Meteor.Error("payment_pay", "can_not_find_user");
            }
        }

        return this.user;
    }
}