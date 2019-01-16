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
import {UserCredit} from "../../user-credit/models/user-credit";
import {PlanHelper} from "../../sales/helper/plan-helper";
import {AdditionFee} from "../../retail/models/additionfee";
import {AdditionFeeHelper} from "../../retail/helper/addition-fee-helper";
import {InvoiceType} from "../../sales/api/invoice-interface";
import {RequestPlan} from "../../sales/api/data/request-plan";
import {BraintreeLog} from "../../sales-payment-braintree/models/braintree-log";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {BRAINTREE_ENVIROMENT} from "../../sales-payment-braintree/etc/braintree.config";
import * as listData from "../../../../list-email";
import * as _ from "lodash";
import {USER_EMAIL_TEMPLATE} from "../../account/api/email-interface";

export class Payment extends DataObject {
    protected entity: Plan | AdditionFee;
    protected pricing: Price;
    protected user: User;
    protected license: License;
    protected totals;
    protected isExtend: boolean = false;

    async pay(entity: Plan | AdditionFee, gatewayAdditionData: PaymentGatewayDataInterface, typePay): Promise<any> {
        this.entity = entity;

        const planHelper        = OM.create<PlanHelper>(PlanHelper);
        const additionFeeHelper = OM.create<AdditionFeeHelper>(AdditionFeeHelper);

        if (typePay === InvoiceType.TYPE_PLAN) {
            this.totals = planHelper.getCheckoutData((entity as Plan));
        } else if (typePay === InvoiceType.TYPE_ADDITIONFEE) {
            this.totals = additionFeeHelper.getCheckoutData((entity as AdditionFee));
        }

        return this.processPay(entity, gatewayAdditionData, typePay);
    }

    async extend(entity: Plan, gatewayAdditionData: PaymentGatewayDataInterface, product_id, userId, coupon_id): Promise<any> {
        // re collect totals
        this.isExtend = true;
        this.entity = entity;
        const planHelper        = OM.create<PlanHelper>(PlanHelper);
        const requestPlan: RequestPlan = {
            pricing_id: this.entity.getPricingId(),
            cycle: this.entity.getPricingCycle(),
            num_of_cycle: 1,
            addition_entity: this.entity.getAdditionEntity()
        };
        const {calculator, totals} = planHelper.collectTotal(requestPlan, product_id, userId, coupon_id);
        let credit = 0;
        const userCredit   = OM.create<UserCredit>(UserCredit).load(userId, 'user_id');
        if (userCredit) {
            credit = userCredit.getBalance();
        }
        this.totals = {
            grand_total: totals.total.price,
            credit_balance: credit,
            discount_amount: totals.total.discount_amount,
            credit_spent: totals.total.credit_spent,
            total: totals.total.grand_total
        };
        return this.processPay(this.entity, gatewayAdditionData, InvoiceType.TYPE_PLAN);
    }

