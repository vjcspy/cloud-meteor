export interface CodeLoginInterface {
    user_id: string,
    username:string,
    license_id: string,
    pin_code?: string,
    bar_code?: string,
    last_login: Date,
}
