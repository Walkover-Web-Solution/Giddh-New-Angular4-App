export class BaseResponse<TResponce, TRequest> {
    public status?: string;
    public code?: string;
    public message?: string;
    public body?: any;
    public response?: TResponce;
    public request?: TRequest;
    public queryString?: any;
    public statusCode?: number;
    public statusText?: string;
    public errorDetails?: string[];
}

export interface PagedResponse {
    count: number;
    page: number;
    totalPages: number;
    totalItems: number;
}

export class CommonPaginatedResponse<T> {
    public count: number;
    public page: number;
    public results: T[];
    public size: number;
    public totalItems: number;
    public totalPages: number;
}
