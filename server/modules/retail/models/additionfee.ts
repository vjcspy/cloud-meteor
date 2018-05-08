import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class AdditionFee extends  AbstractModel {
    protected $collection = 'addition_fee';

    getName(){
        return this.getData('name');
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
}