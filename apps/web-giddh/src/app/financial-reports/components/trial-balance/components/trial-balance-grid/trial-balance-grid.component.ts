import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
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
import { UntypedFormControl } from '@angular/forms';
import { DomUtilsHelper } from 'apps/web-giddh/src/app/shared/helpers/dom-utils.helper';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { AccountDetails } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { ReplaySubject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { FinancialReportsComponentStore } from '../../../../financial-reports.store';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';
import { each, forEach } from '../../../../../lodash-optimized';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'trial-balance-grid',
    templateUrl: './trial-balance-grid.component.html',
    styleUrls: [`./trial-balance-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone:false
})
/**
 * TrialBalanceGridComponent component
 * Handles trialbalancegrid functionality and user interactions
 */
export class TrialBalanceGridComponent implements OnInit, OnChanges, OnDestroy {

    public noData: boolean;
    public accountSearchControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Input() public searchInput: string = '';
    @Input() public padLeft: number = 30;
    @Input() public showLoader: boolean;
    @Input() public data$: AccountDetails;
    @Input() public expandAll: boolean;
    @Output() public searchChange = new EventEmitter<string>();
    /** Refresh event emitter */
    @Output() public refresh = new EventEmitter<string>();
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
    /** Template reference for aside menu account modal */
    @ViewChild("accountAsideMenuTemplate", { static: true }) public accountAsideMenuTemplate: TemplateRef<any>;
    /** Reference for account aside menu dialog */
    public accountAsideMenuDialogRef: MatDialogRef<any>;
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** Holds account details */
    public accountDetails: any;
    /** List of check groups accounts */
    private listOfCheckGroupsAccounts: any[] = [];
    /** Holds images folder path */
    public imgPath: string = "";


    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private cd: ChangeDetectorRef,
        private zone: NgZone,
        private financialReportsComponentStore: FinancialReportsComponentStore,
        private dialog: MatDialog,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig,
    ) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.accountSearchControl.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.hideData = true;
                this.searchChange.emit(this.searchInput);
                this.isExpandToggledDuringSearch = false;
                /**
                 * Handles if functionality
                 */
                if (newValue === '') {
                    this.showClearSearch = false;
                }
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.hideData = false;
                    this.cd.detectChanges();
                }, 10);
            });

        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res) {
                this.listOfCheckGroupsAccounts = [];
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.refresh.emit();
                }, 600);
            }
        });
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges) {
        /**
         * Handles if functionality
         */
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            /**
             * Handles if functionality
             */
            if (this.data$) {
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
                    /**
                     * Handles if functionality
                     */
                    if (this.data$) {
                        // always make first level visible ....
                        /**
                         * Handles each functionality
                         */
                        each(this.data$.groupDetails, (grp: ChildGroup) => {
                            /**
                             * Handles if functionality
                             */
                            if (grp.isIncludedInSearch) {
                                grp.isVisible = true;
                                grp.isCreated = true;
                                grp.isOpen = false;
                                /**
                                 * Handles each functionality
                                 */
                                each(grp.accounts, (acc: Account) => {
                                    /**
                                     * Handles if functionality
                                     */
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
     * Handles markForCheck functionality
     */
    public markForCheck() {
        this.cd.markForCheck();
    }

    /**
     * Handles trackByFn functionality
     */
    public trackByFn(index, item: ChildGroup) {
        return item?.uniqueName;
    }

    /**
     * Toggles search state
     */
    public toggleSearch() {
        this.showClearSearch = true;

        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * Handles clickedOutside functionality
     */
    public clickedOutside(event, el) {
        /**
         * Handles if functionality
         */
        if (this.accountSearchControl?.value !== null && this.accountSearchControl?.value !== '') {
            return;
        }

        /**
         * Handles if functionality
         */
        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /* tslint:disable */
    /**
     * Handles childOf functionality
     */
    public childOf(c, p) {
        return DomUtilsHelper.childOf(c, p);
    }

    /**
     * Toggles group visibility
     *
     * @param {Array<ChildGroup>} group Groups received
     * @param {boolean} isVisible Current visibility status
     * @memberof TrialBalanceGridComponent
     */
    public toggleGroupVisibility(group: Array<ChildGroup>, isVisible: boolean): void {
        /**
         * Handles for functionality
         */
        for (let groupIndex = 0; groupIndex < group?.length; groupIndex++) {
            const currentGroup: ChildGroup = group[groupIndex];
            /**
             * Handles if functionality
             */
            if (currentGroup.isIncludedInSearch) {
                currentGroup.isCreated = isVisible;
                currentGroup.isVisible = isVisible;
                currentGroup.isOpen = isVisible;
                /**
                 * Handles for functionality
                 */
                for (let accountIndex = 0; accountIndex < currentGroup.accounts?.length; accountIndex++) {
                    const currentAccount: Account = currentGroup.accounts[accountIndex];
                    /**
                     * Handles if functionality
                     */
                    if (currentAccount.isIncludedInSearch) {
                        currentAccount.isCreated = isVisible;
                        currentAccount.isVisible = isVisible;
                    }
                }
                /**
                 * Handles if functionality
                 */
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
        this.openAccountAsidePaneDialog();
    }

    /**
     * Opens the account aside pane dialog
     *
     * @memberof TrialBalanceGridComponent
     */
    public openAccountAsidePaneDialog(): void {
        this.accountAsideMenuDialogRef = this.dialog.open(this.accountAsideMenuTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Callback function on account modal close
     *
     * @param {*} event
     * @memberof TrialBalanceGridComponent
     */
    public getUpdatedList(event: any): void {
        this.accountAsideMenuDialogRef?.close();
    }

    /**
     * Unchecks all the accounts/groups in the grid
     *
     * @param {'group' | 'account'} [entityType='group'] type of entity
     * @private
     * @memberof TrialBalanceGridComponent
     */
    private uncheckAll(entityType: 'group' | 'account' = 'group'): void {
        this.extractCheckedAccountsGroups(this.data$.groupDetails, entityType);
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.listOfCheckGroupsAccounts?.length) {
                const model = {
                    request: {
                        reportType: ReportType.TRIAL_BALANCE,
                        from: this.from,
                        to: this.to,
                        branchUniqueName: this.generalService.currentBranchUniqueName
                    },
                    payload: this.listOfCheckGroupsAccounts
                };
                this.financialReportsComponentStore.tailedReportAccountGroup(model);
            }
        }, 400);
    }

    /**
     * Recursive function to extract checked accounts/groups and store it in listOfCheckGroupsAccounts.
     * It loops through the groupAccountDetails array and checks if the account/group is checked.
     * If checked, it adds the account/group to listOfCheckGroupsAccounts with checked set to false.
     * Then it recursively calls itself on the childGroups and accounts of the group.
     * @param groupAccountDetails array of account/group objects
     * @param entityType type of entity, either 'group' or 'account'
     * @memberof TrialBalanceGridComponent
     */
    private extractCheckedAccountsGroups(groupAccountDetails: any, entityType: 'group' | 'account'): void {
        (Array.isArray(groupAccountDetails) ? groupAccountDetails : []).forEach(groupAccount => {
            /**
             * Handles if functionality
             */
            if (groupAccount.checked) {
                this.listOfCheckGroupsAccounts.push({
                    uniqueName: groupAccount.uniqueName,
                    entityType,
                    checked: false
                });
            }
            /**
             * Handles if functionality
             */
            if (groupAccount.childGroups?.length) {
                this.extractCheckedAccountsGroups(groupAccount.childGroups, 'group');
            }
            /**
             * Handles if functionality
             */
            if (groupAccount.accounts?.length) {
                this.extractCheckedAccountsGroups(groupAccount.accounts, 'account');
            }
        });
    }

    /**
     * Opens a confirmation dialog to confirm the uncheck all action.
     *
     * @memberof TrialBalanceGridComponent
     */
    public openConfirmDialog(): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.commonLocaleData?.app_uncheck_all_item_message, this.commonLocaleData)
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response === this.commonLocaleData?.app_yes) {
                this.uncheckAll();
            }
        });
    }
}
