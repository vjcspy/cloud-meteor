export enum ProductLicenseBillingCycle {
    MONTHLY  = 1,
    ANNUALLY = 2,
}

export interface LicenseInterface {
    _id?: string;
    key?: string;
    status?: number;
    shop_owner_id?: string;
    shop_owner_username?: string;
    current_cashier_increment?: number;
    has_product?: LicenseHasProductInterface[];
    has_roles?: LicenseHasRoleInterface[];
    created_by?: string;
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
    isFresh: boolean; // has already activated trial
    numOfExtraUser: number;
    has_user: LicenseHasProductHasUser[];
    purchase_date: Date;
    expired_date: Date;
    extra_user_purchase_date: Date;
    extra_user_expired_date: Date;
}

export interface BaseUrl {
    status?: number;
    url: string;
}

export interface LicenseHasProductHasUser {
    user_id: string;
    username: string;
}
