export class ImportsRequest {
    public from?: string;
    public to?: string;
    public page?: number;
    public count?: number;
    public totalPages?: number;
    public totalItems?: number;
    public branchUniqueName?: string;
}
export class ImportsResponse {
    public page?: any;
    public count: number;
    public totalPages?: number;
    public totalItems?: number;
    public items?: [];
}
export interface ImportsData {
    date?: string;
    efsPath?: string;
    expireAt?: any;
    metaData?: any;
    importFiile?: any;
    count?: number;
    requestId?: any;
    status?: any;
    type?: string;
    user?: any
}

export class ImportsSheetDownloadRequest  {
    public status: any;
    public requestId: any;
}
