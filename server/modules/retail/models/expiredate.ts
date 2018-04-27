import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class Expiredate extends AbstractModel {
    protected $collection: string = 'expire_date';
    async createrExpireDate(expire_date): Promise<any> {
        _.forEach(expire_date, (e) => {
            this.setData('license', e['license'])
                .setData('shop_owner_id', e['shop_owner_id'])
                .setData('shop_owner_username', e['shop_owner_username'])
                .setData('product_id', e['product_id'])
                .setData('purchase_date', e['purchase_date'])
                .setData('expiry_date', e['expiry_date']);
                this.save();
        })


    }
}