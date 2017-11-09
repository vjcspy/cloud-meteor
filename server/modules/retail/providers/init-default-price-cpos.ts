import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {PricingCollection} from "../collections/prices";
import {StoneLogger} from "../../../code/core/logger/logger";
import {OM} from "../../../code/Framework/ObjectManager";
import {Price} from "../models/price";

export class InitDefaultPriceCpos implements ProviderInterface {
    boot() {
        // Add default pricing
        if (PricingCollection.collection.find().count() === 0) {
            StoneLogger.info("Init default pricing for C-POS");
            let defaultPricing = [
                {
                    "type": "subscription",
                    "code": "cpos_premium",
                    "display_name": "ConnectPos Premium",
                    "nouser": 3,
                    "cost_monthly": "30",
                    "cost_annually": "300",
                    "cost_adding": "50",
                    "description": "ConnectPos Premium"
                },
                {
                    "type": "subscription",
                    "code": "cpos_standard",
                    "display_name": "ConnectPos Standard",
                    "nouser": 3,
                    "cost_monthly": "25",
                    "cost_annually": "250",
                    "cost_adding": "50",
                    "description": "ConnectPos Standard"
                },
                {
                    "type": "trial",
                    "code": "cpos_trial",
                    "display_name": "ConnectPOS Trial",
                    "nouser": 3,
                    "trialDay": 30,
                    "description": "ConnectPOS Trial"
                }
            ];
            
            _.forEach(defaultPricing, (_p) => {
                let price = OM.create<Price>(Price);
                price.addData(_p)
                     .save();
            });
        }
    }
}