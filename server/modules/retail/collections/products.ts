import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {ProductInterface} from "../api/product-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const Products = CollectionMaker.make<ProductInterface>(
    "products",
    new SimpleSchema(
        {
            _id: {
                type: String,
                optional: true
            },
            code: String,
            name: String,
            description: {
                type: String,
                optional: true
            },
            has_pricing: {
                type: Array
            },
            'has_pricing.$': new SimpleSchema(
                {
                    pricing_id: String,
                }
            ),
            versions: [
                new SimpleSchema(
                    {
                        name: String,
                        version: String,
                        api_compatible: {
                            type: Array
                        },
                        'api_compatible.$': new SimpleSchema(
                            {
                                version: String,
                            }
                        ),
                        license_compatible: {
                            type: Array
                        },
                        "license_compatible.$": new SimpleSchema(
                            {
                                license_id: String
                            }
                        ),
                        descriptions: {
                            type: String,
                            optional: true
                        },
                        changelog: {
                            type: String,
                            optional: true
                        },
                    }
                )
            ],
            api_versions: {
                type: Array
            },
            'api_versions.$': new SimpleSchema(
                {
                    version: String,
                    name: String,
                    directory_path: String
                }
            ),
            created_at: {
                type: Date,
                defaultValue: DateTimeHelper.getCurrentDate()
            },
            updated_at: {
                type: Date,
                defaultValue: DateTimeHelper.getCurrentDate()
            }
        }
    )
);

export const ProductCollection = Products;