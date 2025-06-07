import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    TRIAL_BALANCE_VIEWPORT_LIMIT,
} from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

@Component({
    selector: '[profit-loss-report-grid-row]',
    templateUrl: './profit-loss-report-grid-row.component.html',
    styleUrls: ['./profit-loss-report-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfitLossReportGridRowComponent implements OnChanges {
    /** Holds the group detail data for a specific child group in the report */
    @Input() public groupDetail: ChildGroup;
    /** Search string used for filtering the profit and loss data */
    @Input() public search: string;
    /** Padding value applied to elements in the component */
    @Input() public padding: string;
    /** Holds the income statement data for the profit and loss report */
    @Input() public incomeStatement: any;
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
    }

    /**
     * Detects changes in the groupDetail and search inputs, triggering change detection when a change occurs.
     * 
     * @returns {void}
     * @param {SimpleChanges} changes - The changes to the input properties.
     * @memberof ProfitLossReportGridComponent
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
     * Track by function for profit loss item
     *
     * @param {number} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof ProfitLossGridRowComponent
     */
    public trackByFn(index: number, item: Account): string {
        return item?.uniqueName;
    }
}
