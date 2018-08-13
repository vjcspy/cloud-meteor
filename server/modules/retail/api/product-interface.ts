export interface ProductInterface {
    _id?: string;
    code: string;
    name: string;
    has_pricing: ProductHasPricingInterface[];
    versions?: ProductVersion[];
    api_versions: ApiVersions[];
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProductHasPricingInterface {
    pricing_id: string;
}

export interface ProductVersion {
    name: string;
    version: string;
    api_compatible: ProductVersionApiCompatible[];
    license_compatible: ProductVersionLicenseCompatible[];
    descriptions?: string;
    changelog?: string;
}

export interface ProductVersionApiCompatible {
    version: string;
}

export interface ProductVersionLicenseCompatible {
    license_id: string;
}

export interface ApiVersions {
    version: string;
    name: string;
    directory_path: string;
}