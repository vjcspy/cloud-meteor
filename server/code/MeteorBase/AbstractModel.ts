import {DataObject} from "../Framework/DataObject";
import {DateTimeHelper} from "../Framework/DateTimeHelper";
import {CollectionMaker} from "./CollectionMaker";

export abstract class AbstractModel extends DataObject {
  protected abstract $collection: string;
  
  getId() {
    return this.getData('_id');
  }
  
  /*
   * Get Object
   */
  loadById(id: string): any {
    let _data = this.getMongoCollection().findOne({_id: id});
    return !!_data ? this.addData(_data) : null;
  }
  
  load(value: any, field = "_id"): any {
    if (field == "_id")
      return this.loadById(value);
    else {
      let _selector    = {};
      _selector[field] = value;
      let _data        = this.getMongoCollection().findOne(_selector);
      return !!_data ? this.addData(_data) : null;
    }
  }
  
  save(): Promise<any> {
    if (!this.getMongoCollection())
      throw new Error("Can't get collection name from model");
    
    let _id = this.getData('_id');
    return new Promise((resolve, reject) => {
      if (!_id) {
        this.setData('created_at', DateTimeHelper.getCurrentDate());
        this.getMongoCollection()
            .insert(this.getData(), (err, id) => {
                this.setData('_id', id);
                return err ? reject(err) : resolve(id);
            });
      } else {
        this.setData('updated_at', DateTimeHelper.getCurrentDate());
        this.getMongoCollection()
            .update({_id: _id}, {$set: this.getData()}, {}, (err) => {
              return err ? reject(err) : resolve(_id);
            })
      }
    });
  }
  
  remove(): Promise<any> {
    if (!this.getMongoCollection())
      throw new Error("Can't get collection name from model");
    
    let _id = this.getData('_id');
    return new Promise((resolve, reject) => {
      if (!_id) {
        throw new Error("Can't find item");
      } else {
        this.getMongoCollection()
            .remove({_id: _id}, (err) => {
              return err ? reject(err) : resolve();
            })
      }
    });
  }
  
  delete(): Promise<any> {
    return this.remove();
  }
  
  getMongoCollection<T>(): Mongo.Collection<T> {
    if (!this.$collection) {
      throw new Error("Collection name must be string");
    }
    return CollectionMaker.getCollection<T>(this.$collection).collection;
  }
}
