import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyResponse } from '../../models/api-models/Company';
import { GetCogsResponse, ProfitLossData, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ProfitLossGridComponent } from '../../financial-reports/components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
import { AppState } from '../../store';
import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { ToasterService } from '../../services/toaster.service';
import { cloneDeep, each } from '../../lodash-optimized';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';
import { prepareProfitLossData } from '../../store/tl-pl/tl-pl.reducer';


@Component({
    selector: 'profit-loss-report',
    templateUrl: './profit-loss-report.component.html',
    providers: [MultiCurrencyReportsComponentStore]
})
export class ProfitLossReportComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Start date of the selected financial year */
    public from: string;
    /** End date of the selected financial year */
    public to: string;
    /** Getter for the selected company */
    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }
    /** Observable for show loader state */
    public showLoader: Observable<boolean>;
    /** Holds the profit and loss data */
    public data: ProfitLossData;
    /** Holds the cost of goods sold data */
    public cogsData: ChildGroup;
    /** Request data for the profit-loss report */
    public request: ProfitLossRequest;
    /** Flag to control the expand/collapse state for all groups */
    public expandAll: boolean;
    /** Flag to indicate if a date has been selected */
    @Input() public isDateSelected: boolean = false;
    /** Search string for filtering reports */
    public search: string;
    /** Reference to the ProfitLossGridComponent */
    @ViewChild('plGrid', { static: true }) public plGrid: ProfitLossGridComponent;
    /** Subject used to track component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the selected company data */
    private _selectedCompany: CompanyResponse;
    /** Last synchronization date */
    public lastSyncDate: string = "";

    /**
     * set company and fetch data
     *
     * @memberof ProfitLossComponent
     */
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && !this.isDateSelected) {

            let index = this.findIndex(value.activeFinancialYear, value.financialYears);
            this.request = {
                refresh: false,
                fy: index,
                from: value.activeFinancialYear.financialYearStarts,
                to: value.activeFinancialYear.financialYearEnds
            };
        }
    }

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private toaster: ToasterService, private componentStore: MultiCurrencyReportsComponentStore) {
        this.showLoader = this.componentStore.inProgressReport$;
    }

    /**
     * Initializes the component with report data from the store.
     *
     * @memberof ProfitLossReportComponent
     */
    public ngOnInit() {
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                let data = cloneDeep(prepareProfitLossData(p)) as ProfitLossData;
                let cogs;
                if (data && data.incomeStatment && data.incomeStatment.costOfGoodsSold) {
                    cogs = cloneDeep(data.incomeStatment.costOfGoodsSold) as GetCogsResponse;
                } else {
                    cogs = null;
                }

                if (data && data.message) {
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(data.message);
                    }, 100);
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
                        let cg = new ChildGroup();
                        cg.isCreated = false;
                        cg.isVisible = false;
                        cg.isIncludedInSearch = true;
                        cg.isOpen = false;
                        cg.uniqueName = f;
                        cg.groupName = (f) ? f?.replace(/([a-z0-9])([A-Z])/g, '$1 $2') : "";
                        cg.category = f === 'income';
                        cg.closingBalance = {
                            amount: cogs[f],
                            type: 'CREDIT'
                        };
                        cg.accounts = [];
                        cg.childGroups = [];
                        if (['purchasesStockAmount', 'manufacturingExpenses'].includes(f)) {
                            cg.groupName = `+ ${cg.groupName}`;
                        } else if (['closingInventory', 'debitNoteStockAmount'].includes(f)) {
                            cg.groupName = `- ${cg.groupName}`;
                        }
                        cogsGrp.childGroups.push(cg);
                    });

                    this.cogsData = cogsGrp;
                }

                if (data && data.expArr) {
                    this.InitData(data.expArr, "expenses");
                    data.expArr.forEach(g => {
                        g.category = "expenses";
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                        g.isOpen = true;
                        g.childGroups.forEach(c => {
                            c.category = "expenses";
                            c.isVisible = true;
                            c.isCreated = true;
                            c.isIncludedInSearch = true;
                        });
                    });
                }
                if (data && data.incArr) {
                    this.InitData(data.incArr, "income");
                    data.incArr.forEach(g => {
                        g.category = "income";
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                        g.isOpen = true;
                        g.childGroups.forEach(c => {
                            c.category = "income";
                            c.isVisible = true;
                            c.isCreated = true;
                            c.isIncludedInSearch = true;
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
            this.cd.detectChanges();
        });
    }

    /**
     * This method initializes data recursively for child groups, accounts, and categories.
     *
     * @param {ChildGroup[]} d - The group data to be initialized.
     * @param {string} category - The category of the group (e.g., 'income', 'expenses').
     * @memberof ProfitLossReportComponent
     */
    public InitData(d: ChildGroup[], category: string) {
        each(d, (grp: ChildGroup) => {
            grp.category = category;
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            each(grp.accounts, (acc: Account) => {
                acc.isIncludedInSearch = true;
                acc.isCreated = false;
                acc.isVisible = false;
                acc.category = category;
            });
            if (grp.childGroups) {
                this.InitData(grp.childGroups, category);
            }
        });
    }

    /**
     * After view initialization, triggers change detection.
     *
     * @memberof ProfitLossReportComponent
     */
    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * Sets the last synchronization date based on the event value.
     *
     * @param {*} event - The synchronization date event.
     * @memberof ProfitLossReportComponent
     */
    public lastDate(event: any){
        this.lastSyncDate = (event) ;
    }

    /**
     * Filters the profit-loss data based on the provided request object.
     *
     * @param {ProfitLossRequest} request - The request object containing filter criteria.
     * @memberof ProfitLossReportComponent
     */
    public filterData(request: ProfitLossRequest) {
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        if (this.isDateSelected) {
            delete request['selectedFinancialYearOption'];
        }
        if (!request.tagName) {
            delete request.tagName;
        }
        this.componentStore.getMultiCurrencyReport(ReportType.ProfitLoss);
    }

    /**
     * Handles the search event and triggers report creation based on the event.
     *
     * @param {*} event - The search event object.
     * @memberof ProfitLossReportComponent
     */
    public searchData(event: any) {
        this.componentStore.creatMultiCurrencyReport({ reportType: ReportType.BalanceSheet, payload: event });
    }

    /**
     * Cleanup and resource release during component destruction.
     *
     * @memberof ProfitLossReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    /**
     * Finds the index of the active financial year from the list of financial years.
     *
     * @param {*} activeFY - The currently active financial year.
     * @param {*} financialYears - The list of available financial years.
     * @return {number} - The index of the active financial year.
     * @memberof ProfitLossReportComponent
     */
    public findIndex(activeFY, financialYears) {
        let tempFYIndex = 0;
        each(financialYears, (fy: any, index: number) => {
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
     * @memberof ProfitLossReportComponent
     */
    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    /**
     * Handles changes in the search input and updates the state accordingly.
     *
     * @param {string} event - The search string input.
     * @memberof ProfitLossReportComponent
     */
    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }
}
