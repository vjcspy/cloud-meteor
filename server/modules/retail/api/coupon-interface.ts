export enum CouponMethod {
    PERCENTAGE,
    FIXED_AMOUNT
}
export interface CouponInterface {
    _id?: string;
    code: string;
    name: string;
    license_compatible: LicenseCompatible[];
    description?: string;
    quantity?: number;
    used: number;
    quantity_user?:number;
    method: CouponMethod;
    amount: number;
    min_total?: number;
    from_date?: Date;
    to_date?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface LicenseCompatible {
    license_id: string;
}