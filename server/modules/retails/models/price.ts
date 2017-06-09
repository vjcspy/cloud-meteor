import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class Price extends AbstractModel {
  protected $collection = 'prices';

  static TYPE_STANDARD   = 1;
  static TYPE_PREMIUM   = 2;
  static TYPE_LIFETIME = 3;

  static VISIBILITY_HIDDEN = 0;
  static VISIBILITY_SHOW = 1;
}
