import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {PricingCollection} from "../collections/prices";
import {StoneLogger} from "../../../code/core/logger/logger";
import {OM} from "../../../code/Framework/ObjectManager";
import {Price} from "../models/price";
import {PriceTypesCollection} from "../collections/price-types";
import {PriceType} from "../models/price-type";
import * as _ from 'lodash';
import {PriceEntityType} from "../api/price-interface";

export class Pricing implements ProviderInterface {
    boot() {
        this.initDefaultPricingType();
        this.initDefaultPricing();
    }
    
    protected initDefaultPricingType(): void {
        if (PriceTypesCollection.collection.find().count() === 0) {
            const defaultPricingType = [
                {
                    "name": "trial",
                    "label": "Trial"
                },
                {
                    "name": "subscription",
                    "label": "Subscription"
                },
                {
                    "name": "life_time",
                    "label": "Life time"
                }
            ];
            
            _.forEach(defaultPricingType, (_p) => {
                let pricingType = OM.create<PriceType>(PriceType);
                pricingType.addData(_p)
                           .save();
            });
        }
    }
    
    protected initDefaultPricing(): void {
        if (PricingCollection.collection.find().count() === 0) {
            StoneLogger.info("Init default pricing for C-POS");
            let defaultPricing = [
                {
                    "type": "subscription",
                    "code": "cpos_premium",
                    "display_name": "ConnectPos Premium",
                    "entity_type": PriceEntityType.REGISTER,
                    "free_entity": 3,
                    "cost_monthly": "30",
                    "cost_annually": "300",
                    "description": "ConnectPos Premium"
                },
                {
                    "type": "subscription",
                    "code": "cpos_standard",
                    "display_name": "ConnectPos Standard",
                    "entity_type": PriceEntityType.REGISTER,
                    "free_entity": 3,
                    "cost_monthly": "30",
                    "cost_annually": "300",
                    "description": "ConnectPos Standard"
                },
                {
                    "type": "trial",
                    "code": "cpos_trial",
                    "display_name": "ConnectPOS Trial",
                    "entity_type": PriceEntityType.REGISTER,
                    "free_entity": 3,
                    "trial_day": 30,
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