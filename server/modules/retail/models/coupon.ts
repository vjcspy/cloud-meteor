import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {CouponInterface, CouponMethod} from "../api/coupon-interface";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export class Coupon extends  AbstractModel {
    protected $collection: string = 'coupons';
    
    getName(){
        return this.getData('name');
    }
    
    getQuantity():number{
        return parseFloat(this.getData('quantity'));
    }
    getAmount(): number {
        return parseFloat(this.getData('amount'));
    }
    getDescription(): string {
        return this.getData('description');
    }
    getCode(): string {
        return this.getData('code');
    }
    getMethod(): number {
        return this.getData('method');
    }
}