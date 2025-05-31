import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { async, debounceTime, delay, distinctUntilChanged, merge, Observable, of, ReplaySubject, take, takeUntil } from "rxjs";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { BranchHierarchyType, PAGINATION_LIMIT } from "../../app.constant";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { SafeUrl } from "@angular/platform-browser";
import { ContactComponentStore } from "../utility/contact.store";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { ContactAdvanceSearchModal } from "../../models/api-models/Contact";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AccountsAction } from "../../actions/accounts.actions";
import { AccountRequestV2 } from "../../models/api-models/Account";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [ContactComponentStore]
})
export class ContactPreviewComponent implements OnInit, OnDestroy {
    /** Instance of cdk scrollbar */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold day js reference */
    public dayjs: any = dayjs;
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Holds advance Filters keys */
    public advanceFilters: any = {
        page: 1,
        count: PAGINATION_LIMIT,
        q: '',
        sort: '',
        sortBy: ''
    };
    /** Holds search voucher form control */
    public search: FormControl = new FormControl('');
    /** Holds contact list */
    public contactList: any[] = [];
    /** Holds Current selected contact */
    public selectedContact: any;
    /** Hold contact  type */
    public contactType: any = '';
    /** Holds Total Results Count */
    public totalPages: number = 0;
    /** Holds params value */
    public params: any = {};
    /** Holds true show Payment Details enable */
    public showPaymentDetails: boolean;
    /** Holds true if company mode */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds create new voucher text and url */
    public createNewVoucher: any = {
        text: '',
        link: ''
    };
    /** Holds true if update mode */
    public isUpdateMode: boolean;
    /** Holds array of page numbers who date is present in list */
    private pageNumberHistory: any[] = [];
    /** Hold true if searching */
    public isSearching: boolean;
    /** Holds Get all api call count */
    private getAllApiCallCount: number = 0;
    /** Holds current route query parameters */
    public queryParams: any = {};
    /** Holds Image dynamic path for electron and web application */
    public imgPath: string = '';
    /** Holds true when need to refresh page */
    private isRefresh: boolean = null;
    /** Last vouchers get in progress Observable */
    public getAccountsInProgress$: Observable<any> = this.componentStore.getLastAccountsInProgress$;
    public isUpdateAccount: boolean = false;
    public isGstEnabledAcc: boolean = false;
    public isHsnSacEnabledAcc: boolean = false;
    public updateAccountInProcess$: Observable<boolean> = this.componentStore.updateAccountInProcess$;
    public updateAccountIsSuccess$: Observable<boolean> = this.componentStore.updateAccountIsSuccess$;
    public activeAccount$: Observable<any> = this.componentStore.activeAccount$;
    public activeGroupUniqueName$: Observable<string> = this.componentStore.activeGroupUniqueName$;
    public virtualAccountEnable$: Observable<any> = this.componentStore.virtualAccountEnable$;
    public showBankDetail: boolean = false;
    public showVirtualAccount: boolean = false;
    public isDebtorCreditor: boolean = false;
    public flatGroupsOptions: any[] = [];
    public accountDetails: any = {};
    public activeAccountUniqueName: string;
    public contactActiveTab: string;
    public parentGroupUniqueName: string;
    /** sorting */
    public key: string = "name"; // set default
    public order: string = "asc";
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: "", uniqueName: "" };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current branch data */
    public currentBranchData: any;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    public advanceSearchRequestModal: ContactAdvanceSearchModal = new ContactAdvanceSearchModal();
    public getContactsList$: Observable<any> = this.componentStore.getContactsList$;
    /** Holds true if invoice load more data is trigger */
    public isLoadMore: boolean;
    @ViewChild('deleteAccountModal', { static: true }) public deleteAccountModal: ModalDirective;
    public showEditAccount$: Observable<boolean> = this.componentStore.showEditAccount$;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStore: ContactComponentStore,
        private activatedRoute: ActivatedRoute,
        private generalService: GeneralService,
        private changeDetection: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
        private accountsAction: AccountsAction
    ) { }


    /**
    * Initializes the component
    *
    * @memberof ContactPreviewComponent
    */
    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.componentStore.currentCompanyBranches$;
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
                        this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : "";
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : "",
                            alias: this.activeCompany ? this.activeCompany.nameAlias : "",
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : "",
                        };
                    }
                    this.currentBranchData = _.cloneDeep(this.currentBranch);
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
        
        merge(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                console.log(params);
                
                let groupUniqueName = (this.contactActiveTab === "customer") ? "sundrydebtors" : "sundrycreditors";
                this.activeGroupUniqueName$ = of(groupUniqueName);
                this.parentGroupUniqueName = groupUniqueName;
                if (params?.accountUniqueName) {
                    this.activeAccountUniqueName = params?.accountUniqueName;
                    this.store.dispatch(this.accountsAction.resetActiveAccount());
                    this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountUniqueName));
                    this.contactActiveTab = params?.type;
                    this.params = params;
                    this.isSearching = false;
                    this.key = (this.contactActiveTab === "vendor") ? "amountDue" : "name";
                    this.order = (this.contactActiveTab === "vendor") ? "desc" : "asc";
                    this.subscribeStoreObservable();
                }
                if (params?.page) {
                    this.queryParams = params;
                    this.advanceFilters.page = Number(params.page);
                    this.advanceFilters.count = params.count ? Number(params.count) : PAGINATION_LIMIT;
                    this.advanceFilters.from = params.from ?? '';
                    this.advanceFilters.to = params.to ?? '';
                    const searchString = params.search;
                    if (searchString) {
                        this.search.setValue(searchString);
                    } else {
                        this.getContactsList(this.params.from, this.params.to, null, "true", PAGINATION_LIMIT, this.params.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                    }
                }
            }
        });

        this.componentStore.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.parentGroups[0]?.uniqueName) {
                let col = response.parentGroups[0]?.uniqueName;
                this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
            }
        });
        this.componentStore.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.uniqueName === 'sundrycreditors' || response.uniqueName === 'sundrydebtors') {
                    this.isDebtorCreditor = true;
                }
                this.virtualAccountEnable$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response.companyCashFreeSettings && response.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && (this.parentGroupUniqueName === 'sundrydebtors')) {
                        this.showVirtualAccount = true;
                    } else {
                        this.showVirtualAccount = false;
                    }
                });
            }
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
                this.getContactsList(this.advanceFilters.from, this.advanceFilters.to, null, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });
    }

    public isGroupSelected(event: any) {
        if (event) {
            this.activeGroupUniqueName$ = of(event.value);
            // in case of sundrycreditors or sundrydebtors no need to show address tab
            if (event.value === 'sundrycreditors' || event.value === 'sundrydebtors') {
                this.isDebtorCreditor = true;
            }
        }
    }

    public showDeleteAccountModal() {
        this.deleteAccountModal?.show();
    }

    public hideDeleteAccountModal() {
        this.deleteAccountModal?.hide();
    }

    public updateAccount(accRequestObject: { value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }) {
        console.log(accRequestObject);
        
        this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject?.value, accRequestObject.accountRequest));
    }

    public deleteAccount() {
        let activeAccUniqueName = null;
        this.activeAccount$.pipe(take(1)).subscribe(s => activeAccUniqueName = s?.uniqueName);
        let activeGrpName = this.contactActiveTab;
        this.store.dispatch(this.accountsAction.deleteAccount(activeAccUniqueName, activeGrpName));

        this.hideDeleteAccountModal();
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof ContactPreviewComponent
    */
    public translationComplete(event: any): void {
        if (event) {
        }
    }

    /**
     * Subscribe all required store observable
     *
     * @private
     * @memberof ContactPreviewComponent
     */
    private subscribeStoreObservable(): void {
        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.getAllApiCallCount > 0) {
                // Reset
                this.isSearching = false;
                this.isLoadMore = false;
                this.pageNumberHistory = [1];
                this.advanceFilters = {
                    page: 1,
                    from: dayjs(response[0]).format(GIDDH_DATE_FORMAT),
                    to: dayjs(response[1]).format(GIDDH_DATE_FORMAT),
                    count: PAGINATION_LIMIT,
                    q: '',
                    sort: '',
                    sortBy: ''
                };
                this.contactList = [];
                this.generalService.updateActivatedRouteQueryParams({ from: this.advanceFilters.from, to: this.advanceFilters.to });
            }
        });

    }

    /**
     * Handle Get All Voucher Response
     *
     * @private
     * @param {*} response
     * @memberof VouchersPreviewComponent
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

            // Handle page number is more than total pages in query params
            if (this.totalPages < this.advanceFilters.page) {
                this.advanceFilters.page = 1;
                this.getContactsList(this.advanceFilters.from, this.advanceFilters.to, null, "true", PAGINATION_LIMIT, this.advanceFilters.q ?? '', this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                return;
            }
            response.results?.forEach((item: any, index: number) => {
                item.index = index + 1;
                currentContactList.push(item);
            });

            if ((this.isSearching || (this.advanceFilters.page === 1) && (this.pageNumberHistory.length === 1)) || this.isRefresh) {
                this.contactList = currentContactList;
            } else {
                this.contactList = this.advanceFilters.page === this.pageNumberHistory[this.pageNumberHistory.length - 1] ? [...this.contactList, ...currentContactList] : [...currentContactList, ...this.contactList];
            }
            this.isLoadMore = false;
            this.getAllApiCallCount++;
            this.changeDetection.detectChanges();

            if (this.contactList?.length) {
                this.setSelectedContact(!this.selectedContact ? this.params.accountUniqueName : this.contactList[0].uniqueName);
            }
            this.isRefresh = false;
        }
    }

    /**
 * Set selected contact and download PDF Preview
 *
 * @param {string} accountUniqueName
 * @memberof ContactPreviewComponent
 */
    public setSelectedContact(accountUniqueName: string, isNewContactSelected: boolean = false): void {
        if (isNewContactSelected && this.selectedContact?.uniqueName === accountUniqueName) {
            return;
        }
        this.selectedContact = this.contactList?.find(contact => contact?.uniqueName === accountUniqueName);
        this.store.dispatch(this.accountsAction.resetActiveAccount());
        this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedContact?.uniqueName));
    }

    /**
     * Back to last page
     *
     * @memberof ContactPreviewComponent
     */
    public redirectToGetAllPage(): void {
        this.router.navigate([`/pages/contact/${this.contactActiveTab}`]);
    }

    /**
     * Handle Tab Change event
     *
     * @param {MatTabChangeEvent} event
     * @memberof ContactPreviewComponent
     */
    public tabChanged(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    /**
  * Method to fetch account details from service
  *
  * @private
  * @param {string} fromDate From date
  * @param {string} toDate To date
  * @param {string} groupUniqueName Group unique name ('sundrycreditors' or 'sundrydebtors')
  * @param {number} [pageNumber] Page number of the data to be fetched
  * @param {string} [refresh] If true, then fetch the most refreshed data instead of cached data
  * @param {number} [count=20] Page size
  * @param {string} [query] Query string to be searched such as customer name
  * @param {string} [sortBy=''] Sorting entity by which we need to sort such as debitTotal, creditTotal or name
  * @param {string} [order='asc'] Order of sorting (asc or desc)
  * @param {string} [branchUniqueName] Current branch selected
  * @memberof ContactComponent
  */
    private getContactsList(fromDate: string, toDate: string, pageNumber?: number, refresh?: string, count: number = PAGINATION_LIMIT, query?: string,
        sortBy: string = "", order: string = "asc", branchUniqueName?: string): void {
        pageNumber = pageNumber ? pageNumber : 1;    
        refresh = refresh ? refresh : "false";
        fromDate = (fromDate) ? fromDate : "";
        toDate = (toDate) ? toDate : "";
        let groupUniqueName = (this.contactActiveTab === "customer") ? "sundrydebtors" : "sundrycreditors";

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
        })

        this.componentStore.getContactsList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.handleGetAllContactResponse(res);
            }
        });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof ContactPreviewComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
