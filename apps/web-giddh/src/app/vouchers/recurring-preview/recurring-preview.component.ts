import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import * as dayjs from "dayjs";
import { BranchHierarchyType, Configuration, PAGINATION_LIMIT } from "../../app.constant";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { AccountsAction } from "../../actions/accounts.actions";
import { cloneDeep } from "../../lodash-optimized";
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { ServiceConfig } from "../../services/service.config";
import { ContactComponentStore } from "../../contact/utility/contact.store";
import { RecurrenceFormService } from "../../services/aside-recurring-voucher.service";

@Component({
    selector: "recurring-preview",
    templateUrl: "./recurring-preview.component.html",
    styleUrls: ["./recurring-preview.component.scss"],
    standalone: false
})
export class RecurringPreviewComponent implements OnInit, OnDestroy {
    /** Reference to the virtual scroll viewport used for scrolling contact lists */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds localized text for this component */
    public localeData: any = {};
    /** Holds common localized text used across the app */
    public commonLocaleData: any = {};
    /** Reference to the dayjs library for date manipulation */
    public dayjs: any = dayjs;
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
    /** List of all recurring vouchers fetched for preview */
    public recurringVoucherList: any[] = [];
    /** Currently selected recurring voucher object */
    public selectedRecurringVoucher: any;
    /** Type of contact (e.g., customer, vendor) */
    public contactType: any = '';
    /** Total number of result pages for contacts */
    public totalPages: number = 0;
    /** Stores route or query parameters relevant to the view */
    public params: any = {};
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
    public isRecurringNotFound: boolean = false;
    /** Flag to show/hide contact preview section */
    public contactPreview: boolean = false;
    /** Unique name of the currently active account */
    public activeAccountUniqueName: string;
    /** Name of the currently active contact tab */
    public recurringActiveTab: string;
    /** Observable for the unique name of the currently active group */
    public activeRecurringUniqueName$: Observable<string> = of('');
    /** Observable indicating if recurring voucher data is being loaded */
    public getRecurringVouchersInProgress$: Observable<any> = this.componentStore.getLastAccountsInProgress$;
    /** Rule details for the selected recurring voucher */
    public ruleDetails: any;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStore: ContactComponentStore,
        private activatedRoute: ActivatedRoute,
        private generalService: GeneralService,
        private changeDetection: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
        @Inject(ServiceConfig) private serviceConfig,
        private recurrenceFormService: RecurrenceFormService
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


        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            if (params) {
                console.log('Params:', params);
                this.params = params;
                this.recurringActiveTab = params?.voucherType;
            }
        });

        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
            if (queryParams) {
                console.log('Query params:', queryParams);
                this.isSearching = false;
                this.selectedRecurringVoucher = null;
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
                    this.key = (this.recurringActiveTab === "sales") ? "name" : "name";
                    this.order = (this.recurringActiveTab === "sales") ? "desc" : "asc";
                }
                console.log('Advance filters:', this.advanceFilters);
                const searchString = queryParams.search;
                if (searchString) {
                    // Update the search input to show the search term
                    this.search.patchValue(searchString, { emitEvent: false });
                    this.fetchRecurringVoucherRuleDetails();
                } else {
                    this.fetchRecurringVoucherRuleDetails();
                }
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
                console.log('Advance filters:', this.advanceFilters);
                this.fetchRecurringVoucherRuleDetails();
            }
        });

    }

    /**
     * Fetches recurring voucher details by calling getAll() and then getRuleDetails()
     * 
     * @private
     * @memberof RecurringPreviewComponent
     */
    private fetchRecurringVoucherRuleDetails(): void {
        const voucherType = this.recurringActiveTab === 'sales' ? 'sales' : 'purchase';
        this.recurrenceFormService.getAll(voucherType, {
            page: this.advanceFilters.page,
            count: this.advanceFilters.count,
            q: this.advanceFilters.q
        }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            console.log('Recurring voucher list:', response);
            if (response && response.body) {
                this.handleGetAllRecurringResponse(response.body);
                if (response.body.items?.length > 0) {
                    const recurringVoucherUniqueName = response.body.items[0].recurringVoucherUniqueName;
                    this.recurrenceFormService.getRuleDetails(
                        recurringVoucherUniqueName,
                        this.currentBranch?.uniqueName
                    ).pipe(takeUntil(this.destroyed$)).subscribe((ruleResponse) => {
                        if (ruleResponse) {
                            console.log('Rule details fetched:', ruleResponse);
                            this.ruleDetails = ruleResponse;
                            this.changeDetection.detectChanges();
                        }
                    });
                }
            }
        });
    }

    /**
     * Handles the response from the get all contacts API.
     * Updates the contact list, handles pagination, and manages selected contact.
     *
     * @private
     * @param {*} response The API response containing contacts data.
     * @memberof ContactPreviewComponent
     */
    private handleGetAllRecurringResponse(response: any): void {
        console.log('Recurring voucher list:', response);
        if (response) {
            const currentRecurringList = [];
            const page = response.page || this.advanceFilters.page;
            if (!this.pageNumberHistory.includes(page)) {
                this.pageNumberHistory.push(page);
            }
            this.totalPages = response?.totalPages || 0;

            if (this.totalPages === 0) {
                this.recurringVoucherList = [];
                this.changeDetection.detectChanges(); // added change detection call
                return;
            }

            if (response?.items) {
                response.items.forEach((item: any, index: number) => {
                    item.index = index + 1;
                    currentRecurringList.push(item);
                });
            } else {
                console.log('No items found in response:', response);
            }

            if (this.isSearching) {
                // Handle page number is more than total pages in query params
                if (this.totalPages < this.advanceFilters.page) {
                    this.advanceFilters.page = 1;
                    this.fetchRecurringVoucherRuleDetails();
                    return;
                }
            }

            if (this.advanceFilters.page === 1) {
                this.recurringVoucherList = currentRecurringList;
            } else {
                this.recurringVoucherList = [...this.recurringVoucherList, ...currentRecurringList];
            }
            this.getAllApiCallCount++;
            console.log('Recurring voucher list:', this.recurringVoucherList);
            if (this.recurringVoucherList?.length) {
                const exists = this.recurringVoucherList.some(voucher => voucher.recurringVoucherUniqueName === this.activeAccountUniqueName);
                if (exists && (!this.isSearching || this.advanceFilters.q)) {
                    this.selectedRecurringVoucher = this.recurringVoucherList?.find(voucher => voucher?.recurringVoucherUniqueName === this.activeAccountUniqueName);
                } else {
                    this.selectedRecurringVoucher = this.recurringVoucherList[0];
                }
            }
            console.log('Selected recurring voucher:', this.selectedRecurringVoucher);
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Sets the selected recurring voucher by unique name.
     * If found and selected, sets the not found flag to false.
     *
     * @param {string} voucherUniqueName The unique name of the recurring voucher to select.
     * @param {boolean} [isNewVoucherSelected=false] Whether a new voucher is being selected.
     * @memberof RecurringPreviewComponent
     */
    public setSelectedRecurringVoucher(voucherUniqueName: string, isNewVoucherSelected: boolean = false): void {
        if (isNewVoucherSelected && this.selectedRecurringVoucher?.recurringVoucherUniqueName === voucherUniqueName) {
            return;
        }
        this.selectedRecurringVoucher = this.recurringVoucherList?.find(voucher => voucher?.recurringVoucherUniqueName === voucherUniqueName);
        if (isNewVoucherSelected && this.selectedRecurringVoucher?.recurringVoucherUniqueName) {
            this.isRecurringNotFound = false;
        } else {
            this.isRecurringNotFound = true;
        }
        if (this.selectedRecurringVoucher) {
            this.recurrenceFormService.getRuleDetails(
                this.selectedRecurringVoucher.recurringVoucherUniqueName,
                this.currentBranch?.uniqueName
            ).pipe(takeUntil(this.destroyed$)).subscribe((ruleResponse) => {
                if (ruleResponse) {
                    console.log('Rule details fetched:', ruleResponse);
                    this.ruleDetails = ruleResponse;
                    this.changeDetection.detectChanges();
                }
            });
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Navigates back to the previous contact list page based on the active tab.
     *
     * @memberof ContactPreviewComponent
     */
    public redirectToGetAllPage(): void {
        this.router.navigate([`/pages/vouchers/recurring/${this.recurringActiveTab}`]);
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
