import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {RetailConfig} from "../etc/config";
import {ProductCollection} from "../collections/products";
import {OM} from "../../../code/Framework/ObjectManager";
import {Product} from "../models/product";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import {ProductInterface} from "../api/product-interface";
import {PricingCollection} from "../collections/prices";
import * as _ from 'lodash';
import {StoneLogger} from "../../../code/core/logger/logger";

export class ProductProvider implements ProviderInterface {
    boot() {
        if (RetailConfig.dummyData) {
            this.dummyProduct();
        }
    }
    
    protected dummyProduct() {
        // ProductCollection.collection.remove({});
        if (ProductCollection.collection.find({}).count() === 0) {
            StoneLogger.info("Dummy Product C-POS");
            let productData: ProductInterface[] = [
                {
                    "code": "cpos",
                    "name": "Connect-POS",
                    "has_pricing": this.getDummyCPosPricing(),
                    "versions": [
                        {
                            "name": "Beta",
                            "version": "1.0.0",
                            api_compatible: [{version: '1.0.0'}],
                            license_compatible: [],
                            directory_path: 'path/to/version/in/sales',
                            changelog: "Nothing change",
                            descriptions: "Beta version"
                        }
                    ],
                    api_versions: [{
                        version: "1.0.0",
                        name: "api For cpos",
                        directory_path: 'path/to/api/in/server'
                    }],
                    "description": "Connect POS",
                    "created_at": DateTimeHelper.getCurrentDate(),
                    "updated_at": DateTimeHelper.getCurrentDate(),
                }
            ];
            
            _.forEach(productData, (pData) => {
                let product = OM.create<Product>(Product);
                product.addData(pData)
                       .save();
            });
        }
    }
    
    protected getDummyCPosPricing() {
        const prices    = PricingCollection.collection.find({}).fetch();
        let pricingIds  = [];
        let cposPricing = ['cpos_trial', 'cpos_standard', 'cpos_premium'];
        
        _.forEach(cposPricing, (_p) => {
            const cposPrice = _.find(prices, (p) => p['code'] === _p);
            
            if (!!cposPrice) {
                pricingIds.push({pricing_id: cposPrice['_id']});
            }
        });
        
        return pricingIds;
    }
}