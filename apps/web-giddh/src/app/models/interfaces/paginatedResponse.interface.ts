export interface IPagination {
    count: number;
    page: number;
    totalItems: number;
    totalPages: number;
}

export interface IPaginatedResponse<T = any> extends IPagination {
    size: number;
    results: T[];
}
