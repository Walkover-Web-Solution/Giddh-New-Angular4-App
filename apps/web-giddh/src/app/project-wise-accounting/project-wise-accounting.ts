/**
 * ProjectRequestType interface definition
 * Defines the structure and contract for ProjectRequestType objects
 */
export interface ProjectRequestType {
    companyUniqueName: string;
    branchUniqueName: string;
    sort: 'asc' | 'desc' | '';
    sortBy: 'NAME' | 'STATUS' | string;
    page: number;
    count: number;
    searchQuery: string;
    queryColumn: string;
}
/**
 * DefaultParamType interface definition
 * Defines the structure and contract for DefaultParamType objects
 */
export interface DefaultParamType {
    companyUniqueName: string,
    projectUniqueName: string,
    branchUniqueName: string,
    to: string,
    from: string,
    category: string
}

/**
 * ProjectDetails interface definition
 * Defines the structure and contract for ProjectDetails objects
 */
export interface ProjectDetails {
    uniqueName: string;
    name: string;
    archiveStatus: string;
    status: string;
    profitAndLoss?: number;
}

/**
 * ProjectDialogData interface definition
 * Defines the structure and contract for ProjectDialogData objects
 */
export interface ProjectDialogData {
    name?: string;
    project: any;
    isCreateFlow: boolean;
}

/**
 * ProjectWiseAccountingType enumeration
 * Defines constant values for ProjectWiseAccountingType
 */
export enum ProjectWiseAccountingType {
    Income = 'income',
    Expenses = 'expenses',
    ProfitLoss = 'profit-loss'
};

/**
 * ProjectStatusType enumeration
 * Defines constant values for ProjectStatusType
 */
export enum ProjectStatusType {
    Closed = 'CLOSED',
    InProgress = 'IN_PROGRESS'
};
