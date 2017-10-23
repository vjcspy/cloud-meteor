export interface ProductInterface {
    _id?: string;
    code: string;
    name?: string;
    additional_data?: Object;
    pricings: string[];
    trial_days: number;
    nousers: number;
    versions?: ProductVersion[];
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ProductVersion {
    name?: string;
    version?: string;
    changelog: string;
    created_at?: Date;
    updated_at?: Date;
}
