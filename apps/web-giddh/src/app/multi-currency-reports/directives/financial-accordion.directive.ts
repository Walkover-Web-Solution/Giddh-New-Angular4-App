import { Directive, HostListener, Input } from '@angular/core';

import { Account, ChildGroup } from '../../models/api-models/Search';
import { forEach } from '../../lodash-optimized';

@Directive({
    selector: '[financial-accordion]',
    standalone: false
})
export class FinancialAccordionDirective {
    // tslint:disable-next-line:no-input-rename
    @Input('financial-accordion') public data: ChildGroup;

    // tslint:disable-next-line:no-input-rename
    constructor() {
        
    }

    @HostListener('click')
    public onClick() {
        let isChildVisible: boolean = false;
        if (this.data.level1 && this.data.isOpen) {
            return;
        }
        if (this.data.accounts) {
            this.data.accounts.forEach((account: Account) => {
                if (account.isIncludedInSearch) {
                    account.isVisible = !account.isVisible;
                    isChildVisible = account.isVisible;
                }
            });
        }
        if (this.data.childGroups) {
            this.data.childGroups.forEach((account: ChildGroup) => {
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
