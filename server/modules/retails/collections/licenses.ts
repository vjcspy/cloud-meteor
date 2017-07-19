import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {LicenseInterface} from "../api/license-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const Licenses = CollectionMaker.make<LicenseInterface>("licenses",
                                                               new SimpleSchema({
                                                                 key: String,
                                                                 status: SimpleSchema.Integer,
                                                                 current_cashier_increment: {
                                                                   type: Number,
                                                                   optional: true
                                                                 },
                                                                 shop_owner_id: {
                                                                   type: String,
                                                                   optional: true
                                                                 },
                                                                 shop_owner_username: {
                                                                   type: String,
                                                                   optional: true
                                                                 },
                                                                 has_product: {
                                                                   type: Array
                                                                 },
                                                                 "has_product.$": new SimpleSchema({
                                                                   product_id: String,
                                                                   base_url: {
                                                                     type: Array,
                                                                     optional: true
                                                                   },
                                                                   'base_url.$': new SimpleSchema({
                                                                     status: SimpleSchema.Integer,
                                                                     url: String
                                                                   }),
                                                                   has_user: {
                                                                     type: Array,
                                                                     optional: true
                                                                   },
                                                                   "has_user.$": new SimpleSchema({
                                                                     user_id: String,
                                                                     username: String
                                                                   }),
                                                                   pricing_id: String,
                                                                   start_version: String,
                                                                   status: SimpleSchema.Integer,
                                                                   purchase_date: Date,
                                                                   active_date: Date,
                                                                   expired_date: Date
                                                                 }),
                                                                 has_roles: {
                                                                   type: Array,
                                                                   optional: true
                                                                 },
                                                                 "has_roles.$": new SimpleSchema({
                                                                   code: String,
                                                                   name: String,
                                                                 }),
                                                                 "has_roles.$.has_permissions": {
                                                                   type: Array,
                                                                   optional: true
                                                                 },
                                                                 "has_roles.$.has_permissions.$": new SimpleSchema({
                                                                   group: String,
                                                                   permission: String,
                                                                   is_active: Boolean
                                                                 }),
                                                                 is_auto_generate: {
                                                                   type: Boolean,
                                                                   defaultValue: true
                                                                 },
                                                                 created_by: String,
                                                                 created_at: {
                                                                   type: Date,
                                                                   defaultValue: DateTimeHelper.getCurrentDate()
                                                                 },
                                                                 updated_at: {
                                                                   type: Date,
                                                                   defaultValue: DateTimeHelper.getCurrentDate()
                                                                 }
                                                               }));
