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
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MMMM_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { forEach, indexOf, keys } from '../../../../lodash-optimized';

@Component({
selector: 'profit-loss-report-grid',
    templateUrl: './profit-loss-report-grid.component.html',
    styleUrls: [`./profit-loss-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ProfitLossReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Input value for the search term */
    @Input() public search: string = '';
    /** Input value for the search input field */
    @Input() public searchInput: string = '';
    /** Input value for the profit and loss data */
    @Input() public plData: ProfitLossData;
    /** Input value for the cost of goods sold data */
    @Input() public cogsData: ChildGroup;
    /** Padding value for styling or layout */
    @Input() public padding: string;
    /** Flag to control the expand/collapse state for all groups */
    @Input() public expandAll: boolean;
    /** Last synchronization date */
    @Input() public lastSyncDate: string = '';
    /** Event emitter to emit changes in the search term */
    @Output() public searchChange: EventEmitter<string> = new EventEmitter();
    /** Flag indicating if there is no data available */
    public noData: boolean;
    /** Flag to control the visibility of the clear search button */
    public showClearSearch: boolean = false;
    /** Dayjs instance for date handling */
    public dayjs: any = dayjs;
    /** Form control for managing the search input */
    public plSearchControl: FormControl = new FormControl<string>('');
    /** Holds the Giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Subject used to track component destruction and unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the local JSON data */
    public localeData: any = {};
    /** Holds the common JSON data */
    public commonLocaleData: any = {};
    /** Flag to hide data while a new search is being performed */
    public hideData: boolean;
    /** Flag to indicate if the expand all button was toggled during a search */
    public isExpandToggledDuringSearch: boolean;

    constructor(private changeDetectionRef: ChangeDetectorRef, 
        private zone: NgZone,
        public generalService: GeneralService) {

    }

    /**
     * Initializes the component by formatting the last synchronization date and setting up the search input subscription.
     * This also listens for search input changes and emits the updated value.
     * 
     * @returns {void}
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnInit(): void {
        this.lastSyncDate = dayjs(this.lastSyncDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_DD_MMMM_YYYY);
        this.plSearchControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
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
     * Responds to changes in input properties. Specifically, it listens for changes to the `expandAll` property
     * and adjusts the visibility of data accordingly.
     * 
     * @returns {void}
     * @param {SimpleChanges} changes - The changes in input properties
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.plData && this.cogsData) {
                this.zone.run(() => {
                    if (this.plData) {
                        this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
                        this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
                        if (this.plData.incArr) {
                            (Array.isArray(this.plData.incArr) ? this.plData.incArr : []).forEach((group: any) => {
                                if (group.isIncludedInSearch) {
                                    group.isVisible = true;
                                    (Array.isArray(group.accounts) ? group.accounts : []).forEach((account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        if (this.plData.expArr) {
                            (Array.isArray(this.plData.expArr) ? this.plData.expArr : []).forEach((group: any) => {
                                if (group.isIncludedInSearch) {
                                    group.isVisible = true;
                                    (Array.isArray(group.accounts) ? group.accounts : []).forEach((account: any) => {
                                        if (account.isIncludedInSearch) {
                                            account.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                    }

                    if (this.cogsData) {
                        if (this.cogsData.isIncludedInSearch) {
                            if (!this.cogsData.level1) {
                                this.cogsData.isOpen = changes.expandAll.currentValue;
                            } else {
                                this.cogsData.isOpen = true;
                            }
                            this.toggleVisibility(this.cogsData.childGroups, changes.expandAll.currentValue);
                        }
                    }

                    this.changeDetectionRef.detectChanges();

                });
            }
        }
    }

    /**
     * Toggles the search input focus and shows the clear search button.
     * 
     * @returns {void}
     * @memberof ProfitLossReportGridComponent
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
     * Cleans up by unsubscribing from the store listeners and completing the destroyed$ subject.
     * 
     * @returns {void}
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles clicks outside the search input. If clicked outside, hides the clear search button
     * unless the search input has a value.
     * 
     * @param {Event} event - The click event
     * @param {ElementRef} element - The search input element
     * @returns {void}
     * @memberof ProfitLossReportGridComponent
     */
    public clickedOutside(event: any, element: ElementRef): void {
        if ((this.plSearchControl?.value !== null && this.plSearchControl?.value !== '') || this.generalService.childOf(event.target, element)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Toggles the visibility of data groups based on the expand/collapse state.
     * Also handles the visibility of child groups and their accounts.
     * 
     * @private
     * @param {ChildGroup[]} data - The data to toggle visibility for
     * @param {boolean} isVisible - The desired visibility state
     * @memberof ProfitLossReportGridComponent
     */
    private toggleVisibility(data: ChildGroup[], isVisible: boolean): void {
        let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
        (Array.isArray(data) ? data : []).forEach((group: ChildGroup) => {
            if (group.isIncludedInSearch) {
                if (!group.level1) {
                    if (parentGroups?.indexOf(group?.uniqueName) === -1) {
                        group.isCreated = false;
                        group.isVisible = isVisible;
                        group.isOpen = isVisible;
                    } else {
                        group.isOpen = isVisible;
                    }
                } else {
                    group.isOpen = true;
                }
                (Array.isArray(group.accounts) ? group.accounts : []).forEach((account: Account) => {
                    if (account.isIncludedInSearch) {
                        account.isCreated = true;
                        account.isVisible = isVisible;
                    }
                });
                this.toggleVisibility(group.childGroups, isVisible);
            }
        });
    }
    
    /**
     * Retrieves the keys of an object.
     *
     * @param obj The object whose keys are to be retrieved.
     * @returns An array of strings representing the keys of the object, or an empty array if the input is null or undefined.
     * @memberof ProfitLossReportGridComponent
     */
    public getKeys(obj: Record<string, any> | null | undefined): string[] | [] {
        if (obj) {
            return Object.keys(obj);
        } else {
            return [];
        }
    }
}
