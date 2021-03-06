import {MongoObservable} from "meteor-rxjs";

export class CollectionMaker {
  protected static $collections = {};
  
  static make<T>(collectionName: string, schema?: any): MongoObservable.Collection<T> {
    if (!collectionName)
      throw new Error("Collection name can't empty");
    
    CollectionMaker.$collections[collectionName] = new MongoObservable.Collection<T>(collectionName);
    if (!!schema)
      CollectionMaker.$collections[collectionName].collection['attachSchema'](schema);
    
    return CollectionMaker.$collections[collectionName];
  }
  
  static makeFromExisting<T>(collection: Mongo.Collection<any>, schema?: any): MongoObservable.Collection<T> {
    CollectionMaker.$collections[collection['_name']] = MongoObservable.fromExisting<T>(collection);
    if (!!schema)
      CollectionMaker.$collections[collection['_name']].collection['attachSchema'](schema);
    
    return CollectionMaker.$collections[collection['_name']];
  }
  
  static getCollection<T>(collectionName: string): MongoObservable.Collection<T> {
    if (!collectionName)
      throw new Error("Collection name can't empty");
    
    if (CollectionMaker.$collections.hasOwnProperty(collectionName) && !!CollectionMaker.$collections[collectionName]) {
      return CollectionMaker.$collections[collectionName];
    }
    
    throw new Error("Collection not yet defined");
  }
  
  static hookBeforeInsert(collectionName: string, callBackFuc: (userId: string, doc: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.insert(callBackFuc);
  }
  
  static hookBeforeUpdate(collectionName: string, callBackFuc: (userId: string, doc: any, modifier: any, options: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.update(callBackFuc);
  }
  
  static hookBeforeRemove(collectionName: string, callBackFuc: (userId: string, doc: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.remove(callBackFuc);
  }
  
  static hookBeforeUpsert(collectionName: string, callBackFuc: (userId: string, selector: any, modifer: any, options: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.upsert(callBackFuc);
  }
  
  static hookBeforeFind(collectionName: string, callBackFuc: (userId: string, selector: any, options: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.find(callBackFuc);
  }
  
  static hookBeforeFindOne(collectionName: string, callBackFuc: (userId: string, selector: any, options: any) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.before.findOne(callBackFuc);
  }
  
  static hookAfterFind(collectionName: string, callBackFuc: (userId: string, selector: any, options: any, cursor: Mongo.Cursor<any>) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.after.find(callBackFuc);
  }
  
  static hookAfterFindOne(collectionName: string,
                          callBackFuc: (userId: string, selector: any, options: any, cursor: Mongo.Cursor<any>) => void): void {
    (CollectionMaker.getCollection(collectionName) as any).collection.after.findOne(callBackFuc);
  }
  
  static hookAfterInsert(collectionName: string, callBackFuc: (userId: string, doc: any) => void) {
    (CollectionMaker.getCollection(collectionName) as any).collection.after.insert(callBackFuc);
  };
  
  static hookAfterUpdate(collectionName: string, callBackFuc: (userId: string, doc: any, fieldNames: any, modifier: any, options: any) => void) {
    (CollectionMaker.getCollection(collectionName) as any).collection.after.update(callBackFuc);
  };
  
  static hookAfterRemove(collectionName: string, callBackFuc: (userId: string, doc: any) => void) {
    (CollectionMaker.getCollection(collectionName) as any).collection.after.remove(callBackFuc);
  };
}
