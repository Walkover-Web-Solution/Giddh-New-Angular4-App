import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { BalanceSheetData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MMMM_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { forEach } from '../../../../lodash-optimized';

@Component({
selector: 'balance-sheet-report-grid',
    templateUrl: './balance-sheet-report-grid.component.html',
    styleUrls: [`./balance-sheet-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BalanceSheetReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Holds the search query */
    @Input() public search: string = '';
    /** Holds the balance sheet data */
    @Input() public bsData: BalanceSheetData;
    /** Padding for the report grid */
    @Input() public padding: string;
    /** Determines if all items should be expanded */
    @Input() public expandAll: boolean;
    /** Holds the search input text */
    @Input() public searchInput: string = '';
    /** Stores the last synchronization date */
    @Input() public lastSyncDate: string = '';
    /** Emits an event when the search input changes */
    @Output() public searchChange: EventEmitter<string> = new EventEmitter();
    /** Day.js instance for date formatting */
    public dayjs: any = dayjs;
    /** Indicates if there is no data available */
    public noData: boolean;
    /** Determines if the clear search button should be shown */
    public showClearSearch: boolean = false;
    /** Form control for the search input */
    public bsSearchControl: FormControl = new FormControl<string>('');
    /** Stores the Giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Stores local JSON data */
    public localeData: any = {};
    /** Stores common JSON data */
    public commonLocaleData: any = {};
    /** Indicates whether data should be hidden during search */
    public hideData: boolean;
    /** Indicates if expand all was toggled during search */
    public isExpandToggledDuringSearch: boolean;
    /** Observable to manage memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(private changeDetectionRef: ChangeDetectorRef, 
        private zone: NgZone,
        public generalService: GeneralService) {

    }

    /**
     * Handles changes to the component's input properties
     * 
     * @returns {void}
     * @param {SimpleChanges} changes The changes object
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.bsData) {
                this.zone.run(() => {
                    if (this.bsData) {
                        this.toggleVisibility(this.bsData.assets, changes.expandAll.currentValue);
                        this.toggleVisibility(this.bsData.liabilities, changes.expandAll.currentValue);
                        // always make first level visible ....
                        if (this.bsData.liabilities) {
                            this.bsData.liabilities.forEach((childGroup: any) => {
                                if (childGroup.isIncludedInSearch) {
                                    childGroup.isVisible = true;
                                    childGroup.accounts.forEach((account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        if (this.bsData.assets) {
                            this.bsData.assets.forEach((childGroup: any) => {
                                if (childGroup.isIncludedInSearch) {
                                    childGroup.isVisible = true;
                                    childGroup.accounts.forEach((account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                    }
                    this.changeDetectionRef.detectChanges();
                });
            }
        }
    }

    /**
     * Initializes the component
     *
     * @returns {void}
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnInit(): void {
        this.lastSyncDate = dayjs(this.lastSyncDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_DD_MMMM_YYYY);
        this.bsSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                if (newValue) {
                    this.searchInput = newValue;
                    this.hideData = true;
                    this.searchChange.emit(this.searchInput);
                    this.isExpandToggledDuringSearch = false;
                    if (newValue === '') {
                        this.showClearSearch = false;
                    }
                    setTimeout(() => {
                        this.hideData = false;
                        this.changeDetectionRef.detectChanges();
                    }, 10);
                }
            });
    }

    /**
     * Toggles the visibility of the search bar
     * 
     * @returns {void} 
     * @memberof BalanceSheetReportGridComponent
     */
    public toggleSearch(): void {
        this.showClearSearch = true;
        if (this.searchInputEl && this.searchInputEl.nativeElement) {
            setTimeout(() => {
                this.searchInputEl.nativeElement.focus();
            }, 200);
        }
    }

    /**
     * Handles click events outside the search input
     *
     * @param {any} event The click event
     * @param {ElementRef} element The element to check
     * @returns {void} 
     * @memberof BalanceSheetReportGridComponent
     */
    public clickedOutside(event: any, element: ElementRef): void {
        if ((this.bsSearchControl?.value !== null && this.bsSearchControl?.value !== '') || this.generalService.childOf(event.target, element)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Toggles the visibility of child groups and accounts
     *
     * @param {ChildGroup[]} data The data to toggle visibility for
     * @param {boolean} isVisible Indicates whether the items should be visible
     * @memberof BalanceSheetReportGridComponent
     */
    private toggleVisibility(data: ChildGroup[], isVisible: boolean): void {
        data.forEach((childGroup: ChildGroup) => {
            if (childGroup.isIncludedInSearch) {
                childGroup.isCreated = true;
                childGroup.isVisible = isVisible;
                childGroup.isOpen = isVisible;
                childGroup.accounts.forEach((account: Account) => {
                    if (account.isIncludedInSearch) {
                        account.isCreated = true;
                        account.isVisible = isVisible;
                    }
                });
                this.toggleVisibility(childGroup.childGroups, isVisible);
            }
        });
    }

    /**
     * Cleans up resources used by the component
     * 
     * @returns {void} 
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
