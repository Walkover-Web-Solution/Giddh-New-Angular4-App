import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { TrialBalanceRequest } from '../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ReportType } from '../multi-currency.const';
import { TrialBalanceReportGridComponent } from './components/trial-balance-grid/trial-balance-report-grid.component';
import { forEach } from '../../lodash-optimized';

@Component({
selector: 'trial-balance-report',
    templateUrl: './trial-balance-report.component.html',
    providers: [MultiCurrencyReportsComponentStore],
    standalone: false
})
export class TrialBalanceReportComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Reference to the TrialBalanceReportGridComponent */
    @ViewChild('tbGrid', { static: true }) public tbGrid: TrialBalanceReportGridComponent;
    /** Indicates whether version 2 is used */
    @Input() public isV2: boolean = false;
    /** Indicates whether a date has been selected */
    @Input() public isDateSelected: boolean = false;
    /** Holds local JSON data */
    public localeData: any = {};
    /** Holds common JSON data */
    public commonLocaleData: any = {};
    /** Observable for controlling loader state */
    public showLoader: Observable<boolean> = this.componentStore.inProgressReport$;
    /** Holds the request data for the trial balance */
    public request: TrialBalanceRequest;
    /** Flag to control expand/collapse state for all groups */
    public expandAll: boolean;
    /** Search query string for filtering data */
    public search: string;
    /** Subject used to track component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Observable for report data */
    public reportDataList$: Observable<any> = this.componentStore.reportDataList$;

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private componentStore: MultiCurrencyReportsComponentStore) {
    }

    /**
     * Initializes the component by subscribing to necessary data and handling received reports.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public ngOnInit(): void {
        this.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.initData(response?.groupDetails);
                response?.groupDetails.forEach(groupDetail => {
                    groupDetail['isVisible'] = true;
                    groupDetail['isCreated'] = true;
                });
            }
            this.changeDetectionRef.markForCheck();
        });
    }

    /**
     * Initializes the data for the report, setting visibility and inclusion flags for each group and account.
     * 
     * @param {ChildGroup[]} d - The group details to initialize
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public initData(groups: ChildGroup[]): void {
        groups.forEach((childGroup: ChildGroup) => {
            childGroup['isVisible'] = false;
            childGroup['isCreated'] = false;
            childGroup['isIncludedInSearch'] = true;
            childGroup.accounts.forEach((account: Account) => {
                account['isIncludedInSearch'] = true;
                account['isCreated'] = false;
                account['isVisible'] = false;
            });
            if (childGroup.childGroups) {
                this.initData(childGroup.childGroups);
            }
        });
    }

    /**
     * Lifecycle hook to detect changes after the view initialization.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public ngAfterViewInit(): void {
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Filters the data based on the selected date range and triggers report generation.
     * 
     * @param {any} event - The filter date
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public filterData(): void {
        this.componentStore.getMultiCurrencyReport(ReportType.TRIAL_BALANCE);
    }

    /**
     * Fetches the trial balance report by triggering the component store's action.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public getTrialBalanceReport(): void {
        this.componentStore.getMultiCurrencyReport(ReportType.TRIAL_BALANCE);
    }


    /**
     * Handles the event when search data is changed.
     * 
     * @param {any} event - The event triggered by the search action
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public searchData(event: any): void {
        this.componentStore.createMultiCurrencyReport({ reportType: ReportType.TRIAL_BALANCE, payload: event });
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
    public expandAllEvent(): void {
        setTimeout(() => {
            this.changeDetectionRef.detectChanges();
        }, 1);
    }

    /**
     * Sets the last synchronization date when triggered.
     * 
     * @param {any} event - The event containing the synchronization date
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public lastSyncDate(event: any): void {
        this.lastSyncDate = event;
    }

    /**
     * Handles changes in the search input and toggles the expandAll state.
     * 
     * @param {string} event - The new search query
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public searchChanged(event: string): void {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.changeDetectionRef.detectChanges();
    }
}
