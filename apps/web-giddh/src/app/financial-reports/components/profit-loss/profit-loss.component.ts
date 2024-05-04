import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { cloneDeep, each } from '../../../lodash-optimized';
import { CompanyResponse } from '../../../models/api-models/Company';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { GetCogsResponse, ProfitLossData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { ProfitLossGridComponent } from './components/profit-loss-grid/profit-loss-grid.component';

@Component({
    selector: 'profit-loss',
    templateUrl: './profit-loss.component.html'
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

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private toaster: ToasterService) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.pl.showLoader), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(p => p.tlPl.pl.data), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                let data = cloneDeep(p) as ProfitLossData;
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

    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

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
        this.store.dispatch(this.tlPlActions.GetProfitLoss(cloneDeep(request)));
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
}
