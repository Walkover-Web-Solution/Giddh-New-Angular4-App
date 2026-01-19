/**
 * Helper class for infinite scroll pagination
 * Eliminates duplication across 8+ components with scroll-based pagination
 */

export interface PaginationData {
    page: number;
    totalPages: number;
    query: string;
}

export interface InfiniteScrollConfig<T> {
    paginationData: PaginationData;
    defaultSuggestions: T[];
    searchMethod: (query: string, page: number, callback: (response: any[]) => void) => void;
    mapResponse: (item: any) => T;
    preventDefaultCall?: boolean;
}

/**
 * Helper class for managing infinite scroll pagination
 * 
 * @export
 * @class InfiniteScrollPaginationHelper
 * @template T - Type of suggestion items
 */
export class InfiniteScrollPaginationHelper<T> {
    
    constructor(private config: InfiniteScrollConfig<T>) {}

    /**
     * Handles scroll end event to load more data
     * 
     * @memberof InfiniteScrollPaginationHelper
     */
    public handleScrollEnd(): void {
        if (this.config.preventDefaultCall) {
            return;
        }

        if (this.config.paginationData.page < this.config.paginationData.totalPages) {
            this.config.searchMethod(
                this.config.paginationData.query,
                this.config.paginationData.page + 1,
                (response) => {
                    if (!this.config.paginationData.query) {
                        const results = response.map(this.config.mapResponse);
                        this.config.defaultSuggestions = this.config.defaultSuggestions.concat(...results);
                    }
                }
            );
        }
    }

    /**
     * Resets pagination data to initial state
     * 
     * @memberof InfiniteScrollPaginationHelper
     */
    public resetPagination(): void {
        this.config.paginationData.page = 0;
        this.config.paginationData.totalPages = 0;
        this.config.paginationData.query = '';
        this.config.defaultSuggestions = [];
    }

    /**
     * Updates pagination data
     * 
     * @param {Partial<PaginationData>} data - Partial pagination data to update
     * @memberof InfiniteScrollPaginationHelper
     */
    public updatePaginationData(data: Partial<PaginationData>): void {
        Object.assign(this.config.paginationData, data);
    }
}
