import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetCogsResponse, ProfitLossData, ProfitLossDateRangeResponse, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ProfitLossProcessingHelper } from '../../shared/helpers/profit-loss-processing.helper';
import { ProfitLossGridComponent } from '../../financial-reports/components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';
import { prepareProfitLossData } from '../../store/tl-pl/tl-pl.reducer';
import { cloneDeep, filter, forEach, includes, keys } from '../../lodash-optimized';

@Component({
selector: 'profit-loss-report',
    templateUrl: './profit-loss-report.component.html',
    providers: [MultiCurrencyReportsComponentStore],
    standalone: false
})
export class ProfitLossReportComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Reference to the ProfitLossGridComponent */
    @ViewChild('plGrid', { static: true }) public plGrid: ProfitLossGridComponent;
    /** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Observable for show loader state */
    public showLoader: Observable<boolean> = this.componentStore.inProgressReport$;
    /** Holds the profit and loss data */
    public data: ProfitLossData;
    /** Holds the cost of goods sold data */
    public cogsData: ChildGroup;
    /** Request data for the profit-loss report */
    public request: ProfitLossRequest;
    /** Flag to control the expand/collapse state for all groups */
    public expandAll: boolean;
    /** Search string for filtering reports */
    public search: string;
    /** Subject used to track component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Last synchronization date */
    public lastSyncDate: string = "";

    constructor(private changeDetectionRef: ChangeDetectorRef, private componentStore: MultiCurrencyReportsComponentStore) {

    }

    /**
     * Initializes the component with report data from the store.
     *
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public ngOnInit(): void {
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {                
                let data = prepareProfitLossData(cloneDeep(response)) as ProfitLossData;
                let cogs;
                if (data && data.incomeStatement && data.incomeStatement.costOfGoodsSold) {
                    cogs = cloneDeep(data.incomeStatement.costOfGoodsSold) as ProfitLossDateRangeResponse<GetCogsResponse>;
                } else {
                    if (data && (data as any).cogs) {
                        this.cogsData = ProfitLossProcessingHelper.processCOGS((data as any).cogs, false);
                    }
                }

                if (data && data.expArr) {
                    this.initData(data.expArr, "expenses");
                    ProfitLossProcessingHelper.initializeIncomeExpenseData(data.expArr, "expenses");
                }
                if (data && data.incArr) {
                    this.initData(data.incArr, "income");
                    ProfitLossProcessingHelper.initializeIncomeExpenseData(data.incArr, "income");
                }

                if (data?.incomeStatement) {
                    ProfitLossProcessingHelper.processIncomeStatementAmounts(data.incomeStatement);
                }

                this.data = data;
            } else {
                this.data = null;
            }
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * This method initializes data recursively for child groups, accounts, and categories.
     *
     * @param {ChildGroup[]} d - The group data to be initialized.
     * @param {string} category - The category of the group (e.g., 'income', 'expenses').
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public initData(groupList: ChildGroup[], category: string): void {
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
            if (childGroup.childGroups) {
                this.initData(childGroup.childGroups, category);
            }
        });
    }

    /**
     * After view initialization, triggers change detection.
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public ngAfterViewInit(): void {
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Sets the last synchronization date based on the event value.
     *
     * @param {any} event - The synchronization date event.
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public lastDate(event: any): void {
        this.lastSyncDate = event;
    }

    /**
     * Filters the profit-loss data based on the provided request object.
     *
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public filterData(): void {
        this.componentStore.getMultiCurrencyReport(ReportType.PROFIT_LOSS);
    }

    /**
     * Handles the search event and triggers report creation based on the event.
     *
     * @param {any} event - The search event object.
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public searchData(event: any): void {
        this.componentStore.createMultiCurrencyReport({ reportType: ReportType.PROFIT_LOSS, payload: event });
    }

    /**
     * Cleanup and resource release during component destruction.
     * 
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Expands all groups in the report.
     *
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public expandAllEvent(): void {
        setTimeout(() => {
            this.changeDetectionRef.detectChanges();
        }, 1);
    }

    /**
     * Handles changes in the search input and updates the state accordingly.
     *
     * @param {string} event - The search string input.
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public searchChanged(event: string): void {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.changeDetectionRef.detectChanges();
    }
}
