import {PlanInterface} from "../../sales/api/plan-interface";

export interface OrderObject {
    plan?: PlanInterface;
    activeUser?: any;
}

export class Payment {
    pay(OrderObject: OrderObject, gatewayAdditionData?: Object) {
        
    }
}