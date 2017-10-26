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
    isFresh: boolean; // has already activated trial
    numOfExtraUser: number;
    has_user: LicenseHasProductHasUser[];
    has_invoice: LicenseHasProductHasInvoice[];
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

export interface LicenseHasProductHasInvoice {
    description: string;
    transaction_id: string;
    amount: number;
    payment_method: string;
    status: number;
    purchased_date: Date;
}