    protected async processPay(entity: Plan | AdditionFee, gatewayAdditionData: PaymentGatewayDataInterface, typePay): Promise<any> {
        let invoice = OM.create<Invoice>(Invoice);
        if (this.totals.total === 0) {
            return invoice.createInvoice(entity, {}, this.totals, typePay);
        } else {
            if (typePay === InvoiceType.TYPE_PLAN) {
                this.validatePlanPay(entity as Plan);
            }
            const paymentId = gatewayAdditionData.id;

            let paymentManager: SalesPaymentManager = Stone.getInstance().s('sales-payment-manager');

            const payment = paymentManager.getPayment(paymentId);

            if (!payment) {
                throw new Meteor.Error("Error", 'can_not_find_payment_when_pay');
            }
            const result: PayResultInterface = await this.placePayment(entity, payment['data'], gatewayAdditionData, this.totals.total, typePay);
            switch (result.type) {
                case PayResultType.PAY_SUCCESS:
                    return invoice.createInvoice(entity, result.data, this.totals, typePay);
                case PayResultType.PAY_FAIL: {
                    this.saveLog(result.data);
                    if (result.data.hasOwnProperty('err')
                        && result.data['err'].hasOwnProperty('errorCollections')
                        && result.data['err']['errorCollections'].hasOwnProperty('transaction')
                        && result.data['err']['errorCollections']['transaction'].hasOwnProperty('validationErrors')) {
                        const braintreeLog = OM.create<BraintreeLog>(BraintreeLog);
                        const log = {
                            user_id: entity.getUserId(),
                            entity_id: entity.getId(),
                            type: typePay,
                            transaction_data: JSON.stringify(result.data['err']['errorCollections']['transaction'])
                        };
                        await braintreeLog.addData(log).save();
                        if(this.isExtend) {
                            this.getUser();
                            let emailData = {
                                user_id: this.user.getId()
                            };
                            let listEmails: any[] = [];
                            if(BRAINTREE_ENVIROMENT !== 'SANDBOX') {
                                var fs = require("fs");
                                if(!fs.existsSync('../../list-email.json')) {
                                    const content = {
                                        emails: [],
                                        sendExp: []
                                    };
                                    const data = listData ? listData : content;
                                    fs.writeFileSync("../../list-email.json", JSON.stringify(data));

                                }
                                let emailData = fs.readFileSync('../../list-email.json');
                                let list = JSON.parse(emailData);
                                if (_.isArray(list['emails'])) {
                                    listEmails = list['emails'];
                                }
                            }
                            listEmails = _.concat(listEmails,[this.user.getEmail()]);

                            _.forEach(listEmails, (email) => {
                                emailData['email'] = email;
                                console.log(emailData);
                                this.user.sendData(emailData, USER_EMAIL_TEMPLATE.PAYMENT_ERROR);
                            });
                        }

                        throw new Meteor.Error("payment_pay_fail", "There was a problem processing your credit card; please double check your payment information and try again");
                    }
                }
                case PayResultType.PAY_ERROR:
                    throw new Meteor.Error("payment_pay_error", "There was a problem processing your credit card; please double check your payment information and try again");
                default:
                    throw new Meteor.Error("payment_pay", 'wrong_format_result');
            }
        }
    }

    protected async placePayment(entity: Plan | AdditionFee, payment: PaymentData, gatewayAdditionData: PaymentGatewayDataInterface, grandTotal, typePay): Promise<PayResultInterface> {
        let pricing;
        if (typePay === InvoiceType.TYPE_PLAN) {
            pricing = this.getPricing();
        }
        if ((typePay === InvoiceType.TYPE_PLAN && pricing.getPriceType() === Price.TYPE_SUBSCRIPTION) || typePay === InvoiceType.TYPE_ADDITIONFEE) {
            if (!payment.sale) {
                throw new Meteor.Error('payment_pay', 'payment_not_support_sale_transaction');
            }

            return payment.sale.place({
                pricing: pricing,
                transactionType: typePay === InvoiceType.TYPE_PLAN ? Price.TYPE_SUBSCRIPTION : '',
                customerId: entity.getUserId(),
                transactionData: {
                    entityId: entity.getId(),
                    price: entity.getData('price'),
                    grandTotal,
                },
                gatewayAdditionData
            });

        } else if (typePay === InvoiceType.TYPE_PLAN && pricing.getPriceType() === Price.TYPE_LIFETIME) {
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

    protected saveLog(resultData) {
        var fs = require("fs");
        const today = DateTimeHelper.getCurrentDate().toLocaleDateString();
        fs.stat('./braintree.log', (exists) => {
            if (exists == null) {
                fs.readFile('./braintree.log', function read(err, data) {
                    if (err) {
                        throw err;
                    };
                    let content = JSON.parse(data.toString());
                    let day = _.find(content, (log) => log['date'] === today);
                    if(day) {
                        day['data'].push(resultData);
                    } else {
                        content.push({
                            date: today,
                            data: [resultData]
                        })
                    }
                    fs.writeFile("./braintree.log", JSON.stringify(content), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        };
                    });
                });
                return true;
            } else if (exists.code === 'ENOENT') {
                const content = [{
                    date: today,
                    data: [resultData]
                }];
                fs.writeFile("./braintree.log", JSON.stringify(content), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                });
            }
        });
    }
}