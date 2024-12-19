import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { createSelector } from 'reselect';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { TrialBalanceRequest } from '../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../models/api-models/Company';
import { AppState } from '../../store';
import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { ToasterService } from '../../services/toaster.service';
import { cloneDeep, each } from '../../lodash-optimized';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ReportType } from '../multi-currency.const';
import { TrialBalanceReportGridComponent } from './components/trial-balance-grid/trial-balance-report-grid.component';

@Component({
    selector: 'trial-balance-report',
    templateUrl: './trial-balance-report.component.html',
    providers: [MultiCurrencyReportsComponentStore]
})
export class TrialBalanceReportComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Holds local JSON data */
    public localeData: any = {};
    /** Holds common JSON data */
    public commonLocaleData: any = {};
    /** Observable for controlling loader state */
    public showLoader: Observable<boolean>;
    /** Observable for report data */
    public data$: Observable<any> = this.componentStore.reportDataList$;
    /** Holds the request data for the trial balance */
    public request: TrialBalanceRequest;
    /** Flag to control expand/collapse state for all groups */
    public expandAll: boolean;
    /** Search query string for filtering data */
    public search: string;
    /** Start date of the selected financial year */
    public from: string;
    /** End date of the selected financial year */
    public to: string
    /** Reference to the TrialBalanceReportGridComponent */
    @ViewChild('tbGrid', { static: true }) public tbGrid: TrialBalanceReportGridComponent;
    /** Indicates whether version 2 is used */
    @Input() public isV2: boolean = false;
    /** Indicates whether a date has been selected */
    @Input() public isDateSelected: boolean = false;
    /** Subject used to track component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the selected company data */
    private _selectedCompany: CompanyResponse;
    /** Holds filter request data */
    public filterRequestData: any;

    constructor(
        private store: Store<AppState>,
        private cd: ChangeDetectorRef,
        public tlPlActions: TBPlBsActions,
        private toaster: ToasterService,
        private componentStore: MultiCurrencyReportsComponentStore) {
        this.showLoader = this.componentStore.inProgressReport$;
    }

    /**
     * Getter for the selected company.
     * 
     * @returns {CompanyResponse} The currently selected company
     * @memberof TrialBalanceReportComponent
     */
    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }

    /**
     * Setter for the selected company. Updates the request object based on the company's financial year.
     * 
     * @param {CompanyResponse} value - The selected company
     * @memberof TrialBalanceReportComponent
     */
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && !this.isDateSelected) {
            this.request = {
                refresh: false,
                from: value.activeFinancialYear.financialYearStarts,
                to: this.selectedCompany.activeFinancialYear.financialYearEnds
            };
        }
    }

    /**
     * Initializes the component by subscribing to necessary data and handling received reports.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public ngOnInit() {
        this.data$.pipe(takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                if (p.message) {
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(p.message);
                    }, 100);
                }
                this.InitData(p?.groupDetails);
                p?.groupDetails.forEach(g => {
                    g['isVisible'] = true;
                    g['isCreated'] = true;
                });
            }
            this.cd.markForCheck();
        });

        this.componentStore.filterRequestData$.pipe(takeUntil(this.destroyed$)).subscribe((p) => {
            if (p?.request && p.lastFetchedAt) {
                this.filterRequestData = p
            }
            this.cd.markForCheck();
        });
        
    }

    /**
     * Initializes the data for the report, setting visibility and inclusion flags for each group and account.
     * 
     * @param {ChildGroup[]} d - The group details to initialize
     * @returns {void}
     * @memberof TrialBalanceReportComponent
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
     * Lifecycle hook to detect changes after the view initialization.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * Filters the data based on the selected date range and triggers report generation.
     * 
     * @param {TrialBalanceRequest} request - The filter request data
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public filterData() {
        this.componentStore.getMultiCurrencyReport(ReportType.TrialBalance);
    }

    /**
     * Fetches the trial balance report by triggering the component store's action.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public getTrialBalanceReport(){
        this.componentStore.getMultiCurrencyReport(ReportType.TrialBalance);
    }


    /**
     * Handles the event when search data is changed.
     * 
     * @param {any} event - The event triggered by the search action
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public searchData(event: any) {
        this.componentStore.creatMultiCurrencyReport({ reportType: ReportType.TrialBalance, payload: event });
    }

    /**
     * Lifecycle hook to clean up resources when the component is destroyed.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Event handler for the expand all button, triggering change detection.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    /**
     * Sets the last synchronization date when triggered.
     * 
     * @param {any} event - The event containing the synchronization date
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public lastSyncDate (event: any){
        this.lastSyncDate = event;
    }
    
    /**
     * Handles changes in the search input and toggles the expandAll state.
     * 
     * @param {string} event - The new search query
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }
}
