import { Pipe, PipeTransform } from '@angular/core';
import { cloneDeep, each, isUndefined } from '../../../lodash-optimized';

/**
 * Handles Pipe functionality
 */
@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'grpsrch',
    pure: true,
    standalone: false
})

/**
 * AccountFilterPipe pipe
 * Implements AccountFilterPipe functionality
 */
export class AccountFilterPipe implements PipeTransform {
    public srch: string;

    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }

    /**
     * Handles transform functionality
     */
    public transform(input: any, search: string): any {
        input = cloneDeep(input);
        /**
         * Handles if functionality
         */
        if (!isUndefined(search)) {
            this.srch = search?.toLowerCase();
        }

        /**
         * Handles if functionality
         */
        if (!isUndefined(this.srch)) {
            this.performSearch(input);
            /**
             * Handles if functionality
             */
            if (this.srch?.length < 2) {
                this.resetSearch(input);
            }
        }
        return input;
    }

    /**
     * Handles performSearch functionality
     */
    public performSearch(input) {
        return each(input, (grp: any) => {
            let grpName;
            let grpUnq;
            grpName = grp?.name?.toLowerCase();
            grpUnq = grp?.uniqueName?.toLowerCase();
            /**
             * Handles if functionality
             */
            if (!this.checkIndex(grpName, this.srch) && !this.checkIndex(grpUnq, this.srch)) {
                grp.isVisible = false;
                /**
                 * Handles if functionality
                 */
                if (grp.groups?.length > 0) {
                    return each(grp.groups, (sub: any) => {
                        let subName;
                        let subUnq;
                        subName = sub?.name?.toLowerCase();
                        subUnq = sub?.uniqueName?.toLowerCase();
                        /**
                         * Handles if functionality
                         */
                        if (!this.checkIndex(subName, this.srch) && !this.checkIndex(subUnq, this.srch)) {
                            sub.isVisible = false;
                            /**
                             * Handles if functionality
                             */
                            if (sub.groups?.length) {
                                return each(sub.groups, (child: any) => {
                                    let childName;
                                    let childUnq;
                                    childName = child?.name?.toLowerCase();
                                    childUnq = child?.uniqueName?.toLowerCase();
                                    /**
                                     * Handles if functionality
                                     */
                                    if (!this.checkIndex(childName, this.srch) && !this.checkIndex(childUnq, this.srch)) {
                                        child.isVisible = false;
                                        /**
                                         * Handles if functionality
                                         */
                                        if (child.groups?.length > 0) {
                                            return each(child.groups, (subChild: any) => {
                                                let subChildName;
                                                let subChildUnq;
                                                subChildName = subChild?.name?.toLowerCase();
                                                subChildUnq = subChild?.uniqueName?.toLowerCase();
                                                /**
                                                 * Handles if functionality
                                                 */
                                                if (!this.checkIndex(subChildName, this.srch) && !this.checkIndex(subChildUnq, this.srch)) {
                                                    subChild.isVisible = false;
                                                    /**
                                                     * Handles if functionality
                                                     */
                                                    if (subChild.groups?.length > 0) {
                                                        return each(child.groups, (subChild2: any) => {
                                                            let subChild2Name;
                                                            let subChild2Unq;
                                                            subChild2Name = subChild2?.name?.toLowerCase();
                                                            subChild2Unq = subChild2?.uniqueName?.toLowerCase();
                                                            /**
                                                             * Handles if functionality
                                                             */
                                                            if (!this.checkIndex(subChild2Name, this.srch) && !this.checkIndex(subChild2Unq, this.srch)) {
                                                                subChild2.isVisible = false;
                                                                /**
                                                                 * Handles if functionality
                                                                 */
                                                                if (subChild2.groups?.length > 0) {
                                                                    return this.performSearch(subChild.groups);
                                                                }
                                                            } else {
                                                                grp.isVisible = true;
                                                                child.isVisible = true;
                                                                sub.isVisible = true;
                                                                subChild.isVisible = true;
                                                                return subChild2.isVisible = true;
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    grp.isVisible = true;
                                                    child.isVisible = true;
                                                    sub.isVisible = true;
                                                    return subChild.isVisible = true;
                                                }
                                            });
                                        }
                                    } else if (this.checkIndex(childName, this.srch) || this.checkIndex(childUnq, this.srch)) {
                                        grp.isVisible = true;
                                        child.isVisible = true;
                                        return sub.isVisible = true;
                                    }
                                });
                            }
                        } else if (this.checkIndex(subName, this.srch) || this.checkIndex(subUnq, this.srch)) {
                            grp.isVisible = true;
                            return sub.isVisible = true;
                        }
                    });
                }
            } else if (this.checkIndex(grpName, this.srch) || this.checkIndex(grpUnq, this.srch)) {
                return grp.isVisible = true;
            }
        });
    }

    /**
     * Resets search to default state
     */
    public resetSearch(input) {
        return each(input, (grp: any) => {
            grp.isVisible = true;
            /**
             * Handles if functionality
             */
            if (grp.groups?.length > 0) {
                return each(grp.groups, (sub: any) => {
                    sub.isVisible = true;
                    /**
                     * Handles if functionality
                     */
                    if (sub.groups?.length > 0) {
                        return this.resetSearch(sub.groups);
                    }
                });
            }
        });
    }

    /**
     * Handles checkIndex functionality
     */
    public checkIndex(src, str) {
        /**
         * Handles if functionality
         */
        if (src?.indexOf(str) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
