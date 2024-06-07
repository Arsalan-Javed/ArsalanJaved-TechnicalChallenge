export const baseUrl:string = 'http://localhost:4000/api/';
export const socketBaseUrl:string = 'http://localhost:4001';

export interface UserModel{
    id: string,
    username: string,
    password: string,
    user_role: string
}

export interface SettlementDataModel {
    id: string,
    submitter_id: string,
    amount: string,
    status: SettlementStatus,
}

export enum UserRoles{
    SUBMITTER = 'submitter',
    RECEIVER = 'receiver'
}
export enum SettlementStatus{
    SUBMITTED = 'submitted',
    DISPUTED = 'disputed',
    SETTLED = 'settled'
}