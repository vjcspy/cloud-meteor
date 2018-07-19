import {OM} from "../../../../code/Framework/ObjectManager";
import {License} from "../../../retail/models/license";
import * as moment from "moment";
import {Payment} from "../../../sales-payment/models/payment";
import {Plan} from "../../models/plan";
import {PaymentGatewayDataInterface} from "../../../sales-payment/models/payment/payment-gateway-data-interface";

new ValidatedMethod({
                        name: "sales.extend_plan",
                        validate: function () {
                        },
                        run: function (data: Object) {
                            let payment                       = OM.create <Payment>(Payment);
                            let braintree: PaymentGatewayDataInterface = {id: 'braintree'};
                            const license_id = data['license_id'];
                            const product_id = data['product_id'];

                            const license = OM.create<License>(License).loadById(license_id);
                            const userId = license.getData('shop_owner_id');
                            let licenseHasProduct = license.getProductLicense(product_id);
                           if (!licenseHasProduct) {
                               return;
                           } else {
                               const now = moment().toDate();
                               if (licenseHasProduct['expiry_date'] > now) {
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
                    });
