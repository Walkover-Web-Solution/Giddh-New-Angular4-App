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
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { AccountDetails } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { forEach } from '../../../../lodash-optimized';

@Component({
selector: 'trial-balance-report-grid',
    templateUrl: './trial-balance-report-grid.component.html',
    styleUrls: [`./trial-balance-report-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TrialBalanceReportGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Reference to the search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Holds Create New Account Dialog Template Ref - COMMENTED OUT FOR ANGULAR 21 COMPATIBILITY */
    // @ViewChild('createNew', { static: true }) public createNew: TemplateRef<any>;
    /** Holds Create New Account Dialog Ref - COMMENTED OUT FOR ANGULAR 21 COMPATIBILITY */
    // public createNewAccountDialogRef: MatDialogRef<any>;
    /** The search query for filtering data */
    @Input() public search: string = '';
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
    @Output() public searchChange: EventEmitter<string> = new EventEmitter();
    /** Indicates if there is no data available */
    public noData: boolean;
    /** Controls the search input field for account search */
    public accountSearchControl: FormControl = new FormControl<string>('');
    /** Indicates whether the clear search button should be shown */
    public showClearSearch: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hides the data while a new search is made to refresh the virtual list */
    public hideData: boolean;
    /** True, when expand all button is toggled while search is enabled */
    public isExpandToggledDuringSearch: boolean;
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** Holds account details */
    public accountDetails: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private changeDetectionRef: ChangeDetectorRef,
        private zone: NgZone,
        public dialog: MatDialog,
        public generalService: GeneralService) {

    }

    /**
     * Initializes the component
     * 
     * @returns {void}
     * @memberof TrialBalanceReportGridComponent
     */
    public ngOnInit(): void {
        this.accountSearchControl.valueChanges.pipe(
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
    //ankit
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.data$) {
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
                    if (this.data$) {
                        // always make first level visible ....
                        this.data$.groupDetails.forEach((group: ChildGroup) => {
                            if (group.isIncludedInSearch) {
                                group.isVisible = true;
                                group.isCreated = true;
                                group.isOpen = false;
                                group.accounts.forEach((account: Account) => {
                                    if (account.isIncludedInSearch) {
                                        account.isVisible = false;
                                        account.isCreated = false;
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
     * @returns {void}
     * @memberof TrialBalanceGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Triggers change detection for the component.
     * 
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public markForCheck(): void {
        this.changeDetectionRef.markForCheck();
    }

    /**
     * Provides a unique identifier for each item in a list for efficient rendering in Angular.
     * 
     * @param {number} index - The index of the current item
     * @param {ChildGroup} item - The current item in the list
     * @returns {string} The unique identifier of the item
     * @memberof TrialBalanceReportComponent
     */
    public trackByFn(index: number, item: ChildGroup): string {
        return item?.uniqueName;
    }

    /**
     * Toggles the search input visibility and focuses on the search input field.
     * @returns {void}
     * @memberof TrialBalanceReportComponent
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
     * Handles clicks outside the search input and clears the search input if it's empty.
     * 
     * @param {Event} event - The event triggered by the click action
     * @param {ElementRef} element - The reference element to check if the click occurred inside it
     * @returns {void}
     * @memberof TrialBalanceReportComponent
     */
    public clickedOutside(event: any, element: ElementRef): void {
        if ((this.accountSearchControl?.value !== null && this.accountSearchControl?.value !== '') || this.generalService.childOf(event.target, element)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /**
     * Toggles group visibility
     *
     * @param {Array<ChildGroup>} group Groups received
     * @param {boolean} isVisible Current visibility status
     * @returns {void}
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
     * @param {any} account
     * @returns {void}
     * @memberof TrialBalanceGridComponent
     */
    public openAccountModal(account: any): void {
        if (account) {
            this.accountDetails = account;
            this.activeGroupUniqueName = account?.parentGroups[account?.parentGroups?.length - 1]?.uniqueName;
            // TODO: Replace with component-based dialog to avoid JIT compilation in Angular 21
            // this.createNewAccountDialogRef = this.dialog.open(this.createNew, ASIDE_PANE_CONFIG);
            console.warn('Account dialog temporarily disabled for Angular 21 compatibility');
        }
    }
}
