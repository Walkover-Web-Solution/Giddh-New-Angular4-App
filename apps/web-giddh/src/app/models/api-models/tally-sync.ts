export class TallySyncResponseData {
    public message: string;
    public body: string;
    public status: string;
}

export class TallySyncData {
    public company: Company;
    public createdAt: any;
    public updatedAt: Date;
    public tallyErrorEntries: number;
    public tallyErrorGroups: number;
    public tallyErrorAccounts: number;
    public tallyErrorVouchers: number;
    public totalSavedEntries: number;
    public totalTallyAccounts: number;
    public totalSavedAccounts: number;
    public totalTallyEntries: number;
    public totalTallyVouchers: number;
    public totalSavedGroups: number;
    public totalSavedVouchers: number;
    public totalTallyGroups: number;
    public status: string;
    public id: number;
    public type?: any;
    public dateString?: any;
    public groupsPercent?: any;
    public groupsErrorPercent?: any;
    public accountsPercent?: any;
    public accountsErrorPercent?: any;
    public entriesPercent?: any;
    public entriesErrorPercent?: any;
    public vouchersPercent?: any;
    public vouchersErrorPercent?: any;
}

export class Company {
    public uniqueName: string;
    public name: string;
}

export class DownloadTallyErrorLogRequest {
    date: string;
    hour: any;
    type: any;
}

