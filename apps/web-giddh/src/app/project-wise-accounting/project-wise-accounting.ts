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
    name: string;
    position: number;
    status: string;
    symbol: string;
    action: string;
}
