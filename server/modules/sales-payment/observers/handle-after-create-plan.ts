import {ObserverInterface} from "../../../code/core/app/event/observer-interface";
import {DataObject} from "../../../code/Framework/DataObject";
import {Payment} from "../models/payment";
import {OM} from "../../../code/Framework/ObjectManager";

export class HandleAfterCreatePlan implements ObserverInterface {
    observe(dataObject: DataObject) {
        const {plan} = dataObject.getData('data');
        
        if (plan.getGrandtotal() === 0) {
            let payment = OM.create<Payment>(Payment);
            payment.pay(plan, null, null)
        }
    }
    
}