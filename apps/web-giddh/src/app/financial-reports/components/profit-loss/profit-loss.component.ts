import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { CompanyResponse } from '../../../models/api-models/Company';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { GetCogsResponse, ProfitLossData, ProfitLossDateRangeResponse, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { ProfitLossGridComponent } from './components/profit-loss-grid/profit-loss-grid.component';
import { ProjectWiseAccountingComponentStore } from '../../../project-wise-accounting/project-wise-accounting.store';
import { TlPlService } from '../../../services/tl-pl.service';
import { cloneDeep, each, filter, findIndex, forEach, includes, keys } from '../../../lodash-optimized';

@Component({
selector: 'profit-loss',
    templateUrl: './profit-loss.component.html',
    providers: [ProjectWiseAccountingComponentStore],
    standalone: false
})
export class ProfitLossComponent implements OnInit, AfterViewInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    public from: string;
    public to: string;

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }
    /** This will hold project unique name */
    @Input() projectUniqueName: string = null;
    /** Observable to track the profit loss loading */
    public isFetchingProfitAndLoss$: Observable<boolean> = this.componentStore.isFetchingProfitAndLoss$;
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

    public showLoader: Observable<boolean>;
    public data: ProfitLossData;
    public cogsData: ChildGroup;
    public request: ProfitLossRequest;
    public expandAll: boolean;
    @Input() public isDateSelected: boolean = false;
    public search: string;
    @ViewChild('plGrid', { static: true }) public plGrid: ProfitLossGridComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;
    /** True if show Tally Report options */
    public showReportTallyOption: boolean;

    constructor(
        private store: Store<AppState>, 
        public tlPlActions: TBPlBsActions, 
        private cd: ChangeDetectorRef, 
        private toaster: ToasterService, 
        private componentStore: ProjectWiseAccountingComponentStore,
        private tlPlService: TlPlService) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.pl.showLoader), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        combineLatest([
            this.store.pipe(select(state => state.tlPl.pl.data)),
            this.componentStore.profitAndLossData$
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(([storeResponse, profitAndLossResponse]) => {
                if (storeResponse || profitAndLossResponse) {
                    this.tlPlService.isReportTailed$.next(true);
                    this.expandAll = false;
                    this.modifyResponse(storeResponse || profitAndLossResponse);
                } else {
                    this.data = null;
                }
                this.cd.detectChanges();
            });
    }

    /**
     * Profit Loss Data Modify
     *
     * @memberof ProfitLossComponent
     */
    public modifyResponse(response: ProfitLossData): void {
        let data = cloneDeep(response) as ProfitLossData;
        let cogs;
        if (data?.incomeStatement?.costOfGoodsSold) {
            cogs = cloneDeep(data.incomeStatement.costOfGoodsSold) as ProfitLossDateRangeResponse<GetCogsResponse>;
        } else {
            cogs = null;
        }
        if (data?.message) {
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
            cogsGrp.level1 = true;
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

        if (data?.incomeStatement?.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]]?.type === "DEBIT" && data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount) {
            data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount = "-" + data.incomeStatement.grossProfit[Object.keys(data.incomeStatement.grossProfit)[0]].amount;
        }

        if (data?.incomeStatement?.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]]?.type === "DEBIT" && data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount) {
            data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount = "-" + data.incomeStatement.operatingProfit[Object.keys(data.incomeStatement.operatingProfit)[0]].amount;
        }

        this.data = data;
    }

    /**
     * Initializes the data for the report, setting visibility and inclusion flags for each group and account.
     * 
     * @param {ChildGroup[]} groupList - The group details to initialize
     * @returns {void}
     * @memberof ProfitLossComponent
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

    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * This function is used to filter the profit and loss report data based on the given request object.
     * 
     * @param request The request object to filter the data with.
     * @memberof ProfitLossComponent
     */
    public filterData(request: ProfitLossRequest): void {
        this.request = request;
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        if (this.isDateSelected) {
            delete request['selectedFinancialYearOption'];
        }
        if (!request.tagName) {
            delete request.tagName;
        }
        if (this.projectUniqueName) {
            const requestObject = {
                companyUniqueName: this.selectedCompany.uniqueName,
                projectUniqueName: this.projectUniqueName,
                from: this.from,
                to: this.to
            }
            this.store.dispatch(this.tlPlActions.GetProfitLoss(cloneDeep(requestObject)));
        } else {
            this.store.dispatch(this.tlPlActions.GetProfitLoss(cloneDeep(request)));
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

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

    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }

    /**
     * Handles the refresh even
     *
     * @memberof ProfitLossComponent
     */
    public handleRefresh(): void {
        this.filterData(this.request);
    }
}