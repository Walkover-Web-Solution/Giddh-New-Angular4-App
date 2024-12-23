import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

@Component({
    selector: '[balance-sheet-report-grid-row]',
    templateUrl: './balance-sheet-report-grid-row.component.html',
    styleUrls: [`./balance-sheet-report-grid-row.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceSheetReportGridRowComponent implements OnChanges {
    /** Holds the details of the group */
    @Input() public groupDetail: ChildGroup;
    /** Holds the search query */
    @Input() public search: string;
    /** Holds the padding value for the row */
    @Input() public padding: string;
    /** Start date for the data range */
    @Input() public from: string = '';
    /** End date for the data range */
    @Input() public to: string = '';
    /** Indicates if all items should be expanded */
    @Input() public expandAll: boolean;
    /** Minimum limit at which the Trial Balance viewport is enabled */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** Indicates if expand-all is toggled during a search */
    @Input() public isExpandToggledDuringSearch: boolean;


    constructor(private changeDetectionRef: ChangeDetectorRef) {
    }

    /**
     * Lifecycle hook called when input properties change
     *
     * @param {SimpleChanges} changes Changes detected in input properties
     * @memberof BalanceSheetReportGridRowComponent
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes?.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.changeDetectionRef.detectChanges();
        }
        if (changes?.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * Handles the click event on an entry and navigates to the corresponding ledger page
     *
     * @param {Account} acc The account object clicked
     * @memberof BalanceSheetReportGridRowComponent
     */
    public entryClicked(acc) {
        let url = location.href + '?returnUrl=ledger/' + acc?.uniqueName + '/' + this.from + '/' + this.to;
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = `${location.origin}${location.pathname}#./pages/ledger/${encodeURIComponent(acc?.uniqueName)}/${encodeURIComponent(this.from)}/${encodeURIComponent(this.to)}`;
            ipcRenderer.send('open-url', url)
        } else {
            (window as any).open(url);
        }

    }


    /**
     * Track by function for balance sheet item to optimize DOM rendering
     *
     * @param {number} index The index of the current item
     * @param {Account} item The account item
     * @return {string} The unique name of the item
     * @memberof BalanceSheetReportGridRowComponent
     */
    public trackByFn(index: number, item: Account): string {
        return item?.uniqueName;
    }
}
