import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetCogsResponse, ProfitLossData, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ProfitLossGridComponent } from '../../financial-reports/components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
import { cloneDeep } from '../../lodash-optimized';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';
import { prepareProfitLossData } from '../../store/tl-pl/tl-pl.reducer';


@Component({
    selector: 'profit-loss-report',
    templateUrl: './profit-loss-report.component.html',
    providers: [MultiCurrencyReportsComponentStore]
})
export class ProfitLossReportComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Reference to the ProfitLossGridComponent */
    @ViewChild('plGrid', { static: true }) public plGrid: ProfitLossGridComponent;/** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Start date of the selected financial year */
    public from: string;
    /** End date of the selected financial year */
    public to: string;
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
     * @memberof ProfitLossReportComponent
     */
    public ngOnInit() {
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                let data = prepareProfitLossData(cloneDeep(response)) as ProfitLossData;
                let cogs;
                if (data && data.incomeStatment && data.incomeStatment.costOfGoodsSold) {
                    cogs = cloneDeep(data.incomeStatment.costOfGoodsSold) as GetCogsResponse;
                } else {
                    cogs = null;
                }

                if (cogs) {
                    let cogsGrp: ChildGroup = new ChildGroup();
                    cogsGrp.isCreated = true;
                    cogsGrp.isVisible = true;
                    cogsGrp.isIncludedInSearch = true;
                    cogsGrp.isOpen = false;
                    cogsGrp.level1 = false;
                    cogsGrp.uniqueName = 'cogs';
                    cogsGrp.groupName = 'Less: Cost of Goods Sold';
                    cogsGrp.closingBalance = {
                        amount: cogs.cogs,
                        type: 'DEBIT'
                    };
                    cogsGrp.accounts = [];
                    cogsGrp.childGroups = [];

                    Object.keys(cogs)?.filter(f => ['openingInventory', 'closingInventory', 'purchasesStockAmount', 'manufacturingExpenses', 'debitNoteStockAmount'].includes(f)).forEach(f => {
                        let childGroup = new ChildGroup();
                        childGroup.isCreated = false;
                        childGroup.isVisible = false;
                        childGroup.isIncludedInSearch = true;
                        childGroup.isOpen = false;
                        childGroup.uniqueName = f;
                        childGroup.groupName = (f) ? f?.replace(/([a-z0-9])([A-Z])/g, '$1 $2') : "";
                        childGroup.category = f === 'income';
                        childGroup.closingBalance = {
                            amount: cogs[f],
                            type: 'CREDIT'
                        };
                        childGroup.accounts = [];
                        childGroup.childGroups = [];
                        if (['purchasesStockAmount', 'manufacturingExpenses'].includes(f)) {
                            childGroup.groupName = `+ ${childGroup.groupName}`;
                        } else if (['closingInventory', 'debitNoteStockAmount'].includes(f)) {
                            childGroup.groupName = `- ${childGroup.groupName}`;
                        }
                        cogsGrp.childGroups.push(childGroup);
                    });

                    this.cogsData = cogsGrp;
                }

                if (data && data.expArr) {
                    this.initData(data.expArr, "expenses");
                    data.expArr.forEach(group => {
                        group.category = "expenses";
                        group.isVisible = true;
                        group.isCreated = true;
                        group.isIncludedInSearch = true;
                        group.isOpen = true;
                        group.childGroups.forEach(childGroups => {
                            childGroups.category = "expenses";
                            childGroups.isVisible = true;
                            childGroups.isCreated = true;
                            childGroups.isIncludedInSearch = true;
                        });
                    });
                }
                if (data && data.incArr) {
                    this.initData(data.incArr, "income");
                    data.incArr.forEach(group => {
                        group.category = "income";
                        group.isVisible = true;
                        group.isCreated = true;
                        group.isIncludedInSearch = true;
                        group.isOpen = true;
                        group.childGroups.forEach(childGroups => {
                            childGroups.category = "income";
                            childGroups.isVisible = true;
                            childGroups.isCreated = true;
                            childGroups.isIncludedInSearch = true;
                        });
                    });
                }

                if (data?.incomeStatment?.grossProfit?.type === "DEBIT" && data.incomeStatment.grossProfit.amount) {
                    data.incomeStatment.grossProfit.amount = "-" + data.incomeStatment.grossProfit.amount;
                }

                if (data?.incomeStatment?.operatingProfit?.type === "DEBIT" && data.incomeStatment.operatingProfit.amount) {
                    data.incomeStatment.operatingProfit.amount = "-" + data.incomeStatment.operatingProfit.amount;
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
        groupList.forEach((childGroup: ChildGroup) => {
            childGroup.category = category;
            childGroup.isVisible = false;
            childGroup.isCreated = false;
            childGroup.isIncludedInSearch = true;
            childGroup.accounts.forEach((account: Account) => {
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
     * @param {*} event - The synchronization date event.
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
        this.componentStore.getMultiCurrencyReport(ReportType.ProfitLoss);
    }

    /**
     * Handles the search event and triggers report creation based on the event.
     *
     * @param {*} event - The search event object.
     * @returns {void}
     * @memberof ProfitLossReportComponent
     */
    public searchData(event: any): void {
        this.componentStore.creatMultiCurrencyReport({ reportType: ReportType.BalanceSheet, payload: event });
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
     * Finds the index of the active financial year from the list of financial years.
     *
     * @param {any} activeFY - The currently active financial year.
     * @param {any} financialYears - The list of available financial years.
     * @return {number} - The index of the active financial year.
     * @memberof ProfitLossReportComponent
     */
    public findIndex(activeFY: any, financialYears: any): number {
        let tempFYIndex = 0;
        financialYears.forEach((fy: any, index: number) => {
            if (fy?.uniqueName === activeFY?.uniqueName) {
                if (index === 0) {
                    tempFYIndex = index;
                } else {
                    tempFYIndex = index * -1;
                }
            }
        });
        return tempFYIndex;
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
