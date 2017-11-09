import {PlanInterface} from "../../sales/api/plan-interface";

export interface OrderObject {
    plan?: PlanInterface;
    gatewayAdditionData: Object;
}

export class Payment {
    pay(OrderObject: OrderObject) {
        
    }
}