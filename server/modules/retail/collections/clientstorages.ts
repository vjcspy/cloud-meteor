import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {ClientStorageInterface} from "../api/client_storage-interface";
import SimpleSchema from 'simpl-schema';

export const ClientStorages = CollectionMaker.make<ClientStorageInterface>("client_storages", new SimpleSchema({
  license: String,
  base_url: String,
  data: new SimpleSchema({
    entity: String,
    entity_id: SimpleSchema.oneOf(String,Number),
    type_change: String
  }),
  cache_time: Number,
  created_at: {
    type: Date,
      defaultValue: DateTimeHelper.getCurrentDate()
  },
}));
