export interface ProjectRequestType {
    companyUniqueName: string;
    branchUniqueName: string;
    sort: 'asc' | 'desc' | '';
    sortBy: 'NAME' | 'ARCHIVE_STATUS' | 'STATUS' | string;
    page: number;
    count: number;
    q: string;
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
