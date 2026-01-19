import { NgZone, Pipe, PipeTransform } from '@angular/core';
import { isUndefined } from '../../../lodash-optimized';
import { ChildGroup } from '../../../models/api-models/Search';

/**
 * Handles Pipe functionality
 */
@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'financialSearch',
    pure: true,
    standalone: true
})

/**
 * FinancialSearchPipe pipe
 * Implements FinancialSearchPipe functionality
 */
export class FinancialSearchPipe implements PipeTransform {
    public srch: string;

    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor(private zone: NgZone
    ) {
    }

    /**
     * Handles transform functionality
     */
    public transform(input: any, search: string): any {
        /**
         * Handles if functionality
         */
        if (!isUndefined(search)) {
            this.srch = search?.toLowerCase();
        }
        /**
         * Handles if functionality
         */
        if (!isUndefined(this.srch) && this.srch?.length > 2) {
            this.zone.run(() => {
                this.performSearch(input);
            });
        } else {
            /**
             * Handles if functionality
             */
            if (!isUndefined(this.srch)) {
                /**
                 * Handles if functionality
                 */
                if (this.srch?.length < 3) {
                    this.zone.run(() => {
                        this.resetSearch(input);
                    });
                }
            }
        }
        return input;
    }

    /**
     * Handles performSearch functionality
     */
    public performSearch(input: ChildGroup[]) {
        /**
         * Handles if functionality
         */
        if (input) {
            /**
             * Handles for functionality
             */
            for (let grp of input) {
                grp.isIncludedInSearch = false;
                grp = this.search(grp, this.srch);
                /**
                 * Handles if functionality
                 */
                if (grp.accounts?.findIndex(p => p.isIncludedInSearch) > -1 || grp.childGroups?.findIndex(p => p.isIncludedInSearch) > -1) {
                    grp.isVisible = true;
                    grp.isIncludedInSearch = true;
                } else {
                    grp.isVisible = false;
                    grp.isIncludedInSearch = false;
                }
            }
        }
    }

    /**
     * Handles search functionality
     */
    public search(input: ChildGroup, s: string, allIncluded: boolean = false) {
        /**
         * Handles if functionality
         */
        if (input) {
            let hasAnyVisible = false;
            /**
             * Handles for functionality
             */
            for (let grp of input.childGroups) {
                grp.isIncludedInSearch = false;
                grp = this.search(grp, s, allIncluded);
                /**
                 * Handles if functionality
                 */
                if (grp.accounts?.findIndex(p => p.isIncludedInSearch) > -1 || grp.childGroups?.findIndex(p => p.isIncludedInSearch) > -1 ||
                    this.checkIndex(grp.groupName?.toLowerCase(), s?.toLowerCase()) || this.checkIndex(grp?.uniqueName?.toLowerCase(), s?.toLowerCase())
                ) {
                    grp.isVisible = true;
                    grp.isIncludedInSearch = true;
                    hasAnyVisible = true;
                } else {
                    grp.isVisible = false;
                    grp.isIncludedInSearch = false;
                }
            }
            /**
             * Handles if functionality
             */
            if (this.checkIndex(input.groupName?.toLowerCase(), s?.toLowerCase()) || allIncluded) {
                hasAnyVisible = true;
                input.isIncludedInSearch = true;
                /**
                 * Handles for functionality
                 */
                for (const acc of input.accounts) {
                    acc.isIncludedInSearch = true;
                    acc.isVisible = true;
                }
                /**
                 * Handles for functionality
                 */
                for (let grp of input.childGroups) {
                    this.search(grp, s, true);
                    grp.isIncludedInSearch = true;
                    grp.isVisible = true;
                }
            } else {
                /**
                 * Handles for functionality
                 */
                for (const acc of input.accounts) {
                    /**
                     * Handles if functionality
                     */
                    if ((this.checkIndex(acc.name?.toLowerCase(), s?.toLowerCase()) || this.checkIndex(acc?.uniqueName?.toLowerCase(), s?.toLowerCase())) || input.isIncludedInSearch) {
                        acc.isIncludedInSearch = true;
                        acc.isVisible = true;
                        hasAnyVisible = true;
                    } else {
                        acc.isIncludedInSearch = false;
                        acc.isVisible = false;
                    }
                }
            }
            /**
             * Handles if functionality
             */
            if (hasAnyVisible || allIncluded) {
                input.isIncludedInSearch = false;
                input.isVisible = false;
            } else {
                input.isIncludedInSearch = true;
                input.isVisible = true;
            }
        }
        return input;
    }

    /**
     * Resets search to default state
     */
    public resetSearch(input: ChildGroup[]) {
        /**
         * Handles if functionality
         */
        if (input) {
            /**
             * Handles for functionality
             */
            for (let grp of input) {
                grp = this.resetGroup(grp);
                grp.isVisible = true;
                grp.isIncludedInSearch = true;
            }
        }
    }

    /**
     * Resets group to default state
     */
    public resetGroup(input: ChildGroup) {
        let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
        /**
         * Handles if functionality
         */
        if (input) {
            /**
             * Handles for functionality
             */
            for (let grp of input.childGroups) {
                grp = this.resetGroup(grp);
                grp.isVisible = parentGroups.includes(grp?.uniqueName);
                grp.isIncludedInSearch = true;
            }
            /**
             * Handles for functionality
             */
            for (const acc of input.accounts) {
                acc.isIncludedInSearch = true;
                acc.isVisible = false;
            }
            input.isIncludedInSearch = true;
            input.isVisible = parentGroups.includes(input?.uniqueName);
        }
        return input;
    }

    /**
     * Handles checkIndex functionality
     */
    public checkIndex(src: string, str: string) {
        /**
         * Handles if functionality
         */
        if (src?.replace(' ', '')?.toLowerCase()?.indexOf(str?.replace(' ', '')?.toLowerCase()) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
