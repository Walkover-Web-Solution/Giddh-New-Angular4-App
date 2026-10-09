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
    constructor() {}

    @HostListener('click')
    public onClick() {
        let isChildVisible: boolean = false;
        if (this.data.level1 && this.data.isOpen) {
            return;
        }
        if (this.data.accounts) {
            (Array.isArray(this.data.accounts) ? this.data.accounts : []).forEach((p: Account) => {
                if (p.isIncludedInSearch) {
                    p.isVisible = !p.isVisible;
                    isChildVisible = p.isVisible;
                }
            });
        }
        if (this.data.childGroups) {
            (Array.isArray(this.data.childGroups) ? this.data.childGroups : []).forEach((p: ChildGroup) => {
                if (p.isIncludedInSearch) {
                    p.isVisible = !p.isVisible;
                    isChildVisible = p.isVisible;
                    p.isOpen = false;
                }
            });
        }
        this.data.isVisible = true;
        this.data.isOpen = isChildVisible;
    }
}
