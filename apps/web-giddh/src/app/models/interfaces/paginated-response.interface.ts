/**
 * IPagination interface definition
 * Defines the structure and contract for IPagination objects
 */
export interface IPagination {
    count: number;
    page: number;
    totalItems: number;
    totalPages: number;
}

/**
 * IPaginatedResponse interface definition
 * Defines the structure and contract for IPaginatedResponse objects
 */
export interface IPaginatedResponse<T = any> extends IPagination {
    size: number;
    results: T[];
}
