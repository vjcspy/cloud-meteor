import * as _ from 'lodash';
import {DataObject} from "../../../../code/Framework/DataObject";
import {PricingCollection} from "../../../retail/collections/prices";

export abstract class PaymentAbstract extends DataObject {
    protected getPricing(pricingId: string) {
        return _.find(PricingCollection.collection.find().fetch(), (_p) => _p['_id'] === pricingId);
    }
}