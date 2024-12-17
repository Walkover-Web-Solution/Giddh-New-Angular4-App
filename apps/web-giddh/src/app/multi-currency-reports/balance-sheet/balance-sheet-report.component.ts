import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyResponse } from '../../models/api-models/Company';
import { BalanceSheetData, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { BalanceSheetReportGridComponent } from './components/balance-sheet-grid/balance-sheet-report-grid.component';
import { AppState } from '../../store';
import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { ToasterService } from '../../services/toaster.service';
import { cloneDeep, each } from '../../lodash-optimized';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ReportType } from '../multi-currency.const';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { prepareBalanceSheetData } from '../../store/tl-pl/tl-pl.reducer';
// import { TBPlBsActions } from '../../../actions/tl-pl.actions';
// import { cloneDeep, each } from '../../../lodash-optimized';
// import { CompanyResponse } from '../../../models/api-models/Company';
// import { Account, ChildGroup } from '../../../models/api-models/Search';
// import { BalanceSheetData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
// import { ToasterService } from '../../../services/toaster.service';
// import { AppState } from '../../../store/roots';
// import { BalanceSheetGridComponent } from './components/balance-sheet-grid/balance-sheet-report-grid.component';


@Component({
    selector: 'balance-sheet-report',
    templateUrl: './balance-sheet-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MultiCurrencyReportsComponentStore]
})
export class BalanceSheetReportComponent implements AfterViewInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }
    
    /**
     * set company and fetch data
     *
     * @memberof BalanceSheetComponent
     */
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && value.financialYears && !this.isDateSelected) {
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
    public data: BalanceSheetData;
    public request: ProfitLossRequest;
    public expandAll: boolean;
    public search: string;
    public from: string;
    public to: string;
    @Input() public isDateSelected: boolean = false;
    @ViewChild('bsGrid', { static: true }) public bsGrid: BalanceSheetReportGridComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;


    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private toaster: ToasterService, private componentStore: MultiCurrencyReportsComponentStore) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.bs.showLoader), takeUntil(this.destroyed$));
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                
                
                let data = prepareBalanceSheetData(cloneDeep(p));
                console.log('prepareBalanceSheetData',data);
                
                if (data && data.message) {
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(data.message);
                    }, 100);
                }
                if (data && data.liabilities) {
                    this.InitData(data.liabilities);
                    data.liabilities.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                if (data && data.assets) {
                    this.InitData(data.assets);
                    data.assets.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                this.data = data;
            } else {
                this.data = null;
            }
        });
    }

    public InitData(d: ChildGroup[]) {
        each(d, (grp: ChildGroup) => {
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            each(grp.accounts, (acc: Account) => {
                acc.isIncludedInSearch = true;
                acc.isCreated = false;
                acc.isVisible = false;
            });
            if (grp.childGroups) {
                this.InitData(grp.childGroups);
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
        this.componentStore.getMultiCurrencyReport(ReportType.BalanceSheet);
    }
    public searchData(event: any) {
        console.log('creatMultiCurrencyReport', event);
        this.componentStore.creatMultiCurrencyReport({ reportType: ReportType.BalanceSheet, payload: event });
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
