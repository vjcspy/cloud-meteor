import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";

export class ClientStorage extends AbstractModel {
  protected $collection: string = "client_storages";
    
    removeStorage(data): Promise<any> {
        if (!this.getMongoCollection())
            throw new Error("Can't get collection name from model");
        let license = data['license'];
        
        return new Promise((resolve, reject) => {
            if (!license) {
                throw new Error("Can't find item");
            } else {
                if(!data['startTime'] && !data['endTime'])
                {
                    this.getMongoCollection()
                        .remove({license: license}, (err) => {
                            return err ? reject(err) : resolve();
                        })
                } else if(!data['startTime'] && data['endTime']) {
                    this.getMongoCollection()
                        .remove({license: license,  created_at: {$lt:data['endTime']} }, (err) => {
                            return err ? reject(err) : resolve();
                        })
                } else if(data['startTime'] && !data['endTime']) {
                    this.getMongoCollection()
                        .remove({license: license,  created_at: {$gt:data['startTime']} }, (err) => {
                            return err ? reject(err) : resolve();
                        })
                } else {
                    this.getMongoCollection()
                        .remove({license: license,  created_at: {$gt: data['startTime'], $lt:data['endTime']} }, (err) => {
                            return err ? reject(err) : resolve();
                        })
                }
            }
        });
    }
    
}