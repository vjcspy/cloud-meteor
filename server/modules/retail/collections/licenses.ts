import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {LicenseInterface} from "../api/license-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const Licenses          = CollectionMaker.make<LicenseInterface>("licenses",
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
                                                                                                 type: Array,
                                                                                                 optional: true
                                                                                             },
                                                                                             "has_product.$": new SimpleSchema(
                                                                                                 {
                                                                                                     base_url: {
                                                                                                         type: Array,
                                                                                                         optional: true
                                                                                                     },
                                                                                                     'base_url.$': new SimpleSchema(
                                                                                                         {
                                                                                                             url: String,
                                                                                                             in_use: {
                                                                                                                 type: Boolean,
                                                                                                                 optional: true
                                                                                                             },
                                                                                                             is_valid: {
                                                                                                                 type: Boolean,
                                                                                                                 optional: true
                                                                                                             },
                                                                                                             api_version: {
                                                                                                                 type: String,
                                                                                                                 optional: true
                                                                                                             }
                                                                                                         }),
                                                                                                     plan_id: {
                                                                                                         type: String,
                                                                                                         optional: true
                                                                                                     },
                                                                                                     product_id: String,
                                                                                                     pricing_id: String,
                                                                                                     billing_cycle: {
                                                                                                         type: Number,
                                                                                                         optional: true
                                                                                                     },
                                                                                                     addition_entity: {
                                                                                                         type: SimpleSchema.Integer,
                                                                                                         optional: true
                                                                                                     },
                                                                                                     has_user: Array,
                                                                                                     "has_user.$": new SimpleSchema(
                                                                                                         {
                                                                                                             user_id: String,
                                                                                                             username: String
                                                                                                         }),
                                                                                                     purchase_date: Date,
                                                                                                     expiry_date: Date,
                                                                                                     last_invoice: {
                                                                                                         type: Date,
                                                                                                         optional: true
                                                                                                     },
                                                                                                     status: SimpleSchema.Integer,
                                                                                                     created_by: String,
                                                                                                     updated_by: String
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
                                                                                                                                                   name: String,
                                                                                                                                                   permission: String,
                                                                                                                                                   is_active: Boolean
                                                                                                                                               }),
                                                                                             created_at: {
                                                                                                 type: Date,
                                                                                                 defaultValue: DateTimeHelper.getCurrentDate()
                                                                                             },
                                                                                             updated_at: {
                                                                                                 type: Date,
                                                                                                 defaultValue: DateTimeHelper.getCurrentDate()
                                                                                             }
                                                                                         }));
export const LicenseCollection = Licenses;