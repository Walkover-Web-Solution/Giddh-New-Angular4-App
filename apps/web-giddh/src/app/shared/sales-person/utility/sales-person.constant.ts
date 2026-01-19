/** Sales Person Create Update */
/**
 * SalesPersonCreateUpdate interface definition
 * Defines the structure and contract for SalesPersonCreateUpdate objects
 */
export interface SalesPersonCreateUpdate {
    name: string,
    email: string,
    mobileNumber: string,
    uniqueName?: string
}

/** Sales Person Action Enum */
/**
 * SalesPersonActionEnum enumeration
 * Defines constant values for SalesPersonActionEnum
 */
export enum SalesPersonActionEnum {
    GET_ALL = 'get',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    EDIT = 'edit',
    ARCHIVE = 'archive'
}


/** Sales Person Archive Enum */
/**
 * SalesPersonArchiveEnum enumeration
 * Defines constant values for SalesPersonArchiveEnum
 */
export enum SalesPersonArchiveEnum {
    ARCHIVE = 'ARCHIVED',
    UNARCHIVED = 'UNARCHIVED',
    BOTH = ''
}

/** Sales Person Error Details Enum */
/**
 * SalesPersonErrorDetailsEnum enumeration
 * Defines constant values for SalesPersonErrorDetailsEnum
 */
export enum SalesPersonErrorDetailsEnum {
    ACCOUNT = 'account',
    ENTRY_VOUCHER = 'entry/voucher'
}

/** Action Type Enum */
/**
 * ActionTypeEnum enumeration
 * Defines constant values for ActionTypeEnum
 */
export enum ActionTypeEnum {
    TRANSFER = 'TRANSFER',
    UNASSIGNED = 'UNASSIGNED',
    UNARCHIVED = 'UNARCHIVED'
}

/** Sales Person Delete Archived Model */
/**
 * SalesPersonDeleteArchivedModel interface definition
 * Defines the structure and contract for SalesPersonDeleteArchivedModel objects
 */
export interface SalesPersonDeleteArchivedModel {
    action: ActionTypeEnum,
    uniqueName?: string,
    archiveOnly?: boolean // This send true in case archive only, if we proceed from delete and archive then do not send this key
}