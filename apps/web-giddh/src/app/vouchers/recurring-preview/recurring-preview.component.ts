import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewChild, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import * as dayjs from "dayjs";
import { BranchHierarchyType, PAGINATION_LIMIT } from "../../app.constant";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { cloneDeep } from "../../lodash-optimized";
import { ServiceConfig } from "../../services/service.config";
import { ContactComponentStore } from "../../contact/utility/contact.store";
import { RecurrenceFormService } from "../../services/aside-recurring-voucher.service";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";

@Component({
    selector: "recurring-preview",
    templateUrl: "./recurring-preview.component.html",
    styleUrls: ["./recurring-preview.component.scss"],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Component for previewing and managing recurring voucher details.
 * Displays recurring voucher list, selected voucher details, and child vouchers.
 * Implements OnPush change detection strategy with Angular signals for optimal performance.
 */
export class RecurringPreviewComponent implements OnDestroy {
    /** Reference to the virtual scroll viewport used for scrolling contact lists */
    @ViewChild(CdkVirtualScrollViewport) public cdkScrollbar: CdkVirtualScrollViewport;
    /** Subject for managing component destruction and cleanup of subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    // Signals for reactive state management
    /** Holds localized text for this component */
    public readonly localeData = signal<any>({});
    /** Holds common localized text used across the app */
    public readonly commonLocaleData = signal<any>({});
    /** List of all recurring vouchers fetched for preview */
    public readonly recurringVoucherList = signal<any[]>([]);
    /** Currently selected recurring voucher object */
    public readonly selectedRecurringVoucher = signal<any>(null);
    /** Type of contact (e.g., customer, vendor) */
    public readonly contactType = signal<string>('');
    /** Total number of result pages for contacts */
    public readonly totalPages = signal<number>(0);
    /** Stores route or query parameters relevant to the view */
    public readonly params = signal<{ voucherType: string, recurringVoucherUniqueName: string } | null>(null);
    /** Flag indicating if the current mode is company mode */
    public readonly isCompany = signal<boolean>(false);
    /** Flag indicating if the current branch is a consolidated branch */
    public readonly isConsolidatedBranch = signal<boolean>(false);
    /** Stores text and link for the 'Create New Voucher' action */
    public readonly createNewVoucher = signal<any>({ text: '', link: '' });
    /** Flag indicating if the component is in update mode */
    public readonly isUpdateMode = signal<boolean>(false);
    /** Flag indicating if a search operation is in progress */
    public readonly isSearching = signal<boolean>(false);
    /** Stores the current route's query parameters */
    public readonly queryParams = signal<any>({});
    /** Stores the image path for use in web and electron apps */
    public readonly imgPath = signal<string>('');
    /** List of branches for the current company */
    public readonly currentCompanyBranches = signal<Array<any>>([]);
    /** Object representing the currently selected branch */
    public readonly currentBranch = signal<any>({ name: "", uniqueName: "" });
    /** Object representing the currently active company */
    public readonly activeCompany = signal<any>(null);
    /** Object representing data for the currently selected branch */
    public readonly currentBranchData = signal<any>(null);
    /** Sorting key for contact list (default: name) */
    public readonly key = signal<string>("name");
    /** Sorting order for contact list (default: asc) */
    public readonly order = signal<string>("asc");
    /** Flag indicating if more contact data is being loaded */
    public readonly isLoadMore = signal<boolean>(false);
    /** Flag indicating if the selected contact was not found */
    public readonly isRecurringNotFound = signal<boolean>(false);
    /** Flag to show/hide contact preview section */
    public readonly contactPreview = signal<boolean>(false);
    /** Unique name of the currently active account */
    public readonly activeAccountUniqueName = signal<string>('');
    /** Name of the currently active contact tab */
    public readonly recurringActiveTab = signal<string>('');
    /** Rule details for the selected recurring voucher */
    public readonly ruleDetails = signal<any>(null);
    /** Account unique name for the selected recurring voucher */
    public readonly selectedAccountUniqueName = signal<string>('');
    /** Voucher unique name for the selected recurring voucher */
    public readonly selectedVoucherUniqueName = signal<string>('');
    /** Dynamic query parameters for voucher view link */
    public readonly voucherQueryParams = signal<any>({ page: 1, count: 50, from: '', to: '', isRecurringVoucher: true });

    // Private signals
    /** Tracks pagination history to avoid duplicate API calls */
    private pageNumberHistory = signal<any[]>([]);
    /** Counter for API calls to manage pagination state */
    private getAllApiCallCount = signal<number>(0);
    /** Advanced filter configuration for API requests */
    private advanceFilters = signal<any>({
        page: 1,
        count: PAGINATION_LIMIT,
        q: '',
        sort: '',
        sortBy: '',
        from: '',
        to: ''
    });

    // Reference to the dayjs library for date manipulation
    /** Reference to dayjs library for date formatting and manipulation */
    public readonly dayjs: any = dayjs;

    // Observable for the list of branches in the current company
    /** Observable stream of branches for the current company */
    public currentCompanyBranches$: Observable<any>;
    /** Observable for the unique name of the currently active group */
    public readonly activeRecurringUniqueName$: Observable<string> = of('');
    /** Observable indicating if recurring voucher data is being loaded */
    public getRecurringVouchersInProgress$: Observable<any>;

    // Organization type
    /** Current organization type (Company or Branch) */
    public currentOrganizationType: OrganizationType;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStore: ContactComponentStore,
        private activatedRoute: ActivatedRoute,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
        @Inject(ServiceConfig) private serviceConfig,
        private recurrenceFormService: RecurrenceFormService,
        private vouchersUtilityService: VouchersUtilityService
    ) {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.componentStore.currentCompanyBranches$;
        this.getRecurringVouchersInProgress$ = this.componentStore.getLastAccountsInProgress$;
        this.isCompany.set(this.generalService.currentOrganizationType === OrganizationType.Company);
        this.imgPath.set(serviceConfig.IMG_PATH);

        // Initialize component with subscriptions
        this.initializeBranches();
        this.initializeRouteParams();
    }

    /**
     * Initializes branches from the component store
     * Subscribes to branch updates and sets up branch selection logic
     * @private
     */
    private readonly initializeBranches = (): void => {
        this.componentStore.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.length) {
                const branches = response.map((branch: any) => ({
                    label: branch?.name,
                    value: branch?.uniqueName,
                    name: branch?.name,
                    parentBranch: branch?.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                branches.unshift({
                    label: this.activeCompany()?.name || '',
                    name: this.activeCompany()?.name || "",
                    value: this.activeCompany()?.uniqueName || "",
                    isCompany: true,
                });
                this.currentCompanyBranches.set(branches);

                if (!this.currentBranch()?.uniqueName) {
                    let currentBranchUniqueName;
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch.set(cloneDeep(response.find((branch: any) => branch?.uniqueName === currentBranchUniqueName)));
                    } else {
                        currentBranchUniqueName = this.activeCompany()?.uniqueName || "";
                        this.currentBranch.set({
                            name: this.activeCompany()?.name || "",
                            alias: this.activeCompany()?.nameAlias || "",
                            uniqueName: this.activeCompany()?.uniqueName || "",
                        });
                    }
                    this.currentBranchData.set(cloneDeep(this.currentBranch()));
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    };

    /**
     * Initializes route parameters from activated route
     * Subscribes to route params and query params to set up component state
     * @private
     */
    private readonly initializeRouteParams = (): void => {
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            if (params) {
                const { voucherType, recurringVoucherUniqueName} = params;
                this.params.set({ voucherType, recurringVoucherUniqueName});
                this.recurringActiveTab.set(voucherType);
            }
        });

        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
            if (queryParams) {
                this.isSearching.set(false);
                this.selectedRecurringVoucher.set(null);
                this.queryParams.set(queryParams);
                this.activeAccountUniqueName.set(queryParams?.recurringVoucherUniqueName);

                const filters = {
                    page: Number(queryParams.page),
                    count: queryParams.count ? Number(queryParams.count) : PAGINATION_LIMIT,
                    q: queryParams.search ?? '',
                    sort: '',
                    sortBy: '',
                    from: queryParams.from ?? '',
                    to: queryParams.to ?? '',
                    refresh: queryParams.refresh ?? true
                };
                this.advanceFilters.set(filters);

                this.voucherQueryParams.set({
                    page: filters.page,
                    count: filters.count,
                    from: filters.from,
                    to: filters.to,
                    isRecurringVoucher: true
                });

                if (queryParams.sort && queryParams.sortBy) {
                    this.key.set(queryParams.sortBy);
                    this.order.set(queryParams.sort);
                } else {
                    this.key.set("name");
                    this.order.set("asc");
                }

                this.fetchRecurringVoucherRuleDetails();
            }
        });
    };

    /**
     * Fetches recurring voucher details by calling getAll() and then getRuleDetails()
     * Retrieves list of recurring vouchers and details for the first one
     * @private
     */
    private readonly fetchRecurringVoucherRuleDetails = (): void => {
        this.getAllRecurringVouchers();
    };

    /**
     * Fetches all recurring vouchers with pagination support
     * Supports bidirectional infinite scroll - load more on scroll down, load previous on scroll up
     * @public
     * @param {boolean} isLoadMore - Whether this is a load more request
     * @param {boolean} isScrollUp - Whether scrolling up (for previous page)
     * @memberof RecurringPreviewComponent
     */
    public readonly getAllRecurringVouchers = (isLoadMore: boolean = false, isScrollUp: boolean = false): void => {
        if (this.isLoadMore()) {
            return;
        }
        if (isLoadMore) {
            this.isLoadMore.set(true);
            const history = this.pageNumberHistory();
            const filters = this.advanceFilters();

            if (isScrollUp) {
                const firstLoadedPage = history.length > 0 ? Math.min(...history) : 1;
                if (firstLoadedPage <= 1) {
                    this.isLoadMore.set(false);
                    return;
                }
                filters.page = firstLoadedPage - 1;
                this.advanceFilters.set(filters);
            } else {
                const lastLoadedPage = history.length > 0 ? Math.max(...history) : 1;
                if (lastLoadedPage >= this.totalPages()) {
                    this.isLoadMore.set(false);
                    return;
                }
                filters.page = lastLoadedPage + 1;
                this.advanceFilters.set(filters);
            }
        }
        this.recurrenceFormService.getAll({
            page: this.advanceFilters().page,
            count: this.advanceFilters().count,
            from: this.advanceFilters().from,
            to: this.advanceFilters().to,
            sort: this.advanceFilters().sort,
            sortBy: this.advanceFilters().sortBy,
            q: this.advanceFilters().q,
            voucherType: this.vouchersUtilityService.parseVoucherType(this.params()?.voucherType)
        }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.body) {
                this.handleGetAllRecurringResponse(response.body, isScrollUp, isLoadMore);
                if (response.body.items?.length > 0 && !isLoadMore) {
                    const recurringVoucherUniqueName = this.activeAccountUniqueName() || response.body.items[0].recurringVoucherUniqueName;
                    this.recurrenceFormService.getRuleDetails(
                        recurringVoucherUniqueName,
                        this.currentBranch()?.uniqueName
                    ).pipe(takeUntil(this.destroyed$)).subscribe((ruleResponse) => {
                        const createdAt = response.body.items?.find((item: any) => item.recurringVoucherUniqueName === recurringVoucherUniqueName)?.createdAt;
                        if (createdAt) {
                            ruleResponse.body['createdAt']  = createdAt;
                        }
                        if (ruleResponse) {
                            this.ruleDetails.set(this.formatRuleDetailsDateFields(ruleResponse?.body));
                            this.selectedAccountUniqueName.set(ruleResponse?.body?.account?.uniqueName);
                            this.selectedVoucherUniqueName.set(ruleResponse?.body?.uniqueName);
                        }
                    });
                }
            }
            this.isLoadMore.set(false);
        });
    };

    /**
     * Handles the response from the getAll recurring vouchers API
     * Updates the recurring voucher list, handles pagination, and manages selected voucher
     * Supports bidirectional scrolling by prepending items for scroll up, appending for scroll down
     * @private
     * @param {any} response - The API response containing recurring vouchers data
     * @param {boolean} isScrollUp - Whether this was a scroll up request (load previous page)
     * @param {boolean} isLoadMore - Whether this is a load more request (not initial load)
     */
    private readonly handleGetAllRecurringResponse = (response: any, isScrollUp: boolean = false, isLoadMore: boolean = false): void => {
        if (response) {
            const currentRecurringList = [];
            const page = response.page || this.advanceFilters().page;
            const history = this.pageNumberHistory();
            if (!history.includes(page)) {
                this.pageNumberHistory.set([...history, page]);
            }
            this.totalPages.set(response?.totalPages || 0);

            if (this.totalPages() === 0) {
                this.recurringVoucherList.set([]);
                return;
            }

            if (response?.items) {
                response.items.forEach((item: any, index: number) => {
                    item.index = index + 1;
                    currentRecurringList.push(item);
                });
            }

            if (!isLoadMore && this.recurringVoucherList().length === 0) {
                this.recurringVoucherList.set(currentRecurringList);
                if (this.cdkScrollbar) {
                    this.cdkScrollbar.scrollToIndex(0);
                }
            } else if (isScrollUp) {
                const currentScrollIndex = this.cdkScrollbar?.measureScrollOffset('top') || 0;
                this.recurringVoucherList.set([...currentRecurringList, ...this.recurringVoucherList()]);
                setTimeout(() => {
                    if (this.cdkScrollbar) {
                        this.cdkScrollbar.scrollToIndex(currentRecurringList.length);
                    }
                }, 0);
            } else {
                this.recurringVoucherList.set([...this.recurringVoucherList(), ...currentRecurringList]);
            }
            this.getAllApiCallCount.set(this.getAllApiCallCount() + 1);
            if (this.recurringVoucherList()?.length) {
                const exists = this.recurringVoucherList().some(voucher => voucher.recurringVoucherUniqueName === this.activeAccountUniqueName());
                if (exists) {
                    this.selectedRecurringVoucher.set(this.recurringVoucherList()?.find(voucher => voucher?.recurringVoucherUniqueName === this.activeAccountUniqueName()));
                } else {
                    this.selectedRecurringVoucher.set(this.recurringVoucherList()[0]);
                }
            }
        }
    };

    /**
     * Sets the selected recurring voucher by unique name
     * Fetches rule details for the selected voucher and updates UI accordingly
     * @param {string} voucherUniqueName - The unique name of the recurring voucher to select
     * @param {boolean} [isNewVoucherSelected=false] - Whether a new voucher is being selected
     */
    public readonly setSelectedRecurringVoucher = (voucherUniqueName: string, isNewVoucherSelected: boolean = false): void => {
        if (isNewVoucherSelected && this.selectedRecurringVoucher()?.recurringVoucherUniqueName === voucherUniqueName) {
            return;
        }
        this.selectedRecurringVoucher.set(this.recurringVoucherList()?.find(voucher => voucher?.recurringVoucherUniqueName === voucherUniqueName));
        if (isNewVoucherSelected && this.selectedRecurringVoucher()?.recurringVoucherUniqueName) {
            this.isRecurringNotFound.set(false);
        } else {
            this.isRecurringNotFound.set(true);
        }
        if (this.selectedRecurringVoucher()) {
            this.recurrenceFormService.getRuleDetails(
                this.selectedRecurringVoucher().recurringVoucherUniqueName,
                this.currentBranch()?.uniqueName
            ).pipe(takeUntil(this.destroyed$)).subscribe((ruleResponse) => {
                if (ruleResponse) {
                    this.ruleDetails.set(this.formatRuleDetailsDateFields(ruleResponse?.body));
                    this.selectedAccountUniqueName.set(ruleResponse?.body?.account?.uniqueName);
                    this.selectedVoucherUniqueName.set(ruleResponse?.body?.uniqueName);
                }
            });
        }
    };

    /**
     * Navigates back to the recurring voucher list page
     * Uses the active tab (sales/purchase) to determine the route
     */
    public readonly redirectToGetAllPage = (): void => {
        this.router.navigate([`/pages/vouchers/preview/${this.recurringActiveTab()}/recurring`]);
    };

    /**
     * Converts date fields in ruleDetails object to GIDDH_DATE_FORMAT
     * Handles startDate, endDate, and nextInvoiceDate fields
     * @private
     * @param {any} ruleDetails - The rule details object to format
     * @returns {any} The formatted rule details object with converted dates
     */
    private readonly formatRuleDetailsDateFields = (ruleDetails: any): any => {
        if (!ruleDetails) {
            return ruleDetails;
        }

        const formattedDetails = cloneDeep(ruleDetails);

        if (formattedDetails.startDate && formattedDetails.startDate !== '--') {
            formattedDetails.startDate = dayjs(formattedDetails.startDate).format(GIDDH_DATE_FORMAT);
        }

        if (formattedDetails.endDate && formattedDetails.endDate !== '--') {
            formattedDetails.endDate = dayjs(formattedDetails.endDate).format(GIDDH_DATE_FORMAT);
        }

        if (formattedDetails.nextInvoiceDate && formattedDetails.nextInvoiceDate !== '--') {
            formattedDetails.nextInvoiceDate = dayjs(formattedDetails.nextInvoiceDate).format(GIDDH_DATE_FORMAT);
        }

        return formattedDetails;
    };

    /**
     * Generates dynamic query parameters for voucher view link with search parameter
     * @param voucherNumber - The voucher number to use as search parameter
     * @returns Query parameters object with search set to voucher number
     */
    public getVoucherQueryParams(voucherNumber: string): any {
        return {
            ...this.voucherQueryParams(),
            search: voucherNumber || ''
        };
    }

    /**
     * Angular lifecycle hook for component destruction
     * Cleans up all subscriptions and resources to prevent memory leaks
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
