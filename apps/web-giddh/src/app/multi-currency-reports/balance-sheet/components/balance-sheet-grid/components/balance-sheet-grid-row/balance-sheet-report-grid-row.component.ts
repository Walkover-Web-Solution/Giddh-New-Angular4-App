import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

@Component({
selector: '[balance-sheet-report-grid-row]',
    templateUrl: './balance-sheet-report-grid-row.component.html',
    styleUrls: [`./balance-sheet-report-grid-row.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BalanceSheetReportGridRowComponent implements OnChanges {
    /** Holds the details of the group */
    @Input() public groupDetail: ChildGroup;
    /** Holds the search query */
    @Input() public search: string;
    /** Holds the padding value for the row */
    @Input() public padding: string;
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
     * @returns {void}
     * @param {SimpleChanges} changes Changes detected in input properties
     * @memberof BalanceSheetReportGridRowComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.changeDetectionRef.detectChanges();
        }
        if (changes?.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.changeDetectionRef.detectChanges();
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
