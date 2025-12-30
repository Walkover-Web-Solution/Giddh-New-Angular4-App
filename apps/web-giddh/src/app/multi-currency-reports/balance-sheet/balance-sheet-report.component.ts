import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BalanceSheetData, ProfitLossRequest } from '../../models/api-models/tb-pl-bs';
import { BalanceSheetReportGridComponent } from './components/balance-sheet-grid/balance-sheet-report-grid.component';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ReportType } from '../multi-currency.const';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { prepareBalanceSheetData } from '../../store/tl-pl/tl-pl.reducer';
import { cloneDeep, forEach } from '../../lodash-optimized';

@Component({
selector: 'balance-sheet-report',
    templateUrl: './balance-sheet-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MultiCurrencyReportsComponentStore],
    standalone: false
})
export class BalanceSheetReportComponent implements AfterViewInit, OnDestroy {
    /** Reference to the balance sheet grid component */
    @ViewChild('bsGrid', { static: true }) public bsGrid: BalanceSheetReportGridComponent;
    /** Indicates whether a date has been selected */
    @Input() public isDateSelected: boolean = false;
    /** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Observable to indicate if the loader is visible */
    public showLoader: Observable<boolean> = this.componentStore.inProgressReport$;
    /** Stores the balance sheet data */
    public data: BalanceSheetData;
    /** Stores the profit and loss request parameters */
    public request: ProfitLossRequest;
    /** Indicates whether all items are expanded */
    public expandAll: boolean;
    /** Holds the search text */
    public search: string;
    /** Stores the last sync date */
    public lastSyncDate: string = "";
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private changeDetectionRef: ChangeDetectorRef, private componentStore: MultiCurrencyReportsComponentStore) {
        this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                let data = prepareBalanceSheetData(cloneDeep(response));
                if (data && data.liabilities) {
                    this.initData(data.liabilities);
                    (Array.isArray(data.liabilities) ? data.liabilities : []).forEach(childGroup => {
                        childGroup['isVisible'] = true;
                        childGroup['isCreated'] = true;
                        childGroup['isIncludedInSearch'] = true;
                    });
                }
                if (data && data.assets) {
                    this.initData(data.assets);
                    (Array.isArray(data.assets) ? data.assets : []).forEach(childGroup => {
                        childGroup['isVisible'] = true;
                        childGroup['isCreated'] = true;
                        childGroup['isIncludedInSearch'] = true;
                    });
                }
                this.data = data;
                this.changeDetectionRef.detectChanges();
            } else {
                this.data = null;
            }
        });
    }

    /**
     * Initializes data for the balance sheet groups
     * @returns {void}
     * @param {ChildGroup[]} groupList The list of child groups
     * @memberof BalanceSheetReportComponent
     */
    public initData(groupList: ChildGroup[]): void {
        (Array.isArray(groupList) ? groupList : []).forEach((childGroup: ChildGroup) => {
            childGroup['isVisible'] = false;
            childGroup['isCreated'] = false;
            childGroup['isIncludedInSearch'] = true;
            (Array.isArray(childGroup.accounts) ? childGroup.accounts : []).forEach((account: Account) => {
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
     * Detects changes after the view is initialized
     *
     * @returns {void}
     * @memberof BalanceSheetReportComponent
     */
    public ngAfterViewInit(): void {
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Filters data based on the given request
     *
     * @returns {void}
     * @memberof BalanceSheetReportComponent
     */
    public filterData(): void {
        this.componentStore.getMultiCurrencyReport(ReportType.BALANCE_SHEET);
    }
    /**
     * Updates the last sync date
     *
     * @param {any} event The event containing the sync date
     * @returns {void}
     * @memberof BalanceSheetReportComponent
     */
    public lastDate(event: any): void {
        this.lastSyncDate = event;
    }

    /**
     * Searches and updates data based on the provided criteria
     *
     * @returns {void}
     * @param {any} event The event containing search criteria
     * @memberof BalanceSheetReportComponent
     */
    public searchData(event: any): void {
        this.componentStore.createMultiCurrencyReport({ reportType: ReportType.BALANCE_SHEET, payload: event });
    }

    /**
     * Cleans up resources when the component is destroyed
     * @returns {void}
     * @memberof BalanceSheetReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Expands all items in the balance sheet
     *
     * @returns {void}
     * @memberof BalanceSheetReportComponent
     */
    public expandAllEvent(): void {
        setTimeout(() => {
            this.changeDetectionRef.detectChanges();
        }, 1);
    }

    /**
     * Updates the search text and handles search functionality
     *
     * @returns {void}
     * @param {string} event The new search text
     * @memberof BalanceSheetReportComponent
     */
    public searchChanged(event: string): void {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.changeDetectionRef.detectChanges();
    }

}
