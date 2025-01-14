export interface projectType {
    companyUniqueName: string;
    branchUniqueName: string;
    sort: 'asc' | 'desc' | '';
    sortBy: 'NAME' | 'TOTAL_INVOICES' | 'TOTAL_INVOICES' | 'TOTAL_BILLS' | 'STATUS';
    page: number;
    count: number;
    q: string;
}


export interface projectDetails {
    uniqueName: string;
    name: string;
    archiveStatus: string;
    status: string;
    profitAndLoss: number;
}
