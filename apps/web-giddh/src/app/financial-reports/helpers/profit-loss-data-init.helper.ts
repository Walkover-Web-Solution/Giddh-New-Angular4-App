import { ChildGroup, Account } from '../../models/api-models/Search';

/**
 * Shared utility for initializing profit & loss report data
 * Used by profit-loss components for consistent data initialization
 */
export class ProfitLossDataInitHelper {
    /**
     * Initializes group list data with category and visibility properties
     * Recursively processes child groups and accounts
     * 
     * @param groupList Array of child groups to initialize
     * @param category Category to assign to groups and accounts
     */
    public static initData(groupList: ChildGroup[], category: string): void {
        (Array.isArray(groupList) ? groupList : []).forEach((childGroup: ChildGroup) => {
            childGroup.category = category;
            childGroup.isVisible = false;
            childGroup.isCreated = false;
            childGroup.isIncludedInSearch = true;
            (Array.isArray(childGroup.accounts) ? childGroup.accounts : []).forEach((account: Account) => {
                account.isIncludedInSearch = true;
                account.isCreated = false;
                account.isVisible = false;
                account.category = category;
            });
            /**
             * Handles if functionality
             */
            if (childGroup.childGroups) {
                ProfitLossDataInitHelper.initData(childGroup.childGroups, category);
            }
        });
    }
}
