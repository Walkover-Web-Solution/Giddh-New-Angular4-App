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
export interface DefaultParamType {
    companyUniqueName: string,
    projectUniqueName: string,
    branchUniqueName: string,
    to: string,
    from: string,
    category: string
}

export interface ProjectDetails {
    uniqueName: string;
    name: string;
    archiveStatus: string;
    status: string;
    profitAndLoss?: number;
}

export interface ProjectDialogData {
    name?: string;
    project: any;
    isCreateFlow: boolean;
}

export enum ProjectWiseAccountingType {
    Income = 'income',
    Expenses = 'expenses',
    ProfitLoss = 'profit-loss'
};

export enum ProjectStatusType {
    Closed = 'CLOSED',
    InProgress = 'IN_PROGRESS'
};
