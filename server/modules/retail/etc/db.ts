import {DbSchemaInterface} from "../../../code/core/app/contract/module-declare/db-schema-interface";
import {StoneModulesInterface} from "../../../code/core/app/module/collections/stone-modules";
import {ModuleConfigInterface} from "../../../code/core/app/contract/module-declare/module-config-interface";
import {LicenseCollection} from "../collections/licenses";
import {PricingProvider} from "../providers/pricing";
import * as _ from 'lodash';
import {OM} from "../../../code/Framework/ObjectManager";
import {License} from "../models/license";
import {LicenseHasProductInterface} from "../api/license-interface";
import * as moment from "moment";

export class RetailDB implements DbSchemaInterface {
    install() {
    }
    
    up(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
        if (!currentModule || currentModule.version < '0.0.8') {
            LicenseCollection.collection.update({}, {$set: {has_roles: []}}, {multi: true});
        }
        if (!currentModule || currentModule.version < '0.0.9') {
            (new PricingProvider()).initDefaultPricing();
        }
        if (!currentModule || currentModule.version < '0.0.95') {
            const licenses = LicenseCollection.collection.find().fetch();
            _.forEach(licenses, (l) => {
                const license = OM.create<License>(License);
                license.loadById(l['_id']);
                
                _.forEach(license.getProducts(), (lP: LicenseHasProductInterface) => {
                    if (!lP['has_user']) {
                        lP['has_user'] = [];
                    }
                    
                    if (!lP['expiry_date']) {
                        lP['expiry_date'] = moment().add(30, 'days').toDate();
                    }
                    
                    _.forEach(lP['base_url'], (bUrl) => {
                        Object.assign(bUrl, {in_use: true, is_valid: true});
                    });
                });
                
                license.save();
            });
        }
    }
    
    down(currentModule: StoneModulesInterface, moduleConfig: ModuleConfigInterface) {
    }
    
}