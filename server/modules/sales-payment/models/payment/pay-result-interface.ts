export enum PayResultType {
    PAY_SUCCESS,
    PAY_FAIL,
    PAY_ERROR
}

export interface PayResultInterface {
    type: PayResultType;
    data?: Object;
}