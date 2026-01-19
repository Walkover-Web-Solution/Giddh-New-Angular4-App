import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { PayPalClass, RazorPayClass } from '../../models/api-models/SettingsIntegraion';
import { cloneDeep, find } from '../../lodash-optimized';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of as observableOf, pairwise, ReplaySubject, startWith, Subject, take, takeUntil } from 'rxjs';
import { AppState } from '../../store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { ToasterService } from '../../services/toaster.service';
import { EMAIL_VALIDATION_REGEX, HttpMethod, IOption } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile } from '../constants/settings.constant';
import { ClipboardService } from 'ngx-clipboard';
import { Organization } from '../../models/api-models/Company';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerPortalComponentStore } from './utility/customer-portal.store';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'customer-portal',
    templateUrl: './customer.portal.component.html',
    styleUrls: ['./customer.portal.component.scss'],
    providers: [CustomerPortalComponentStore],
    standalone: false
})
/**
 * CustomerPortalComponent component
 * Handles customerportal functionality and user interactions
 */
export class CustomerPortalComponent implements OnInit, AfterViewInit {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the search results pagination details */
    public paypalAccountsSearchResultsPaginationData: any = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public paypalDefaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public paypalPreventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public paypalDefaultAccountPaginationData: any = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public accounts: IOption[];
    /**Observable for paypal accounts */
    public paypalAccounts$: Observable<IOption[]>;
    /** Stores the list of accounts */
    public paypalAccounts: IOption[];
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData: any = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Instance of razor pay obj */
    public razorPayObj: RazorPayClass = new RazorPayClass();
    /**Hold paypal request obj */
    public paypalObj: PayPalClass = new PayPalClass();
    /**True if paypal is update */
    public updatePaypal: boolean = false;
    /** Holds Linked account label for selected value */
    public linkedAccountLabel: string = '';
    /** Stores the type of the organization (company or profile)  */
    public organizationType: OrganizationType;
    /** Portal Domain name validation with regex pattern */
    public isValidDomain: boolean;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** This will hold portal url */
    public portalUrl: string = PORTAL_URL;
    /** Stores the profile data of an organization (company or profile) */
    public profileData: OrganizationProfile = {
        name: '',
        uniqueName: '',
        companyName: '',
        logo: '',
        alias: '',
        parent: {},
        country: {
            countryName: '',
            countryCode: '',
            currencyName: '',
            currencyCode: ''
        },
        businessTypes: [],
        businessType: '',
        nameAlias: '',
        headQuarterAlias: '',
        taxType: '',
        portalDomain: ''
    };
    public CompanySettingsObj: any = {};
    /** Holds Profile Form */
    public profileForm: FormGroup;
    /** This will hold region */
    public region: string;
    /** Holds Portal Login Url */
    public portalLoginUrl: string = "";
    /** Updated data by the user */
    public updatedData: any = {};
    /** Decides when to emit the value for UPDATE operation */
    public saveProfileSubject: Subject<any> = new Subject();
    /** Stores the current company details */
    public currentCompanyDetails: any;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    public updateRazor: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public accounts$: Observable<IOption[]>;
    /** True if default accounts api call in progress */
    public isDefaultAccountsLoading: boolean = true;
    /** True if default paypal accounts api call in progress */
    public isDefaultPaypalAccountsLoading: boolean = true;
    /** Hold previous paypal search value */
    private previousPaypalSearchQuery: string = null;
    /** Hold previous account search value */
    private previousAccountSearchQuery: string = null;
    /** Hold previous payu search value */
    private previousPayuSearchQuery: string = null;
    /** Holds Payu linked account label for selected value */
    public payuLinkedAccountLabel: string = '';
    /** True if default payu accounts api call in progress */
    public isDefaultPayuAccountsLoading: boolean = true;
    /**True if payu is update */
    public updatePayu: boolean = false;
    /** Form Group for payu form */
    public payuForm: FormGroup;
    /** Holds Store payu  API response state as observable*/
    public payuDetails$: Observable<any> = this.componentStore.select(state => state.payuDetails);
    /** Default search suggestion list to be shown for search */
    public payuDefaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public payuPreventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public payuDefaultAccountPaginationData: any = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details */
    public payuAccountsSearchResultsPaginationData: any = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /**Observable for payu accounts */
    public payuAccounts$: Observable<IOption[]>;
    /** Stores the list of accounts */
    public payuAccounts: IOption[];
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private generalService: GeneralService,
        private store: Store<AppState>,
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private toasty: ToasterService,
        private formBuilder: FormBuilder,
        private clipboardService: ClipboardService,
        public dialog: MatDialog,
        private settingsProfileActions: SettingsProfileActions,
        private componentStore: CustomerPortalComponentStore
    ) {
        this.initProfileForm();
        this.initPayuForm();
        // For GET
        this.componentStore.payuCrudOperation({ method: HttpMethod.GET });
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
    }

    /**
     * This hook will use for init
     *
     * @memberof CustomerPortalComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(this.profileData.portalDomain);

        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {

            /**
             * Handles if functionality
             */
            if (organization) {
                /**
                 * Handles if functionality
                 */
                if (organization.type === OrganizationType.Branch || this.isConsolidatedBranch) {
                    this.store.dispatch(this.settingsProfileActions.getBranchInfo());
                    this.organizationType = OrganizationType.Branch;
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                } else if (organization.type === OrganizationType.Company) {
                    this.organizationType = OrganizationType.Company;
                }
            } else {
                this.organizationType = OrganizationType.Company;
            }
        });

        // getting all page data of integration page
        this.store.pipe(select(data => data?.settings?.integration), takeUntil(this.destroyed$)).subscribe((response) => {
            // set razor pay form data
            /**
             * Handles if functionality
             */
            if (response?.razorPayForm) {
                /**
                 * Handles if functionality
                 */
                if (typeof response?.razorPayForm !== "string") {
                    this.razorPayObj = cloneDeep(response?.razorPayForm);
                    /**
                     * Handles if functionality
                     */
                    if (this.razorPayObj && this.razorPayObj.account === null) {
                        this.razorPayObj.account = { name: null, uniqueName: null };
                    }
                    this.razorPayObj.password = response?.razorPayForm?.userName ? 'YOU_ARE_NOT_ALLOWED' : '';
                }
                this.updateRazor = true;
            } else {
                this.setDummyData();
                this.updateRazor = false;
            }

            // set paypal form data
            /**
             * Handles if functionality
             */
            if (response?.paypalForm) {
                /**
                 * Handles if functionality
                 */
                if (typeof response?.paypalForm !== "string") {
                    this.paypalObj = cloneDeep(response?.paypalForm);
                    this.linkedAccountLabel = this.paypalObj?.account?.name;
                    /**
                     * Handles if functionality
                     */
                    if (this.paypalObj && this.paypalObj.account === null) {
                        this.paypalObj.account = { name: null, uniqueName: null };
                    }
                }
                this.updatePaypal = true;
            } else {
                this.setPaypalDummyData();
                this.updatePaypal = false;
            }

        });

        this.store.pipe(
            /**
             * Handles select functionality
             */
            select(appState => appState.settings.profile),
            /**
             * Handles map functionality
             */
            map(response => response?.portalDomain),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$)
        ).subscribe((portalDomain) => {
            /**
             * Handles if functionality
             */
            if (portalDomain) {
                this.profileForm.get('portalDomain').patchValue(portalDomain, { emitEvent: false });
                this.profileData.portalDomain = portalDomain;
                this.region = localStorage.getItem('Country-Region') === 'GB' ? 'uk' : 'in';
                this.portalLoginUrl = `${this.portalUrl}${portalDomain}/${this.region}/login`;
            }
        });

        /**
         * Handles if functionality
         */
        if (this.organizationType === 'COMPANY') {
            const initialValue = this.profileForm?.get('portalDomain')?.value;
            this.profileForm?.get('portalDomain')?.valueChanges?.pipe(
                /**
                 * Handles startWith functionality
                 */
                startWith(initialValue),
                /**
                 * Handles debounceTime functionality
                 */
                debounceTime(700),
                /**
                 * Handles pairwise functionality
                 */
                pairwise(),
                /**
                 * Handles filter functionality
                 */
                filter(([prev, curr]) => prev !== curr && curr !== this.profileData.portalDomain),
                /**
                 * Handles takeUntil functionality
                 */
                takeUntil(this.destroyed$)
            ).subscribe(([prev, curr]) => {
                this.store.dispatch(this.settingsProfileActions.PatchProfile({ portalDomain: curr }));
            });
        }

        this.payuDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.merchantKey) {
                this.payuForm.patchValue({
                    merchantKey: response?.merchantKey,
                    merchantSalt: response?.merchantSalt,
                    accountUniqueName: response?.linkedAccount?.uniqueName
                });
                this.payuLinkedAccountLabel = response?.linkedAccount?.name;
                this.updatePayu = true;
            } else {
                this.updatePayu = false;
                this.payuForm.reset();
            }
        });
    }

    /**
     * Initialise Form
     *
     * @private
     * @memberof CustomerPortalComponent
     */
    private initProfileForm(profileData?: any): void {
        this.profileForm = this.formBuilder.group({
            name: [profileData?.name ?? ''],
            uniqueName: [profileData?.uniqueName ?? ''],
            companyName: [profileData?.companyName ?? ''],
            logo: [profileData?.logo ?? ''],
            alias: [profileData?.alias ?? ''],
            parent: [profileData?.parent ?? {}],
            country: this.formBuilder.group({
                countryName: [profileData?.country?.countryName ?? ''],
                countryCode: [profileData?.country?.countryCode ?? ''],
                currencyName: [profileData?.country?.currencyName ?? ''],
                currencyCode: [profileData?.country?.currencyCode ?? '']
            }),
            businessTypes: [profileData?.businessTypes ?? []],
            businessType: [profileData?.businessType ?? ''],
            nameAlias: [profileData?.nameAlias ?? ''],
            headQuarterAlias: [profileData?.headQuarterAlias ?? ''],
            taxType: [profileData?.taxType ?? ''],
            portalDomain: [profileData?.portalDomain ?? '']
        });
    }


    /**
     * Handles ngAfterViewInit functionality
     */
    public ngAfterViewInit(): void {
        this.loadDefaultAccountsSuggestions();
        this.paypalLoadDefaultAccountsSuggestions();
        this.payuLoadDefaultAccountsSuggestions();
        this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
        this.store.dispatch(this.settingsIntegrationActions.getPaypalDetails());

    }

    /**
     * Sets dummydata value
     */
    public setDummyData() {
        /**
         * Handles if functionality
         */
        if (this.razorPayObj) {
            this.razorPayObj.userName = '';
            this.razorPayObj.password = '';
            this.razorPayObj.account = { name: null, uniqueName: null };
            this.razorPayObj.autoCapturePayment = true;
        }
    }

    /**
    * This will be use for select linked account
    *
    * @param {IOption} event
    * @memberof CustomerPortalComponent
    */
    public selectLinkedAccount(event: IOption): void {
        /**
         * Handles if functionality
         */
        if (event?.value) {
            this.linkedAccountLabel = event.label;
            this.paypalAccounts$.subscribe((arr: IOption[]) => {
                let res = find(arr, (account) => account?.value === event.value);
                /**
                 * Handles if functionality
                 */
                if (res) {
                    this.paypalObj.account.name = res.text;
                }
            });
            this.paypalObj.account.uniqueName = event.value;
        }
    }

    /**
    * This will be use for set paypal dummy data
    *
    * @memberof CustomerPortalComponent
    */
    public setPaypalDummyData(): void {
        /**
         * Handles if functionality
         */
        if (this.paypalObj) {
            this.paypalObj.email = null;
            this.paypalObj.account = { name: null, uniqueName: null };
        }
    }
    /**
     * This will be use for scroll end handler
     *
     * @memberof CustomerPortalComponent
     */
    public paypalHandleScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.paypalAccountsSearchResultsPaginationData.page < this.paypalAccountsSearchResultsPaginationData.totalPages) {
            this.paypalOnAccountSearchQueryChanged(
                this.paypalAccountsSearchResultsPaginationData.query,
                this.paypalAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.paypalAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.paypalDefaultAccountSuggestions = this.paypalDefaultAccountSuggestions.concat(...results);
                        this.paypalDefaultAccountPaginationData.page = this.paypalAccountsSearchResultsPaginationData.page;
                        this.paypalDefaultAccountPaginationData.totalPages = this.paypalAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
    * Search query change handler
    *
    * @param {string} query Search query
    * @param {number} [page=1] Page to request
    * @param {boolean} withStocks True, if search should include stocks in results
    * @param {Function} successCallback Callback to carry out further operation
    * @memberof CustomerPortalComponent
    */

    public paypalOnAccountSearchQueryChanged(query: string = "", page: number = 1, successCallback?: Function): void {

        query = query?.trim() || "";

        /**
         * Handles if functionality
         */
        if (query === this.previousPaypalSearchQuery) {
            return;
        }

        this.previousPaypalSearchQuery = query;
        this.paypalAccountsSearchResultsPaginationData.query = query;

        /**
         * Handles if functionality
         */
        if (!this.paypalPreventDefaultScrollApiCall &&
            (query || (this.paypalDefaultAccountSuggestions && this.paypalDefaultAccountSuggestions.length === 0) || successCallback)) {

            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            };

            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data?.body?.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];

                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.paypalAccounts = searchResults;
                    } else {
                        this.paypalAccounts = [...this.paypalAccounts, ...searchResults];
                    }

                    this.paypalAccounts$ = observableOf(this.paypalAccounts);
                    this.paypalAccountsSearchResultsPaginationData.page = data.body.page;
                    this.paypalAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;

                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.paypalAccountsSearchResultsPaginationData.page = data.body.page;
                        this.paypalAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    }
                } else {
                    this.isDefaultPaypalAccountsLoading = false;
                }
            });

        } else {
            this.paypalAccounts = [...this.paypalDefaultAccountSuggestions];
            this.paypalAccountsSearchResultsPaginationData.page = this.paypalDefaultAccountPaginationData.page;
            this.paypalAccountsSearchResultsPaginationData.totalPages = this.paypalDefaultAccountPaginationData.totalPages;

            this.paypalPreventDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.paypalPreventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof CustomerPortalComponent
     */
    public handleScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
 * Search query change handler
 *
 * @param {string} query Search query
 * @param {number} [page=1] Page to request
 * @param {boolean} withStocks True, if search should include stocks in results
 * @param {Function} successCallback Callback to carry out further operation
 * @memberof CustomerPortalComponent
 */
    public onAccountSearchQueryChanged(query: string = "", page: number = 1, successCallback?: Function): void {

        query = query?.trim() || "";

        /**
         * Handles if functionality
         */
        if (query === this.previousAccountSearchQuery) {
            return;
        }

        this.previousAccountSearchQuery = query;
        this.accountsSearchResultsPaginationData.query = query;

        /**
         * Handles if functionality
         */
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            };

            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data?.body?.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];

                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [...this.accounts, ...searchResults];
                    }

                    this.accounts$ = observableOf(this.accounts);
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;

                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = data.body.page;
                        this.defaultAccountPaginationData.totalPages = data.body.totalPages;
                    }
                } else {
                    this.isDefaultAccountsLoading = false;
                }
            });

        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;

            this.preventDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }


    /**
     * Handles selectAccount functionality
     */
    public selectAccount(event: IOption) {
        /**
         * Handles if functionality
         */
        if (event?.value) {
            this.razorPayObj.account.uniqueName = event.value;
            this.razorPayObj.account.name = event.label;
        }
    }

    /**
     * Saves razorpaydetails data
     */
    public saveRazorPayDetails() {
        let data = cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.SaveRazorPayDetails(data));
    }

    /**
     * Updates existing razorpaydetails
     */
    public updateRazorPayDetails() {
        let data = cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
    }

    /**
     * Handles unlinkAccountFromRazorPay functionality
     */
    public unlinkAccountFromRazorPay() {
        /**
         * Handles if functionality
         */
        if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account?.uniqueName) {
            let data = cloneDeep(this.razorPayObj);
            /**
             * Handles if functionality
             */
            if (data) {
                data.account.uniqueName = null;
                data.account.name = null;
            }
            this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
        } else {
            this.toasty.warningToast(this.localeData?.collection?.unlink_razorpay_message);
        }
    }

    /**
     * Deletes razorpaydetails
     */
    public deleteRazorPayDetails() {
        let confirmModalDialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.collection?.delete_credentials_message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        confirmModalDialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.store.dispatch(this.settingsIntegrationActions.DeleteRazorPayDetails());
            }
        });
    }

    /**
     * This will be use for save paypal details
     *
     * @return {*}
     * @memberof CustomerPortalComponent
     */
    public savePaypalDetails(): void {
        let data = cloneDeep(this.paypalObj);
        /**
         * Handles if functionality
         */
        if (!(this.validateEmail(data?.email))) {
            this.toasty.warningToast(this.localeData?.collection?.invalid_email_error, this.commonLocaleData?.app_warning);
            return;
        }
        data.message = this.localeData?.collection?.paypal_save_successfully;
        this.store.dispatch(this.settingsIntegrationActions.savePaypalDetails(data));
    }

    /**
     * This will be use for update paypal details
     *
     * @return {*}
     * @memberof CustomerPortalComponent
     */
    public updatePaypalDetails(): void {
        let data = cloneDeep(this.paypalObj);
        /**
         * Handles if functionality
         */
        if (!(this.validateEmail(data?.email))) {
            this.toasty.warningToast(this.localeData?.collection?.invalid_email_error, this.commonLocaleData?.app_warning);
            return;
        }
        data.message = this.localeData?.collection?.paypal_update_successfully;
        this.store.dispatch(this.settingsIntegrationActions.updatePaypalDetails(data));
    }

    /**
     * This will be use for unlink account from paypal
     *
     * @memberof CustomerPortalComponent
     */
    public unlinkAccountFromPaypal(): void {
        /**
         * Handles if functionality
         */
        if (this.paypalObj.account && this.paypalObj.account.name && this.paypalObj.account?.uniqueName) {
            let data = cloneDeep(this.paypalObj);
            /**
             * Handles if functionality
             */
            if (data) {
                data.account.uniqueName = null;
                data.account.name = null;
            }

            data.message = this.localeData?.collection?.unlinked_account_successfully;
            this.store.dispatch(this.settingsIntegrationActions.updatePaypalDetails(data));
            this.linkedAccountLabel = '';
        } else {
            this.toasty.warningToast(this.localeData?.collection?.unlink_paypal_message);
        }
    }

    /**
     * This will be use for delete paypal details
     *
     * @memberof CustomerPortalComponent
     */
    public deletePaypalDetails(): void {
        let confirmModalDialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.collection?.delete_credentials_message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        confirmModalDialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.store.dispatch(this.settingsIntegrationActions.deletePaypalDetails());
                this.linkedAccountLabel = '';
            }
        });
    }

    /**
     * This will be use for validation for paypal account email
     *
     * @param {*} emailStr
     * @return {*}  {boolean}
     * @memberof CustomerPortalComponent
     */
    public validateEmail(emailStr: any): boolean {
        return EMAIL_VALIDATION_REGEX.test(emailStr);
    }

    /**
     * Releases memory
     *
     * @memberof CustomerPortalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof CustomerPortalComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result?.name
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
            this.isDefaultAccountsLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
    * Loads the default account search suggestion when module is loaded
    *
    * @private
    * @memberof CustomerPortalComponent
    */
    private paypalLoadDefaultAccountsSuggestions(): void {
        this.paypalOnAccountSearchQueryChanged('', 1, (response) => {
            this.paypalDefaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result?.name
                }
            }) || [];
            this.paypalDefaultAccountPaginationData.page = this.paypalAccountsSearchResultsPaginationData.page;
            this.paypalDefaultAccountPaginationData.totalPages = this.paypalAccountsSearchResultsPaginationData.totalPages;
            this.paypalAccounts = [...this.paypalDefaultAccountSuggestions];
            this.isDefaultPaypalAccountsLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Handles profile update operation
     *
     * @param {string} keyName Key to be updated
     * @memberof CustomerPortalComponent
     */
    public profileUpdated(keyName: string): void {
        const value = this.profileForm?.get(keyName).value;
        /**
         * Handles if functionality
         */
        if (this.updatedData[keyName] !== value) {
            this.updatedData[keyName] = value;
            this.saveProfileSubject.next(true);
        }
    }

    /**
     *This will use for copy api url link and display copied
    *
    * @memberof CustomerPortalComponent
    */
    public copyUrl(): void {
        const urlToCopy = this.portalLoginUrl;
        this.clipboardService.copyFromContent(urlToCopy);
        this.isCopied = true;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }

    /**
     * This will be use for init
     *
     * @memberof CustomerPortalComponent
     */
    public initPayuForm(): void {
        this.payuForm = this.formBuilder.group({
            merchantKey: [null, [Validators.required]],
            merchantSalt: [null, [Validators.required]],
            accountUniqueName: [null, [Validators.required]]
        });
    }

    /**
     * This will be use for unlink account from payu
     *
     * @memberof CustomerPortalComponent
     */
    public unlinkAccountFromPayu(): void {
        /**
         * Handles if functionality
         */
        if (this.payuForm.get('accountUniqueName')?.value) {
            this.payuForm.get('accountUniqueName').setValue(null);
            this.payuForm.get('accountUniqueName').markAsPristine();
            this.savePayuDetails();
        } else {
            this.toasty.warningToast(this.localeData?.collection?.unlink_payu_message);
        }
    }

    /**
     * This will be use for select linked account
     *
     * @param {IOption} event
     * @memberof CustomerPortalComponent
     */
    public selectPayuLinkedAccount(event: IOption): void {
        /**
         * Handles if functionality
         */
        if (event?.value) {
            this.payuLinkedAccountLabel = event.label;
            this.payuAccounts$.pipe(take(1)).subscribe((arr: IOption[]) => {
                let res = find(arr, (account) => account?.value === event.value);
                /**
                 * Handles if functionality
                 */
                if (res) {
                    this.payuForm.get('accountUniqueName').patchValue(event.value);
                }
            });
        }
    }

    /**
     * This will be use for payu scroll end handler
     *
     * @memberof CustomerPortalComponent
     */
    public payuHandleScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.payuAccountsSearchResultsPaginationData.page < this.payuAccountsSearchResultsPaginationData.totalPages) {
            this.payuOnAccountSearchQueryChanged(
                this.payuAccountsSearchResultsPaginationData.query,
                this.payuAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.payuAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.payuDefaultAccountSuggestions = this.payuDefaultAccountSuggestions.concat(...results);
                        this.payuDefaultAccountPaginationData.page = this.payuAccountsSearchResultsPaginationData.page;
                        this.payuDefaultAccountPaginationData.totalPages = this.payuAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
    * Search query change handler
    *
    * @param {string} query Search query
    * @param {number} [page=1] Page to request
    * @param {Function} successCallback Callback to carry out further operation
    * @memberof CustomerPortalComponent
    */
    public payuOnAccountSearchQueryChanged(query: string = "", page: number = 1, successCallback?: Function): void {

        query = query?.trim() || "";

        /**
         * Handles if functionality
         */
        if (query === this.previousPayuSearchQuery) {
            return;
        }

        this.previousPayuSearchQuery = query;
        this.payuAccountsSearchResultsPaginationData.query = query;

        /**
         * Handles if functionality
         */
        if (!this.payuPreventDefaultScrollApiCall &&
            (query || (this.payuDefaultAccountSuggestions && this.payuDefaultAccountSuggestions.length === 0) || successCallback)) {

            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            };

            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data?.body?.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];

                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.payuAccounts = searchResults;
                    } else {
                        this.payuAccounts = [...this.payuAccounts, ...searchResults];
                    }

                    this.payuAccounts$ = observableOf(this.payuAccounts);
                    this.payuAccountsSearchResultsPaginationData.page = data.body.page;
                    this.payuAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;

                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.payuAccountsSearchResultsPaginationData.page = data.body.page;
                        this.payuAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    }
                } else {
                    this.isDefaultPayuAccountsLoading = false;
                }
            });

        } else {
            this.payuAccounts = [...this.payuDefaultAccountSuggestions];
            this.payuAccountsSearchResultsPaginationData.page = this.payuDefaultAccountPaginationData.page;
            this.payuAccountsSearchResultsPaginationData.totalPages = this.payuDefaultAccountPaginationData.totalPages;

            this.payuPreventDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.payuPreventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * This will be use for save payu details
     *
     * @return {*}
     * @memberof CustomerPortalComponent
     */
    public savePayuDetails(): void {
        this.isFormSubmitted = false;
        /**
         * Handles if functionality
         */
        if (this.payuForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        this.componentStore.payuCrudOperation({
            method: HttpMethod.POST,
            payload: this.payuForm.value
        });
    }

    /**
     * This will be use for delete paypal details
     *
     * @memberof CustomerPortalComponent
     */
    public deletePayuDetails(): void {
        let confirmModalDialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.collection?.delete_credentials_message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        confirmModalDialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                // For DELETE
                this.componentStore.payuCrudOperation({
                    method: HttpMethod.DELETE
                });
                this.payuLinkedAccountLabel = '';
            }
        });
    }

    /**
     * This will be use for clear payu account
     *
     * @memberof CustomerPortalComponent
     */
    public onPayuAccountClear(): void {
        this.payuLinkedAccountLabel = '';
        this.payuForm.get('accountUniqueName').setValue(null);
        this.payuForm.get('accountUniqueName').markAsPristine();
    }

    /**
    * Loads the default account search suggestion when module is loaded
    *
    * @private
    * @memberof CustomerPortalComponent
    */
    private payuLoadDefaultAccountsSuggestions(): void {
        this.payuOnAccountSearchQueryChanged('', 1, (response) => {
            this.payuDefaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result?.name
                }
            }) || [];
            this.payuDefaultAccountPaginationData.page = this.payuAccountsSearchResultsPaginationData.page;
            this.payuDefaultAccountPaginationData.totalPages = this.payuAccountsSearchResultsPaginationData.totalPages;
            this.payuAccounts = [...this.payuDefaultAccountSuggestions];
            this.isDefaultPayuAccountsLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }
}
