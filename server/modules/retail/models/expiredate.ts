import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class Expiredate extends AbstractModel {
    protected $collection: string = 'expire_date';
    async createrExpireDate(expire_date): Promise<any> {
        _.forEach(expire_date, (ex) => {
            this.setData('license_id', ex['license_id'])
                .setData('shop_owner_id', ex['shop_owner_id'])
                .setData('shop_owner_username', ex['shop_owner_username'])
                .setData('product_id', ex['product_id'])
                .setData('purchase_date', ex['purchase_date'])
                .setData('expiry_date', ex['expiry_date']);
                this.save();
        })


    }
}