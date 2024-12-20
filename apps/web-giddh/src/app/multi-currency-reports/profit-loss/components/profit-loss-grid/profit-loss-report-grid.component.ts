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
import { each } from 'apps/web-giddh/src/app/lodash-optimized';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'profit-loss-report-grid',
    templateUrl: './profit-loss-report-grid.component.html',
    styleUrls: [`./profit-loss-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitLossReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Flag indicating if there is no data available */
    public noData: boolean;
    /** Flag to control the visibility of the clear search button */
    public showClearSearch: boolean = false;
    /** Input value for the search term */
    @Input() public search: string = '';
    /** Input value for the search input field */
    @Input() public searchInput: string = '';
    /** Event emitter to emit changes in the search term */
    @Output() public searchChange = new EventEmitter<string>();
    /** Input value for the profit and loss data */
    @Input() public plData: ProfitLossData;
    /** Input value for the cost of goods sold data */
    @Input() public cogsData: ChildGroup;
    /** Padding value for styling or layout */
    @Input() public padding: string;
    /** Flag to control the expand/collapse state for all groups */
    @Input() public expandAll: boolean;
    /** Start date of the selected financial year */
    @Input() public from: string = '';
    /** End date of the selected financial year */
    @Input() public to: string = '';
    /** Last synchronization date */
    @Input() public lastSyncDate: string = '';
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Dayjs instance for date handling */
    public dayjs = dayjs
    /** Form control for managing the search input */
    public plSearchControl: UntypedFormControl = new UntypedFormControl();
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

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

    }

    /**
     * Initializes the component by formatting the last synchronization date and setting up the search input subscription.
     * This also listens for search input changes and emits the updated value.
     * 
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnInit() {
        this.lastSyncDate = dayjs(this.lastSyncDate, 'DD-MM-YYYY').format('DD MMMM YYYY');
        this.plSearchControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
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
     * Responds to changes in input properties. Specifically, it listens for changes to the `expandAll` property
     * and adjusts the visibility of data accordingly.
     * 
     * @param {SimpleChanges} changes - The changes in input properties
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.plData && this.cogsData) {
                this.zone.run(() => {
                    if (this.plData) {
                        this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
                        this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
                        if (this.plData.incArr) {
                            each(this.plData.incArr, (grp: any) => {
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    each(grp.accounts, (acc: any) => {
                                        if (acc.isIncludedInSearch) {
                                            acc.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        if (this.plData.expArr) {
                            each(this.plData.expArr, (grp: any) => {
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    each(grp.accounts, (acc: any) => {
                                        if (acc.isIncludedInSearch) {
                                            acc.isVisible = true;
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

                    this.cd.detectChanges();

                });
            }
        }
    }

    /**
     * Toggles the search input focus and shows the clear search button.
     * 
     * @memberof ProfitLossReportGridComponent
     */
    public toggleSearch() {
        this.showClearSearch = true;

        setTimeout(() => {
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * Cleans up by unsubscribing from the store listeners and completing the destroyed$ subject.
     * 
     * @memberof ProfitLossReportGridComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles clicks outside the search input. If clicked outside, hides the clear search button
     * unless the search input has a value.
     * 
     * @param {Event} event - The click event
     * @param {HTMLElement} el - The search input element
     * @memberof ProfitLossReportGridComponent
     */
    public clickedOutside(event, el) {
        if (this.plSearchControl?.value !== null && this.plSearchControl?.value !== '') {
            return;
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Checks if an element is a child of the given parent element.
     * 
     * @param {HTMLElement} c - The child element
     * @param {HTMLElement} p - The parent element
     * @returns {boolean} - Returns true if the element is a child of the parent
     * @memberof ProfitLossReportGridComponent
     */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
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
    private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
        let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
        each(data, (grp: ChildGroup) => {
            if (grp.isIncludedInSearch) {
                if (!grp.level1) {
                    if (parentGroups?.indexOf(grp?.uniqueName) === -1) {
                        grp.isCreated = false;
                        grp.isVisible = isVisible;
                        grp.isOpen = isVisible;
                    } else {
                        grp.isOpen = isVisible;
                    }
                } else {
                    grp.isOpen = true;
                }
                each(grp.accounts, (acc: Account) => {
                    if (acc.isIncludedInSearch) {
                        acc.isCreated = true;
                        acc.isVisible = isVisible;
                    }
                });
                this.toggleVisibility(grp.childGroups, isVisible);
            }
        });
    }
}
