import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
    TRIAL_BALANCE_VIEWPORT_LIMIT,
} from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

@Component({
    selector: '[profit-loss-grid-row]',
    templateUrl: './profit-loss-grid-row.component.html',
    styleUrls: ['./profit-loss-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfitLossGridRowComponent implements OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /** Hold current url */
    private currentUrl: string = "";

    constructor(private cd: ChangeDetectorRef, private router: Router) {
        this.currentUrl = this.router.url;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    /**
     *  This will be redirect to ledger
     *
     * @param {*} acc
     * @return {*}  {void}
     * @memberof ProfitLossGridRowComponent
     */
    public entryClicked(acc: any): void {
        if (!acc?.uniqueName) return;

        // Base return URL
        const returnUrl = `ledger/${acc.uniqueName}/${this.from}/${this.to}`;
        const encodedRedirectUrl = encodeURIComponent(this.currentUrl);

        let url = `${location.origin}${location.pathname}?returnUrl=${returnUrl}&redirectUrl=${encodedRedirectUrl}`;

        if (isElectron) {
            const ipcRenderer = (window as any).require('electron').ipcRenderer;
            const electronUrl = `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
            ipcRenderer.send('open-url', electronUrl);
        } else {
            (window as any).open(url, '_blank');
        }
    }

    /**
     * Track by function for profit loss item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof ProfitLossGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Get the keys of an object
     * @param obj - The object to get the keys of
     * @returns The keys of the object
     */
    public getKeys(obj): string[] | [] {
        if (obj) {
            return Object.keys(obj);
        } else {
            return [];
        }
    }
}
