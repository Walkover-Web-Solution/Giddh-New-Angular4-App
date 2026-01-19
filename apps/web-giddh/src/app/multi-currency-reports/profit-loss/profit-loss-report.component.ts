import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetCogsResponse, ProfitLossData, ProfitLossDateRangeResponse, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ProfitLossGridComponent } from '../../financial-reports/components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';
import { prepareProfitLossData } from '../../store/tl-pl/tl-pl.reducer';
import { cloneDeep, filter, forEach, includes, keys } from '../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
selector: 'profit-loss-report',
    templateUrl: './profit-loss-report.component.html',
    providers: [MultiCurrencyReportsComponentStore],
    standalone: false
})
/**
 * ProfitLossReportComponent component
 * Handles profitlossreport functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
            /**
             * Handles if functionality
             */
            if (response) {                
                let data = prepareProfitLossData(cloneDeep(response)) as ProfitLossData;
                let cogs;
                /**
                 * Handles if functionality
                 */
                if (data && data.incomeStatement && data.incomeStatement.costOfGoodsSold) {
                    cogs = cloneDeep(data.incomeStatement.costOfGoodsSold) as ProfitLossDateRangeResponse<GetCogsResponse>;
                } else {
                    cogs = null;
                }

                /**
                 * Handles if functionality
                 */
                if (cogs) {
                    let cogsGrp: ChildGroup = new ChildGroup();
                    cogsGrp.isCreated = true;
                    cogsGrp.level1 = true;
                    cogsGrp.isVisible = true;
                    cogsGrp.isIncludedInSearch = true;
                    cogsGrp.isOpen = false;
                    cogsGrp.uniqueName = 'cogs';
                    cogsGrp.groupName = 'Less: Cost of Goods Sold';
                    cogsGrp.closingBalance = Object.keys(cogs).reduce((acc, key) => {
                        acc[key] = {
                            amount: cogs[key].cogs,
                            type: 'DEBIT'
                        };
                        return acc;
                    }, {});
                    cogsGrp.accounts = [];
                    cogsGrp.childGroups = [];

                    Object.keys(cogs).forEach((cogsKey, i) => {
                        /**
                         * Handles if functionality
                         */
                        if (i === 0) {
                            Object.keys(cogs[cogsKey])?.filter(data => ['openingInventory', 'closingInventory', 'purchasesStockAmount', 'manufacturingExpenses', 'debitNoteStockAmount'].includes(data)).forEach(item => {
                                let childGroup = new ChildGroup();
                                childGroup.isCreated = false;
                                childGroup.isSelfCreatedGroup = true;
                                childGroup.isVisible = false;
                                childGroup.isIncludedInSearch = true;
                                childGroup.isOpen = false;
                                childGroup.uniqueName = item;
                                childGroup.groupName = (item) ? item?.replace(/([a-z0-9])([A-Z])/g, '$1 $2') : "";
                                childGroup.category = item === 'income';
                                childGroup.closingBalance = Object.keys(cogs).reduce((acc, key) => {
                                    acc[key] = {
                                        amount: cogs[key][item],
                                        type: 'CREDIT'
                                    };
                                    return acc;
                                }, {});
                                childGroup.accounts = [];
                                childGroup.childGroups = [];
                                /**
                                 * Handles if functionality
                                 */
                                if (['purchasesStockAmount', 'manufacturingExpenses'].includes(item)) {
                                childGroup.groupName = `+ ${childGroup.groupName}`;
                                } else if (['closingInventory', 'debitNoteStockAmount'].includes(item)) {
                                    childGroup.groupName = `- ${childGroup.groupName}`;
                                }
                                cogsGrp.childGroups.push(childGroup);
                            });
                        }
                    });

                    this.cogsData = cogsGrp;
                }

                /**
                 * Handles if functionality
                 */
                if (data && data.expArr) {
                    this.initData(data.expArr, "expenses");
                    (Array.isArray(data.expArr) ? data.expArr : []).forEach(group => {
                        group.category = "expenses";
                        group.isVisible = true;
                        group.isCreated = true;
                        group.isIncludedInSearch = true;
                        group.isOpen = true;
                        (Array.isArray(group.childGroups) ? group.childGroups : []).forEach(childGroups => {
                            childGroups.category = "expenses";
                            childGroups.isVisible = true;
                            childGroups.isCreated = true;
                            childGroups.isIncludedInSearch = true;
                        });
                    });
                }
                /**
                 * Handles if functionality
                 */
                if (data && data.incArr) {
                    this.initData(data.incArr, "income");
                    (Array.isArray(data.incArr) ? data.incArr : []).forEach(group => {
                        group.category = "income";
                        group.isVisible = true;
                        group.isCreated = true;
                        group.isIncludedInSearch = true;
                        group.isOpen = true;
                        (Array.isArray(group.childGroups) ? group.childGroups : []).forEach(childGroups => {
                            childGroups.category = "income";
                            childGroups.isVisible = true;
                            childGroups.isCreated = true;
                            childGroups.isIncludedInSearch = true;
                        });
                    });
                }

                /**
                 * Handles if functionality
                 */
                if (data?.incomeStatement?.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]]?.type === "DEBIT" && data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount) {
                    data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount = "-" + data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount;
                }

                /**
                 * Handles if functionality
                 */
                if (data?.incomeStatement?.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]]?.type === "DEBIT" && data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount) {
                    data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount = "-" + data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount;
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
            /**
             * Handles if functionality
             */
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
        /**
         * Sets timeout value
         */
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
        /**
         * Handles if functionality
         */
        if (!this.search) {
            this.expandAll = false;
        }
        this.changeDetectionRef.detectChanges();
    }
}
