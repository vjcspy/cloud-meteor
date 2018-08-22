export interface CodeLoginInterface {
    user_id: string,
    username:string,
    license_id: string,
    pin_code?: string,
    bar_code?: string,
    active_type?: number, // 0:  deactivate all, 1: active all, 2: active pin_code, 3: active bar_code
    height_qr_code?: number,
    width_bar_code?: number,
    format_bar_code?: string,
    height_bar_code?: number,
    show_value_bar_code?: boolean,
    last_login: Date,
    unlock_type?:number,
    minute_unlock?: number
}
