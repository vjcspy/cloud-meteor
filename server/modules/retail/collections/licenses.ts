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
                                                                                        type: Array,
                                                                                        optional: true
                                                                                    },
                                                                                    "has_product.$": new SimpleSchema(
                                                                                        {
                                                                                            product_id: String,
                                                                                            isFresh: Boolean,
                                                                                            base_url: {
                                                                                                type: Array,
                                                                                                optional: true
                                                                                            },
                                                                                            'base_url.$': new SimpleSchema(
                                                                                                {
                                                                                                    status: SimpleSchema.Integer,
                                                                                                    url: String
                                                                                                }),
                                                                                            has_user: {
                                                                                                type: Array,
                                                                                                optional: true
                                                                                            },
                                                                                            "has_user.$": new SimpleSchema(
                                                                                                {
                                                                                                    user_id: String,
                                                                                                    username: String
                                                                                                }),
                                                                                            "has_invoice.$": new SimpleSchema(
                                                                                                {
                                                                                                    description: String,
                                                                                                    transaction_id: String,
                                                                                                    amount: Number,
                                                                                                    payment_method: String,
                                                                                                    status: SimpleSchema.Integer,
                                                                                                    purchased_date: Date
                                                                                                }),
                                                                                            pricing_id: {
                                                                                                type: String,
                                                                                                optional: true
                                                                                            },
                                                                                            pricing_type: {
                                                                                                type: String,
                                                                                                optional: true
                                                                                            },
                                                                                            start_version: {
                                                                                                type: String,
                                                                                                optional: true
                                                                                            },
                                                                                            status: {
                                                                                                type: Number,
                                                                                                optional: true
                                                                                            },
                                                                                            purchase_date: {
                                                                                                type: Date,
                                                                                                optional: true
                                                                                            },
                                                                                            active_date: {
                                                                                                type: Date,
                                                                                                optional: true
                                                                                            },
                                                                                            expired_date: {
                                                                                                type: Date,
                                                                                                optional: true
                                                                                            }
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
                                                                                    created_by: {
                                                                                        type: String,
                                                                                        optional: true
                                                                                    },
                                                                                    created_at: {
                                                                                        type: Date,
                                                                                        defaultValue: DateTimeHelper.getCurrentDate()
                                                                                    },
                                                                                    updated_at: {
                                                                                        type: Date,
                                                                                        defaultValue: DateTimeHelper.getCurrentDate()
                                                                                    }
                                                                                }));
