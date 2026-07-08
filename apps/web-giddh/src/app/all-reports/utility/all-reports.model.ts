export interface ReportItem {
    name: string;
    uniqueName: string;
}

export interface AllReportsResponse {
    reportList: ReportItem[];
    favoriteReportList: ReportItem[];
}

export interface ReportCategory {
    label: string;
    icon: string;
    reports: ReportItem[];
}
