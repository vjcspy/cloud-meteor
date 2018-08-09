import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {AdditionFeeInterface, AdditionFeeStatus} from "../api/addition-fee-interface";
import {StoneEventManager} from "../../../code/core/app/event/stone-event-manager";
import {InvoiceCollection} from "../../sales/collection/invoice";
import {OM} from "../../../code/Framework/ObjectManager";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export class AdditionFee extends  AbstractModel {
    protected $collection: string = 'addition_fee';

    getName(){
        return this.getData('name');
    }
    getUserId(): string {
        return this.getData('user_id');
    }
    
    getGrandtotal():number{
        return this.getCost();
    }
    getCost(): number {
        return parseFloat(this.getData('cost'));
    }
    getDescription(): string {
        return this.getData('description');
    }
    getStatus(): number {
        return this.getData('status');
    }
    getProductId(): number {
        return this.getData('product_id');
    }
    canInvoice(): boolean {
        // if order is sale -> status = Pending and not any invoice created
        if (this.getStatus() === AdditionFeeStatus.SALE_PENDING) {
            const existedInvoice = InvoiceCollection.collection.find({entity_id: this.getId()}).count();
    
            return existedInvoice <= 0;
    
        }
        
        if (this.getStatus() === AdditionFeeStatus.SALE_COMPLETE) {
            return false;
        }
        
        return true;
    }
    
    additionFeeHasAlreadyPaid(): boolean {
        if (this.getStatus() === AdditionFeeStatus.SALE_COMPLETE) {
            return true;
        }
        else {
            return false;
        }
    }
}