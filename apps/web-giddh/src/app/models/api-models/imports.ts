/**
 * ImportsRequest class
 * Implements ImportsRequest functionality
 */
export class ImportsRequest {
    public from?: string;
    public to?: string;
    public page?: number;
    public count?: number;
    public totalPages?: number;
    public totalItems?: number;
    public branchUniqueName?: string;
}
/**
 * ImportsResponse class
 * Implements ImportsResponse functionality
 */
export class ImportsResponse {
    public page?: any;
    public count: number;
    public totalPages?: number;
    public totalItems?: number;
    public items?: [];
}
/**
 * ImportsData interface definition
 * Defines the structure and contract for ImportsData objects
 */
export interface ImportsData {
    date?: string;
    path?: string;
    expireAt?: any;
    metaData?: any;
    importFiile?: any;
    count?: number;
    requestId?: any;
    status?: any;
    type?: string;
    user?: any
}

/**
 * ImportsSheetDownloadRequest class
 * Implements ImportsSheetDownloadRequest functionality
 */
export class ImportsSheetDownloadRequest  {
    public status: any;
    public requestId: any;
}
