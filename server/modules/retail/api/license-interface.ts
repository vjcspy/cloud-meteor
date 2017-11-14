export enum ProductLicenseBillingCycle {
    LIFE_TIME = 0,
    MONTHLY   = 1,
    ANNUALLY  = 2,
}

export interface LicenseInterface {
    _id?: string;
    key?: string;
    status?: number;
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
    code: string;
    group: string;
    permission: string;
    is_active: boolean;
}

export interface LicenseHasProductInterface {
    product_id: string;
    base_url: BaseUrl[];
    pricing_id: string;
    pricing_type: string;
    billing_cycle: ProductLicenseBillingCycle;
    addition_entity: number; // Maybe register, outlet or activated user
    is_fresh: boolean; // has already activated trial
    has_user: LicenseHasProductHasUser[];
    purchase_date: Date;
    expired_date: Date;
}

export interface BaseUrl {
    status?: number;
    url: string;
}

export interface LicenseHasProductHasUser {
    user_id: string;
    username: string;
}
