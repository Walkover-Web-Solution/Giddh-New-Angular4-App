export interface SalesPersonCreateUpdate  {
    name : string,
    email : string,
    mobileNumber : string,
    uniqueName?: string
}

export enum SalesPersonActionEnum {
    GET_ALL = 'get',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    EDIT = 'edit'
}
    