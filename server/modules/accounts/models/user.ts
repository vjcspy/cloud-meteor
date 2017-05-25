import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class User extends AbstractModel {
  protected $collection = "users";
  
  getUsername(): string {
    return this.getData('username');
  }
  
  isDisabled(): boolean {
    return this.getData("is_disabled") === true;
  }
}

