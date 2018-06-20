export enum USER_EMAIL_TEMPLATE  {
    REQUEST_TRIAL,
    SALE,
    TRIAL_EXPIRED,
    EXPIRED,
    INVOICE
};
export interface UserInterface extends Meteor.User {
    status?: Number;
    profile?: Profile;
    has_license?: UserHasLicense[]; // Normal user has only one license. We support license as array to satisfy agency or sale role.
    created_at?: Date;
    updated_at?: Date;
}

export interface Profile {
    first_name?: String;
    last_name?: String;
    country?: String,
    picture?: String,
    phone?: String,
    cashier_increment: number
}

export interface UserHasLicense {
    license_id: string,
    license_increment: number,
    license_permission: string;
    shop_role: string;
    status: number;
}
