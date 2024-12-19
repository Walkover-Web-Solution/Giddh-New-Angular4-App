import { trigger, state, style, transition, animate } from '@angular/animations';
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
import { AccountDetails } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'trial-balance-report-grid',
    templateUrl: './trial-balance-report-grid.component.html',
    styleUrls: [`./trial-balance-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("slideInOut", [
            state("in", style({
                transform: "translate3d(0, 0, 0)",
            })),
            state("out", style({
                transform: "translate3d(100%, 0, 0)",
            })),
            transition("in => out", animate("400ms ease-in-out")),
            transition("out => in", animate("400ms ease-in-out")),
        ]),
    ],
})
export class TrialBalanceReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Indicates if there is no data available */
    public noData: boolean;
    /** Controls the search input field for account search */
    public accountSearchControl: UntypedFormControl = new UntypedFormControl();
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Indicates whether the clear search button should be shown */
    public showClearSearch: boolean = false;
    /** The search query for filtering data */
    @Input() public search: string = '';
    /** The start date for the data range */
    @Input() public from: string = '';
    /** The end date for the data range */
    @Input() public to: string = '';
    /** The input search value for custom search */
    @Input() public searchInput: string = '';
    /** Padding left value for layout */
    @Input() public padLeft: number = 30;
    /** Controls the loading state for displaying loader */
    @Input() public showLoader: boolean;
    /** The data for account details */
    @Input() public data$: AccountDetails;
    /** Flag to control expand/collapse state for all groups */
    @Input() public expandAll: boolean;
    /** Emits the search value when it changes */
    @Output() public searchChange = new EventEmitter<string>()
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hides the data while a new search is made to refresh the virtual list */
    public hideData: boolean;
    /** True, when expand all button is toggled while search is enabled */
    public isExpandToggledDuringSearch: boolean;
    /** Account update modal state */
    public accountAsideMenuState: string = "out";
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** Holds account details */
    public accountDetails: any;

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

    }

    public ngOnInit() {
        this.accountSearchControl.valueChanges.pipe(
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

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.data$) {
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
                    if (this.data$) {
                        // always make first level visible ....
                        each(this.data$.groupDetails, (grp: ChildGroup) => {
                            if (grp.isIncludedInSearch) {
                                grp.isVisible = true;
                                grp.isCreated = true;
                                grp.isOpen = false;
                                each(grp.accounts, (acc: Account) => {
                                    if (acc.isIncludedInSearch) {
                                        acc.isVisible = false;
                                        acc.isCreated = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof TrialBalanceGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Triggers change detection for the component.
     * 
     * @memberof TrialBalanceReportComponent
     */ 
    public markForCheck() {
        this.cd.markForCheck();
    }

    /**
     * Provides a unique identifier for each item in a list for efficient rendering in Angular.
     * 
     * @param {number} index - The index of the current item
     * @param {ChildGroup} item - The current item in the list
     * @returns {string} The unique identifier of the item
     * @memberof TrialBalanceReportComponent
     */
    public trackByFn(index, item: ChildGroup) {
        return item?.uniqueName;
    }

    /**
     * Toggles the search input visibility and focuses on the search input field.
     * 
     * @memberof TrialBalanceReportComponent
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
     * Handles clicks outside the search input and clears the search input if it's empty.
     * 
     * @param {Event} event - The event triggered by the click action
     * @param {HTMLElement} el - The reference element to check if the click occurred inside it
     * @memberof TrialBalanceReportComponent
     */
    public clickedOutside(event, el) {
        if (this.accountSearchControl?.value !== null && this.accountSearchControl?.value !== '') {
            return;
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Checks if an element is a child of a specific parent element.
     * 
     * @param {EventTarget} c - The current element being checked
     * @param {HTMLElement} p - The parent element to check against
     * @returns {boolean} True if the current element is a child of the parent, otherwise false
     * @memberof TrialBalanceReportComponent
     */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    /**
     * Toggles group visibility
     *
     * @param {Array<ChildGroup>} group Groups received
     * @param {boolean} isVisible Current visibility status
     * @memberof TrialBalanceGridComponent
     */
    public toggleGroupVisibility(group: Array<ChildGroup>, isVisible: boolean): void {
        for (let groupIndex = 0; groupIndex < group?.length; groupIndex++) {
            const currentGroup: ChildGroup = group[groupIndex];
            if (currentGroup.isIncludedInSearch) {
                currentGroup.isCreated = isVisible;
                currentGroup.isVisible = isVisible;
                currentGroup.isOpen = isVisible;
                for (let accountIndex = 0; accountIndex < currentGroup.accounts?.length; accountIndex++) {
                    const currentAccount: Account = currentGroup.accounts[accountIndex];
                    if (currentAccount.isIncludedInSearch) {
                        currentAccount.isCreated = isVisible;
                        currentAccount.isVisible = isVisible;
                    }
                }
                if (currentGroup.childGroups?.length) {
                    this.toggleGroupVisibility(currentGroup.childGroups, isVisible);
                }
            }
        }
    }

    /**
     * Shows the account update modal
     *
     * @param {*} account
     * @memberof TrialBalanceGridComponent
     */
    public openAccountModal(account: any): void {
        this.accountDetails = account;
        this.activeGroupUniqueName = account?.parentGroups[account?.parentGroups?.length - 1]?.uniqueName;
        this.toggleAccountAsidePane();
    }

    /**
     * Toggle's account update modal
     *
     * @memberof TrialBalanceGridComponent
     */
     public toggleAccountAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === "out" ? "in" : "out";
        this.toggleBodyClass();
    }

    /**
     * Toggle's fixed class in body
     *
     * @memberof TrialBalanceGridComponent
     */
    public toggleBodyClass() {
        if (this.accountAsideMenuState === "in") {
            document.querySelector("body").classList.add("fixed");
        } else {
            document.querySelector("body").classList.remove("fixed");
        }
    }

    /**
     * Callback function on account modal close
     *
     * @param {*} event
     * @memberof TrialBalanceGridComponent
     */
    public getUpdatedList(event: any): void {
        this.toggleAccountAsidePane();
    }
}
