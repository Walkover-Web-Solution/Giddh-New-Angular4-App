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
    public totalSavedEntries: number;
    public totalTallyAccounts: number;
    public totalSavedAccounts: number;
    public totalTallyEntries: number;
    public totalSavedGroups: number;
    public totalTallyGroups: number;
    public status: string;
    public id: number;
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

