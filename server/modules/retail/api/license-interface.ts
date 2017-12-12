export enum ProductLicenseBillingCycle {
    LIFE_TIME = 0,
    MONTHLY   = 1,
    ANNUALLY  = 2,
}

export interface LicenseInterface {
    _id?: string;
    key?: string;
    status: number;
    shop_owner_id?: string;
    shop_owner_username?: string;
    current_cashier_increment?: number;
    has_product?: LicenseHasProductInterface[];
    has_roles?: LicenseHasRoleInterface[]; // Each license has particular role
    created_at?: Date;
    updated_at?: Date
}

export interface LicenseHasRoleInterface {
    code: string;
    name: string;
    has_permissions: LicenseHasRoleHasPermissionInterface[];
}

export interface LicenseHasRoleHasPermissionInterface {
    name: string;
    permission: string;
    is_active: boolean;
}

export interface LicenseHasProductInterface {
    base_url: BaseUrl[];
    plan_id: string;
    product_id: string;
    pricing_id: string;
    billing_cycle: ProductLicenseBillingCycle;
    addition_entity: number;
    has_user: LicenseHasProductHasUser[];
    purchase_date: Date;
    expiry_date: Date;
    last_invoice?: Date;
    next_invoice?: Date;
}

export interface BaseUrl {
    in_use: boolean; // User Select inuse or not
    is_valid: boolean; // Admin must valid this base url
    url: string;
    api_version: string;
}

export interface LicenseHasProductHasUser {
    user_id: string;
    username: string;
}
