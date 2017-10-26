export interface ProductInterface {
    _id?: string;
    code: string;
    name?: string;
    additional_data?: Object;
    has_pricing: ProductHasPricingInterface[];
    nousers: number;
    versions?: ProductVersion[];
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ProductHasPricingInterface {
    pricing_id: string;
    addition_data?: Object
}

export interface ProductVersion {
    name?: string;
    version?: string;
    changelog: string;
    created_at?: Date;
    updated_at?: Date;
}
