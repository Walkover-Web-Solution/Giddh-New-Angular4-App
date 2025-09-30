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
    EDIT = 'edit',
    ARCHIVE = 'archive'
}


/** Sales Person Archive Enum */
export enum SalesPersonArchiveEnum {
    ARCHIVE = 'ARCHIVED',
    UNARCHIVED = 'UNARCHIVED',
    BOTH = ''
}

/** Sales Person Error Details Enum */
export enum SalesPersonErrorDetailsEnum {
    ACCOUNT = 'account',
    ENTRY_VOUCHER = 'entry/voucher'
}

/** Action Type Enum */
export enum ActionTypeEnum {
    TRANSFER = 'TRANSFER',
    UNASSIGNED = 'UNASSIGNED',
    UNARCHIVED = 'UNARCHIVED'
}

/** Sales Person Delete Archived Model */
export interface SalesPersonDeleteArchivedModel {
    action: ActionTypeEnum,
    uniqueName?: string,
    archiveOnly?: boolean // This send true in case archive only, if we proceed from delete and archive then do not send this key
}