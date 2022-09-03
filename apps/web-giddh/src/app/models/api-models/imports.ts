export class ImportsRequest {
    public from?: string;
    public to?: string;
    public page?: number;
    public count?: number;
    public totalPages?: number;
    public totalItems?: number;
    branchUniqueName?: string;
}
export class ImportsResponse {
    public page?: any;
    public count: number;
    public totalPages?: number;
    public totalItems?: number;
    public items?: [];
}

export interface ImportsData {
    date?: any;
    efsPath?: any;
    expireAt?: any;
    metaData?: any;
    importFiile?: any;
    count?: any;
    requestId?: any;
    status?: any;
    type?:any;
    user?:any
}

