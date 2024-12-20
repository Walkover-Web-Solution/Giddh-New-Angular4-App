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
import { UntypedFormControl } from '@angular/forms';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { BalanceSheetData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { each } from 'apps/web-giddh/src/app/lodash-optimized';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'balance-sheet-report-grid',
    templateUrl: './balance-sheet-report-grid.component.html',
    styleUrls: [`./balance-sheet-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceSheetReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Indicates if there is no data available */
    public noData: boolean;
    /** Determines if the clear search button should be shown */
    public showClearSearch: boolean = false;
    /** Holds the search query */
    @Input() public search: string = '';
    /** Holds the balance sheet data */
    @Input() public bsData: BalanceSheetData;
    /** Padding for the report grid */
    @Input() public padding: string;
    /** Day.js instance for date formatting */
    public dayjs = dayjs;
    /** Determines if all items should be expanded */
    @Input() public expandAll: boolean;
    /** Holds the search input text */
    @Input() public searchInput: string = '';
    /** Holds the start date */
    @Input() public from: string = '';
    /** Holds the end date */
    @Input() public to: string = '';
    /** Stores the last synchronization date */
    @Input() public lastSyncDate: string = '';
    /** Emits an event when the search input changes */
    @Output() public searchChange = new EventEmitter<string>();
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Form control for the search input */
    public bsSearchControl: UntypedFormControl = new UntypedFormControl();
    /** Stores the Giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Observable to manage memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores local JSON data */
    public localeData: any = {};
    /** Stores common JSON data */
    public commonLocaleData: any = {};
    /** Indicates whether data should be hidden during search */
    public hideData: boolean;
    /** Indicates if expand all was toggled during search */
    public isExpandToggledDuringSearch: boolean;

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
        
    }

    /**
     * Handles changes to the component's input properties
     *
     * @param {SimpleChanges} changes The changes object
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.bsData) {
                this.zone.run(() => {
                    if (this.bsData) {
                        this.toggleVisibility(this.bsData.assets, changes.expandAll.currentValue);
                        this.toggleVisibility(this.bsData.liabilities, changes.expandAll.currentValue);
                        // always make first level visible ....
                        if (this.bsData.liabilities) {
                            each(this.bsData.liabilities, (childGroup: any) => {
                                if (childGroup.isIncludedInSearch) {
                                    childGroup.isVisible = true;
                                    each(childGroup.accounts, (account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        if (this.bsData.assets) {
                            each(this.bsData.assets, (childGroup: any) => {
                                if (childGroup.isIncludedInSearch) {
                                    childGroup.isVisible = true;
                                    each(childGroup.accounts, (account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }

                    }
                    this.cd.detectChanges();
                });
            }
        }
    }

    /**
     * Initializes the component
     *
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnInit() {
        this.lastSyncDate = dayjs(this.lastSyncDate, 'DD-MM-YYYY').format('DD MMMM YYYY');
        this.bsSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.hideData = true;
                this.searchChange.emit(this.searchInput);
                this.isExpandToggledDuringSearch = false;
                if (newValue === '') {
                    this.showClearSearch = false;
                }
                setTimeout(() => {
                    this.hideData = false;
                    this.cd.detectChanges();
                }, 10);
            });
    }

    /**
     * Toggles the visibility of the search bar
     *
     * @memberof BalanceSheetReportGridComponent
     */
    public toggleSearch() : void {
        this.showClearSearch = true;

        setTimeout(() => {
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * Handles click events outside the search input
     *
     * @param {*} event The click event
     * @param {*} el The element to check
     * @returns {void} 
     * @memberof BalanceSheetReportGridComponent
     */
    public clickedOutside(event, el) : void {
        if (this.bsSearchControl?.value !== null && this.bsSearchControl?.value !== '') {
            return;
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Checks if an element is a child of another
     *
     * @param {*} child The child element
     * @param {*} parent The parent element
     * @returns {boolean} True if the element is a child, false otherwise
     * @memberof BalanceSheetReportGridComponent
     */
    public childOf(child, parent): boolean {
        while ((child = child.parentNode) && child !== parent) {
        }
        return !!child;
    }

    /**
     * Toggles the visibility of child groups and accounts
     *
     * @param {ChildGroup[]} data The data to toggle visibility for
     * @param {boolean} isVisible Indicates whether the items should be visible
     * @memberof BalanceSheetReportGridComponent
     */
    private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
        each(data, (childGroup: ChildGroup) => {
            if (childGroup.isIncludedInSearch) {
                childGroup.isCreated = true;
                childGroup.isVisible = isVisible;
                childGroup.isOpen = isVisible;
                each(childGroup.accounts, (account: Account) => {
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
     * @memberof BalanceSheetReportGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
