/** Sales Person Create Update */
export interface SalesPersonCreateUpdate {
    name: string,
    email: string,
    mobileNumber: string,
    uniqueName?: string
}

/** Sales Person Action Enum */
export enum SalesPersonActionEnum {
    GET_ALL = 'get',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    EDIT = 'edit'
}
