import { Directive, HostListener, Input } from '@angular/core';

import { Account, ChildGroup } from '../../models/api-models/Search';
import { forEach } from '../../lodash-optimized';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[financial-accordion]',
    standalone: false
})
/**
 * FinancialAccordionDirective directive
 * Implements FinancialAccordionDirective functionality
 */
export class FinancialAccordionDirective {
    // tslint:disable-next-line:no-input-rename
    @Input('financial-accordion') public data: ChildGroup;

    // tslint:disable-next-line:no-input-rename
    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        
    }

    @HostListener('click')
    /**
     * Handles click event
     */
    public onClick() {
        let isChildVisible: boolean = false;
        /**
         * Handles if functionality
         */
        if (this.data.level1 && this.data.isOpen) {
            return;
        }
        /**
         * Handles if functionality
         */
        if (this.data.accounts) {
            (Array.isArray(this.data.accounts) ? this.data.accounts : []).forEach((account: Account) => {
                /**
                 * Handles if functionality
                 */
                if (account.isIncludedInSearch) {
                    account.isVisible = !account.isVisible;
                    isChildVisible = account.isVisible;
                }
            });
        }
        /**
         * Handles if functionality
         */
        if (this.data.childGroups) {
            (Array.isArray(this.data.childGroups) ? this.data.childGroups : []).forEach((account: ChildGroup) => {
                /**
                 * Handles if functionality
                 */
                if (account.isIncludedInSearch) {
                    account.isVisible = !account.isVisible;
                    isChildVisible = account.isVisible;
                    account.isOpen = false;
                }
            });
        }
        this.data.isVisible = true;
        this.data.isOpen = isChildVisible;
    }
}
