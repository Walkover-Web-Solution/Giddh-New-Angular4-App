export class DownloadsRequest {
    public from?: string;
    public to?: string;
    public page?: number;
    public count?: number;
    public totalPages?: number;
    public totalItems?: number;
}
export class DownloadsResponse {
    public page?: any;
    public count: number;
    public totalPages?: number;
    public totalItems?: number;
    public items?: [];
}

