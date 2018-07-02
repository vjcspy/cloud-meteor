import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class EmailModel extends AbstractModel {
    protected $collection = "email";
    async saveEmail (data, type ): Promise<any> {
        if(!data) {
            throw new Meteor.Error('Error', 'can_not_save_email');
        }
        this.setData('email',data['email'])
            .setData('type', type)
            .setData('product_id',data['product_id']? data['product_id']:'')
            .setData('status','1');
            this.save();
    }

}