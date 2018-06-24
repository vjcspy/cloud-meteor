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


    take_care_by_agency?:String;
    customer_type?:CustomerType;
    last_date_trial?:Date;
    company_name?:String;
    url_customer_domain?:String;

    //has just when user has role is agency
    agency?: Agency;
    submission_status?: SubmissionStatus;
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


/////////////////////////////
////Update mode for Agency///
/////////////////////////////

export  enum CustomerType {
    Lead ,
    Referral,
    Rejected,
    Referral_Expired,
    TrialCustomer,
    Exprired_Trial,
    Merchant,
    Terminated,
}

export  enum SubmissionStatus {
    Waiting_For_Approval,
    Approved,
    Rejected,
}


export  interface  Agency {
    agencyType?: AgencyType;
    company?:String;
    status?:Boolean;
    commission?:Commission;
}


export enum AgencyType {
    Developer  ,
    Normal  ,
}

export interface LevelCommission {
    level:Number;
    revenue_from?:Number;
    revenue_to?:Number;
    bonus?:Number;
}

export  interface  Commission {
    commission_value?:Number;
    level_commissions?: LevelCommission[];
    receipt_date?: Date;
}

