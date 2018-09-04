import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../../retail/models/license";
import * as moment from "moment";
import {Payment} from "../../../sales-payment/models/payment";
import {Plan} from "../../models/plan";
import {PaymentGatewayDataInterface} from "../../../sales-payment/models/payment/payment-gateway-data-interface";
import {ProductCollection} from "../../../retail/collections/products";
import {DateTimeHelper} from "../../../../code/Framework/DateTimeHelper";

new ValidatedMethod({
                        name: "sales.extend_plan",
                        validate: function () {
                        },
                        run: function (data: Object) {
                            let payment                       = OM.create <Payment>(Payment);
                            let braintree: PaymentGatewayDataInterface = {id: 'braintree'};
                            const license_id = data['license_id'];
                            let product_id;
                            const posProduct = ProductCollection.findOne({code: 'xpos'});

                            if (data.hasOwnProperty('product_id')) {
                                product_id = data['product_id'];
                            } else {
                                product_id = posProduct['_id'];
                            }

                            const license = OM.create<License>(License).loadById(license_id);
                            if (license) {
                                const userId = license.getData('shop_owner_id');
                                let licenseHasProduct = license.getProductLicense(product_id);
                                if (!licenseHasProduct) {
                                    return;
                                } else {
                                    const now = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
                                    const expiryDate = moment(licenseHasProduct['expiry_date'], 'YYYY-MM-DD');
                                    let diff        = expiryDate.diff(now,'days');
                                    if (diff > 2) {
                                        return;
                                    } else {
                                        const plan = OM.create<Plan>(Plan).loadById(licenseHasProduct['plan_id']);
                                        const coupon_id = plan.getData('coupon_id');

                                        if (plan) {
                                            return payment.extend(plan, braintree, product_id, userId, coupon_id);
                                        }
                                    }
                                }
                            }
                        }
                    });
