export interface ReportItem {
    name: string;
    uniqueName: string;
}

export interface FilterOption {
    name: string;
    reports: string[];
}

export interface AllReportsResponse {
    reportList: ReportItem[];
    favoriteReportList: ReportItem[];
    filterOption?: FilterOption[];
}

export interface ReportCategory {
    label: string;
    icon: string;
    reports: ReportItem[];
}
