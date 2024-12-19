import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
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


@Component({
    selector: 'balance-sheet-report',
    templateUrl: './balance-sheet-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MultiCurrencyReportsComponentStore]
})
export class BalanceSheetReportComponent implements AfterViewInit, OnDestroy {
    /**
     * Retrieves the selected company
     *
     * @returns {CompanyResponse} The currently selected company
     * @memberof BalanceSheetReportComponent
    */
    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }
        
    /**
     * Sets the selected company and fetches its data
     *
     * @param {CompanyResponse} value The company to set
     * @memberof BalanceSheetReportComponent
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
    /** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Observable to indicate if the loader is visible */
    public showLoader: Observable<boolean>;
    /** Stores the balance sheet data */
    public data: BalanceSheetData;
    /** Stores the profit and loss request parameters */
    public request: ProfitLossRequest;
    /** Indicates whether all items are expanded */
    public expandAll: boolean;
    /** Holds the search text */
    public search: string;
    /** Stores the start date of the range */
    public from: string;
    /** Stores the end date of the range */
    public to: string;
    /** Stores the last sync date */
    public lastSyncDate: string = "";
    /** Indicates whether a date has been selected */
    @Input() public isDateSelected: boolean = false;
    /** Reference to the balance sheet grid component */
    @ViewChild('bsGrid', { static: true }) public bsGrid: BalanceSheetReportGridComponent;
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the selected company data */
    private _selectedCompany: CompanyResponse;

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private toaster: ToasterService, private componentStore: MultiCurrencyReportsComponentStore) {
        this.showLoader = this.componentStore.inProgressReport$;
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                let data = prepareBalanceSheetData(cloneDeep(p));
                if (data && data.message) {
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(data.message);
                    }, 100);
                }
                if (data && data.liabilities) {
                    this.InitData(data.liabilities);
                    data.liabilities.forEach(g => {
                        g['isVisible'] = true;
                        g['isCreated'] = true;
                        g['isIncludedInSearch'] = true;
                    });
                }
                if (data && data.assets) {
                    this.InitData(data.assets);
                    data.assets.forEach(g => {
                        g['isVisible'] = true;
                        g['isCreated'] = true;
                        g['isIncludedInSearch'] = true;
                    });
                }
                this.data = data;
                this.cd.detectChanges();
            } else {
                this.data = null;
            }
        });
    }

    /**
     * Initializes data for the balance sheet groups
     *
     * @param {ChildGroup[]} d The list of child groups
     * @memberof BalanceSheetReportComponent
     */
    public InitData(d: ChildGroup[]) {
        each(d, (grp: ChildGroup) => {
            grp['isVisible'] = false;
            grp['isCreated'] = false;
            grp['isIncludedInSearch'] = true;
            each(grp.accounts, (acc: Account) => {
                acc['isIncludedInSearch'] = true;
                acc['isCreated'] = false;
                acc['isVisible'] = false;
            });
            if (grp.childGroups) {
                this.InitData(grp.childGroups);
            }
        });
    }

    /**
     * Detects changes after the view is initialized
     *
     * @memberof BalanceSheetReportComponent
     */
    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * Filters data based on the given request
     *
     * 
     * @memberof BalanceSheetReportComponent
     */
    public filterData() {
        this.componentStore.getMultiCurrencyReport(ReportType.BalanceSheet);
    }
    /**
     * Updates the last sync date
     *
     * @param {*} event The event containing the sync date
     * @memberof BalanceSheetReportComponent
     */
    public lastDate(event: any){
        this.lastSyncDate = event ;
    }

    /**
     * Searches and updates data based on the provided criteria
     *
     * @param {*} event The event containing search criteria
     * @memberof BalanceSheetReportComponent
     */
    public searchData(event: any) {
        this.componentStore.creatMultiCurrencyReport({ reportType: ReportType.BalanceSheet, payload: event });
    }

    /**
     * Cleans up resources when the component is destroyed
     *
     * @memberof BalanceSheetReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Finds the index of the active financial year in the list of financial years
     *
     * @param {*} activeFY The active financial year
     * @param {*} financialYears The list of financial years
     * @returns {number} The index of the active financial year
     * @memberof BalanceSheetReportComponent
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
     * Expands all items in the balance sheet
     *
     * @memberof BalanceSheetReportComponent
     */
    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    /**
     * Updates the search text and handles search functionality
     *
     * @param {string} event The new search text
     * @memberof BalanceSheetReportComponent
     */
    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }

}
