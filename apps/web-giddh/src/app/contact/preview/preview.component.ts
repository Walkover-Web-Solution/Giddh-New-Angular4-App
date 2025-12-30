import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";
import { takeUntil, take, debounceTime, distinctUntilChanged, delay, skip, filter } from 'rxjs/operators';
import * as dayjs from "dayjs";
import { BranchHierarchyType, Configuration, PAGINATION_LIMIT } from "../../app.constant";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { ContactComponentStore } from "../utility/contact.store";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { ContactAdvanceSearchModal } from "../../models/api-models/Contact";
import { AccountsAction } from "../../actions/accounts.actions";
import { AccountRequestV2 } from "../../models/api-models/Account";
import { cloneDeep } from "../../lodash-optimized";
import { AccountingGroupEnum } from "../../shared/Enums/common.enum";
import { environment } from "apps/web-giddh/src/environments/environment";
import { ServiceConfig } from "../../services/service.config";
@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [ContactComponentStore],
    standalone:false
})
export class ContactPreviewComponent implements OnInit, OnDestroy {
    /** Reference to the virtual scroll viewport used for scrolling contact lists */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    /** Reference to the delete account modal dialog */
    @ViewChild("deleteAccountModal") public deleteAccountModal: TemplateRef<any>;
    /** Reference to the delete account modal dialog */
    public deleteAccountmodalRef: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Flag to prevent duplicate API calls during account updates */
    private isAccountUpdateInProgress: boolean = false;
    /** Holds localized text for this component */
    public localeData: any = {};
    /** Holds common localized text used across the app */
    public commonLocaleData: any = {};
    /** Reference to the dayjs library for date manipulation */
    public dayjs: any = dayjs;
    /** Index of the currently selected tab */
    public selectedTabIndex: number = 0;
    /** Holds advanced filter keys for contact search */
    public advanceFilters: any = {
        page: 1,
        count: PAGINATION_LIMIT,
        q: '',
        sort: '',
        sortBy: ''
    };
    /** Form control for the contact search input */
    public search: FormControl = new FormControl('');
    /** List of all contacts fetched for preview */
    public contactList: any[] = [];
    /** Currently selected contact object */
    public selectedContact: any;
    /** Type of contact (e.g., customer, vendor) */
    public contactType: any = '';
    /** Total number of result pages for contacts */
    public totalPages: number = 0;
    /** Stores route or query parameters relevant to the view */
    public params: any = {};
    /** Flag to show/hide payment details */
    public showPaymentDetails: boolean;
    /** Flag indicating if the current mode is company mode */
    public isCompany: boolean;
    /** Flag indicating if the current branch is a consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Stores text and link for the 'Create New Voucher' action */
    public createNewVoucher: any = {
        text: '',
        link: ''
    };
    /** Flag indicating if the component is in update mode */
    public isUpdateMode: boolean;
    /** Array of page numbers that have data present in the list */
    private pageNumberHistory: any[] = [];
    /** Flag indicating if a search operation is in progress */
    public isSearching: boolean;
    /** Counter for the number of 'get all contacts' API calls made */
    private getAllApiCallCount: number = 0;
    /** Stores the current route's query parameters */
    public queryParams: any = {};
    /** Stores the image path for use in web and electron apps */
    public imgPath: string = '';
    /** Flag indicating if the page needs to be refreshed */
    private isRefresh: boolean = null;
    /** Flag to prevent duplicate API calls after account deletion */
    private isRefreshingAfterDelete: boolean = false;
    /** Observable indicating if account data is being loaded */
    public getAccountsInProgress$: Observable<any> = this.componentStore.getLastAccountsInProgress$;
    /** Observable for the list of branches in the current company */
    public currentCompanyBranches$: Observable<any>;
    /** List of branches for the current company */
    public currentCompanyBranches: Array<any>;
    /** Object representing the currently selected branch */
    public currentBranch: any = { name: "", uniqueName: "" };
    /** Object representing the currently active company */
    public activeCompany: any;
    /** Object representing data for the currently selected branch */
    public currentBranchData: any;
    /** Holds the organization type of the current company */
    public currentOrganizationType: OrganizationType;
    /** Sorting key for contact list (default: name) */
    public key: string = "name";
    /** Sorting order for contact list (default: asc) */
    public order: string = "asc";
    /** Flag indicating if more contact data is being loaded */
    public isLoadMore: boolean;
    /** Flag indicating if the selected contact was not found */
    public isContactNotFound: boolean = false;
    /** Flag indicating if GST is enabled for the account */
    public isGstEnabledAcc: boolean = false;
    /** Flag indicating if HSN/SAC is enabled for the account */
    public isHsnSacEnabledAcc: boolean = false;
    /** Observable indicating if an account update is in progress */
    public updateAccountInProcess$: Observable<boolean> = this.componentStore.updateAccountInProcess$;
    /** Observable indicating if an account update was successful */
    public updateAccountIsSuccess$: Observable<boolean> = this.componentStore.updateAccountIsSuccess$;
    /** Observable indicating if an account delete was successful */
    public isDeleteAccSuccess$: Observable<any> = this.componentStore.isDeleteAccSuccess$;
    /** Observable indicating if an account create was successful */
    public createAccountIsSuccess$: Observable<any> = this.componentStore.createAccountIsSuccess$;
    /** Observable indicating if an account delete was successful */
    public lastDeletedAccountUniqueName$: Observable<any> = this.componentStore.lastDeletedAccountUniqueName$;
    /** Observable for the currently active account */
    public activeAccount$: Observable<any> = this.componentStore.activeAccount$;
    /** Observable for the unique name of the currently active group */
    public activeGroupUniqueName$: Observable<string> = this.componentStore.activeGroupUniqueName$;
    /** Observable indicating if virtual account is enabled */
    public virtualAccountEnable$: Observable<any> = this.componentStore.virtualAccountEnable$;
    /** Observable indicating if account statement is in progress */
    public getAccountStatementInProgress$: Observable<boolean> = this.componentStore.getAccountStatementInProgress$;
    /** Flag to show/hide bank details section */
    public showBankDetailPreview: boolean = false;
    /** Flag to show/hide contact preview section */
    public contactPreview: boolean = false;
    /** Flag to show/hide virtual account section */
    public showVirtualAccount: boolean = false;
    /** Flag indicating if the current group is a debtor/creditor */
    public isDebtorCreditor: boolean = false;
    /** List of options for flat group selection */
    public flatGroupsOptions: any[] = [];
    /** Stores details of the currently selected account */
    public accountDetails: any = {};
    /** Unique name of the currently active account */
    public activeAccountUniqueName: string;
    /** Name of the currently active contact tab */
    public contactActiveTab: string;
    /** Unique name of the parent group of the selected account */
    public parentGroupUniqueName: string;
    /** Model for advanced search request in contacts */
    public advanceSearchRequestModal: ContactAdvanceSearchModal = new ContactAdvanceSearchModal();
    /** Observable for the list of contacts fetched from the store */
    public getContactsList$: Observable<any> = this.componentStore.getContactsList$;
    /** Observable indicating if the edit account modal should be shown */
    public showEditAccount$: Observable<boolean> = this.componentStore.showEditAccount$;
    /** Enum representing standard accounting group unique names */
    public AccountingGroupEnum = AccountingGroupEnum;
    /** Listens for Master open/close event, required to load the data once master is closed */
    public isAddAndManageOpenedFromOutside$: Observable<boolean> = this.componentStore.isAddAndManageOpenedFromOutside$;
    /** Holds true if master is open */
    public isMasterOpen: boolean = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStore: ContactComponentStore,
        private activatedRoute: ActivatedRoute,
        private generalService: GeneralService,
        private changeDetection: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
        private accountsAction: AccountsAction,
        @Inject(ServiceConfig) private serviceConfig
    ) {
    }

    /**
    * Initializes the component
    *
    * @memberof ContactPreviewComponent
    */
    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.componentStore.currentCompanyBranches$;
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.componentStore.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map((branch: any) => ({
                    label: branch?.name,
                    value: branch?.uniqueName,
                    name: branch?.name,
                    parentBranch: branch?.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : "",
                    value: this.activeCompany ? this.activeCompany.uniqueName : "",
                    isCompany: true,
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : "";
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : "",
                            alias: this.activeCompany ? this.activeCompany.nameAlias : "",
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : "",
                        };
                    }
                    this.currentBranchData = cloneDeep(this.currentBranch);
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        this.isAddAndManageOpenedFromOutside$.pipe(takeUntil(this.destroyed$)).subscribe((isAddAndManageOpenedFromOutside) => {
            this.isMasterOpen = isAddAndManageOpenedFromOutside;
            if (!isAddAndManageOpenedFromOutside) {
                this.store.dispatch(this.accountsAction.resetActiveAccount());
                this.lastDeletedAccountUniqueName$?.pipe(take(1)).subscribe(response => {
                    if (response && this.queryParams.accountUniqueName === response) {
                        this.isRefreshingAfterDelete = true;
                        this.contactList = [];
                        this.advanceFilters.page = 1;
                        this.advanceFilters.q = '';
                        this.getContactsListData(this.advanceFilters.from, this.advanceFilters.to, this.advanceFilters.page, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                        this.router.navigate([], {
                            relativeTo: this.activatedRoute,
                            queryParams: { accountUniqueName: this.queryParams.accountUniqueName },
                            queryParamsHandling: 'merge', // keeps other params
                            replaceUrl: true // optionally replace history entry
                        }).then(() => {
                            setTimeout(() => {
                                this.isRefreshingAfterDelete = false;
                            }, 100);
                        });
                    } else {
                        this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedContact?.uniqueName));
                    }
                });
            }
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.selectedContact?.uniqueName) {
                this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedContact.uniqueName));
            }
        });

        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            if (params) {
                this.params = params;
                this.contactActiveTab = params?.type;
                let groupUniqueName = (this.contactActiveTab === "customer") ? this.AccountingGroupEnum.SundryDebtors : this.AccountingGroupEnum.SundryCreditors;
                this.activeGroupUniqueName$ = of(groupUniqueName);
                this.parentGroupUniqueName = groupUniqueName;
            }
        });

        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
            if (queryParams && !this.isAccountUpdateInProgress) {
                this.isSearching = false;
                this.selectedContact = null;
                this.queryParams = queryParams;
                this.activeAccountUniqueName = queryParams?.accountUniqueName;
                this.advanceFilters.page = Number(queryParams.page);
                this.advanceFilters.count = queryParams.count ? Number(queryParams.count) : PAGINATION_LIMIT;
                this.advanceFilters.from = queryParams.from ?? '';
                this.advanceFilters.to = queryParams.to ?? '';
                this.advanceFilters.q = queryParams.search ?? '';
                this.advanceFilters.refresh = queryParams.refresh ?? true;
                if (queryParams.sort && queryParams.sortBy) {
                    this.key = queryParams.sortBy;
                    this.order = queryParams.sort;
                } else {
                    this.key = (this.contactActiveTab === "vendor") ? "amountDue" : "name";
                    this.order = (this.contactActiveTab === "vendor") ? "desc" : "asc";
                }
                const searchString = queryParams.search;
                if (searchString) {
                    // Update the search input to show the search term
                    this.search.patchValue(searchString, { emitEvent: false });
                    // Manually trigger the search since we disabled events
                    this.getContactsListData(this.advanceFilters.from, this.advanceFilters.to, this.advanceFilters.page, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                } else {
                    if (!this.isRefreshingAfterDelete) {
                        this.getContactsListData(this.advanceFilters.from, this.advanceFilters.to, this.advanceFilters.page, this.advanceFilters.refresh, PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                    }
                }
            }
        });

        this.componentStore.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.parentGroups[0]?.uniqueName) {
                this.showBankDetailPreview = response?.parentGroups?.some(parent => parent?.uniqueName === 'sundrycreditors') ? true : false;
                let col = response.parentGroups[0]?.uniqueName;
                this.isHsnSacEnabledAcc = col === this.AccountingGroupEnum.RevenueFromOperations || col === this.AccountingGroupEnum.OtherIncome || col === this.AccountingGroupEnum.OperatingCost || col === this.AccountingGroupEnum.IndirectExpenses;
                this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                this.changeDetection.detectChanges();
            }
        });
        this.componentStore.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.uniqueName === this.AccountingGroupEnum.SundryCreditors || response.uniqueName === this.AccountingGroupEnum.SundryDebtors) {
                    this.isDebtorCreditor = true;
                }
                this.virtualAccountEnable$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response.companyCashFreeSettings && response.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && (this.parentGroupUniqueName === this.AccountingGroupEnum.SundryDebtors)) {
                        this.showVirtualAccount = true;
                    } else {
                        this.showVirtualAccount = false;
                    }
                });
            }
        });

        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                // Reset Filter
                this.pageNumberHistory = [1];
                this.advanceFilters = {
                    page: 1,
                    from: this.advanceFilters.from,
                    to: this.advanceFilters.to,
                    count: PAGINATION_LIMIT,
                    q: '',
                    sort: '',
                    sortBy: ''
                };
                this.isSearching = true;
                this.advanceFilters.q = search;
                this.getContactsListData(this.advanceFilters.from, this.advanceFilters.to, this.advanceFilters.page, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });

        this.isDeleteAccSuccess$?.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && !this.isMasterOpen) {
                this.isRefreshingAfterDelete = true;
                this.contactList = [];
                this.advanceFilters.page = 1;
                this.advanceFilters.q = '';
                this.getContactsListData(this.advanceFilters.from, this.advanceFilters.to, this.advanceFilters.page, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: { accountUniqueName: this.queryParams.accountUniqueName },
                    queryParamsHandling: 'merge', // keeps other params
                    replaceUrl: true // optionally replace history entry
                }).then(() => {
                    setTimeout(() => {
                        this.isRefreshingAfterDelete = false;
                    }, 100);
                });
            }
        });

        // Single subscription to handle all getContactsList responses
        this.componentStore.getContactsList$.pipe(skip(1), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.handleGetAllContactResponse(res);
            }
        });
    }

    /**
 * Handles the selection of a group and updates the active group unique name.
 * Sets the isDebtorCreditor flag if the group is sundrycreditors or sundrydebtors.
 *
 * @param {any} event The group selection event containing the group value.
 * @memberof ContactPreviewComponent
 */
    public isGroupSelected(event: any): void {
        if (event) {
            this.activeGroupUniqueName$ = of(event.value);
            // in case of sundrycreditors or sundrydebtors no need to show address tab
            if (event.value === this.AccountingGroupEnum.SundryCreditors || event.value === this.AccountingGroupEnum.SundryDebtors) {
                this.isDebtorCreditor = true;
            }
        }
    }

    /**
     * Shows the delete account modal dialog.
     *
     * @memberof ContactPreviewComponent
     */
    public showDeleteAccountModal(): void {
        this.deleteAccountmodalRef = this.dialog.open(this.deleteAccountModal);
    }

    /**
     * Hides the delete account modal dialog.
     *
     * @memberof ContactPreviewComponent
     */
    public hideDeleteAccountModal(): void {
        this.deleteAccountmodalRef?.close()
    }

    /**
     * Dispatches an action to update the currently selected account.
     *
     * @param {{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }} accRequestObject
     *        The object containing account update values and request details.
     * @memberof ContactPreviewComponent
     */
    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }, isPatch: boolean = false) {
        this.updateAccountInProcess$ = of(true);
        this.isAccountUpdateInProgress = true;

        if (isPatch) {
            this.store.dispatch(this.accountsAction.updateAccountV2Patch(accRequestObject?.value, accRequestObject.accountRequest));
        } else {
            accRequestObject.value.accountUniqueName = this.selectedContact?.uniqueName;
            this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject?.value, accRequestObject.accountRequest));
        }

        this.updateAccountIsSuccess$?.pipe(
            filter(response => response !== null && response !== undefined),
            take(1),
            takeUntil(this.destroyed$)
        ).subscribe(response => {
            this.updateAccountInProcess$ = of(false);
            if (response) {
                // Navigate to update query params, then reset the flag to allow normal API calls
                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: { accountUniqueName: accRequestObject?.value?.accountUniqueName },
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                }).then(() => {
                    // Reset flag after navigation to allow query param subscription to work
                    setTimeout(() => {
                        this.isAccountUpdateInProgress = false;
                        // Manually trigger contact list refresh after flag is reset
                        this.getContactsListData(
                            this.advanceFilters.from,
                            this.advanceFilters.to,
                            this.advanceFilters.page,
                            "true",
                            PAGINATION_LIMIT,
                            this.advanceFilters.q ?? '',
                            this.key,
                            this.order,
                            (this.currentBranch ? this.currentBranch.uniqueName : "")
                        );
                    }, 100);
                });
            } else {
                this.isAccountUpdateInProgress = false;
            }
        });
    }

    /**
     * Dispatches an action to delete the currently active account and hides the modal.
     *
     * @memberof ContactPreviewComponent
     */
    public deleteAccount(): void {
        let activeAccUniqueName = null;
        this.activeAccount$.pipe(take(1)).subscribe(account => activeAccUniqueName = account?.uniqueName);
        this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName, this.contactActiveTab));
        this.hideDeleteAccountModal();
    }

    /**
     * Handles the response from the get all contacts API.
     * Updates the contact list, handles pagination, and manages selected contact.
     *
     * @private
     * @param {*} response The API response containing contacts data.
     * @memberof ContactPreviewComponent
     */
    private handleGetAllContactResponse(response: any): void {
        if (response) {
            const currentContactList = [];
            if (this.pageNumberHistory[0] < response.page) {
                this.pageNumberHistory.push(response.page);
            } else if (!this.pageNumberHistory.includes(response.page)) {
                this.pageNumberHistory.unshift(response.page);
            }
            this.totalPages = response?.totalPages;

            if (this.totalPages === 0) {
                this.contactList = [];
                return;
            }

            response?.results?.forEach((item: any, index: number) => {
                item.index = index + 1;
                currentContactList.push(item);
            });

            if (this.isSearching && !this.isRefreshingAfterDelete) {
                // Handle page number is more than total pages in query params
                if (this.totalPages < this.advanceFilters.page) {
                    this.advanceFilters.page = 1;
                    this.getContactsListData(
                        this.advanceFilters.from,
                        this.advanceFilters.to,
                        this.advanceFilters.page,
                        "true",
                        PAGINATION_LIMIT,
                        this.advanceFilters.q ?? '',
                        this.key,
                        this.order,
                        (this.currentBranch ? this.currentBranch.uniqueName : "")
                    );
                    return;
                }
            }

            if ((this.isSearching || (this.advanceFilters.page === 1) && (this.pageNumberHistory.length === 1)) || this.isRefresh) {
                this.contactList = currentContactList;
            } else {
                this.contactList = this.advanceFilters.page === this.pageNumberHistory[this.pageNumberHistory.length - 1]
                    ? [...this.contactList, ...currentContactList]
                    : [...currentContactList, ...this.contactList];
            }
            this.getAllApiCallCount++;
            if (this.contactList?.length) {
                const exists = this.contactList.some(account => account.uniqueName === this.activeAccountUniqueName);
                if (exists && (!this.isSearching || this.advanceFilters.q)) {
                    this.selectedContact = this.contactList?.find(contact => contact?.uniqueName === this.activeAccountUniqueName);
                } else {
                    this.selectedContact = this.contactList[0];
                }
                this.accountDetails = this.selectedContact;
                this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedContact?.uniqueName));
            }
            this.isRefresh = false;
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Sets the selected contact by unique name and triggers account detail fetch.
     * If not found, sets the not found flag and clears the selection.
     *
     * @param {string} accountUniqueName The unique name of the contact to select.
     * @param {boolean} [isNewContactSelected=false] Whether a new contact is being selected.
     * @memberof ContactPreviewComponent
     */
    public setSelectedContact(accountUniqueName: string, isNewContactSelected: boolean = false): void {
        if (isNewContactSelected && this.selectedContact?.uniqueName === accountUniqueName) {
            return;
        }
        this.selectedContact = this.contactList?.find(contact => contact?.uniqueName === accountUniqueName);
        if (isNewContactSelected && this.selectedContact?.uniqueName) {
            this.accountDetails = this.selectedContact;
            this.isContactNotFound = false;
            this.store.dispatch(this.accountsAction.resetActiveAccount());
            this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedContact?.uniqueName));
        } else {
            this.selectedContact = null;
            this.isContactNotFound = true;
        }

    }

    /**
     * Navigates back to the previous contact list page based on the active tab.
     *
     * @memberof ContactPreviewComponent
     */
    public redirectToGetAllPage(): void {
        this.router.navigate([`/pages/contact/${this.contactActiveTab}`]);
    }

    /**
     * Handles the tab change event and updates the selected tab index.
     *
     * @param {MatTabChangeEvent} event The tab change event.
     * @memberof ContactPreviewComponent
     */
    public tabChanged(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    /**
     * Fetches the contact list from the service with the provided filters and parameters.
     *
     * @private
     * @param {string} fromDate The start date for filtering contacts.
     * @param {string} toDate The end date for filtering contacts.
     * @param {number} [pageNumber] The page number to fetch.
     * @param {string} [refresh] Whether to fetch fresh data ('true'/'false').
     * @param {number} [count=20] The number of contacts per page.
     * @param {string} [query] The search query string.
     * @param {string} [sortBy=''] The field to sort by (e.g., name, debitTotal).
     * @param {string} [order='asc'] The sort order ('asc' or 'desc').
     * @param {string} [branchUniqueName] The unique name of the branch to filter by.
     * @memberof ContactPreviewComponent
     */
    private getContactsListData(
        fromDate: string,
        toDate: string,
        pageNumber?: number,
        refresh?: string,
        count: number = PAGINATION_LIMIT,
        query?: string,
        sortBy: string = "",
        order: string = "asc",
        branchUniqueName?: string
    ): void {
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : "false";
        fromDate = (fromDate) ? fromDate : "";
        toDate = (toDate) ? toDate : "";
        let groupUniqueName = (this.contactActiveTab === "customer") ? this.AccountingGroupEnum.SundryDebtors : this.AccountingGroupEnum.SundryCreditors;

        this.componentStore.getContactsList({
            fromDate,
            toDate,
            groupUniqueName,
            pageNumber,
            refresh,
            count,
            query,
            sortBy,
            order,
            postData: this.advanceSearchRequestModal,
            branchUniqueName
        });
    }

    /**
     * Lifecycle hook for destroy.
     * Cleans up all subscriptions and resources used by the component.
     *
     * @memberof ContactPreviewComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
