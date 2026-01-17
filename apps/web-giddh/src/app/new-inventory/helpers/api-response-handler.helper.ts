import { ChangeDetectorRef } from '@angular/core';

/**
 * Shared utility for handling API response processing with virtual scroll
 * Used by advance-list-items-popup component
 */
export class ApiResponseHandlerHelper {
    /**
     * Processes API response and updates component state
     * 
     * @param response API response
     * @param searchedItems Current searched items array
     * @param apiRequestParams API request parameters
     * @param changeDetection ChangeDetectorRef instance
     * @param refreshCallback Callback to refresh virtual scroll viewport
     * @param initWidthCallback Callback to initialize parent width
     * @returns Updated state object
     */
    public static processApiResponse(
        response: any,
        searchedItems: any[],
        apiRequestParams: any,
        changeDetection: ChangeDetectorRef,
        refreshCallback: (preservePosition: boolean) => void,
        initWidthCallback: () => void
    ): { searchedItems: any[]; noResultsFound: boolean; allowLoadMore: boolean; highlightedItem: number } {
        let result = {
            searchedItems: searchedItems || [],
            noResultsFound: false,
            allowLoadMore: false,
            highlightedItem: 0
        };

        if (response && response.body && response.body.results && response.body.results.length > 0) {
            // Create new array reference for proper change detection
            result.searchedItems = [...(searchedItems || []), ...response.body.results];
            
            if (apiRequestParams.page === 1) {
                result.highlightedItem = 0;
            }
            result.noResultsFound = false;
            apiRequestParams.totalPages = response.body.totalPages;
            // Only allow load more if there are more pages available
            result.allowLoadMore = apiRequestParams.page < apiRequestParams.totalPages;

            // Force change detection and viewport refresh
            changeDetection.detectChanges();
            
            // Refresh virtual scroll viewport if available
            setTimeout(() => {
                // Preserve scroll position when loading more data (not initial search)
                const preservePosition = apiRequestParams.page > 1;
                refreshCallback(preservePosition);
                changeDetection.detectChanges();
            }, 0);
        } else {
            if (result.searchedItems?.length === 0) {
                result.noResultsFound = true;
                result.allowLoadMore = false;
            }
            changeDetection.detectChanges();
        }

        initWidthCallback();
        return result;
    }
}
