import { Observable, of as observableOf, pipe, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, PaymentClass, PayPalClass, RazorPayClass, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { CompanyActions } from "../../actions/company.actions";
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { BootstrapToggleSwitch, BROADCAST_CHANNELS, Configuration, EMAIL_VALIDATION_REGEX, ICICI_ALLOWED_COMPANIES, SELECT_ALL_RECORDS } from "../../app.constant";
import { AuthenticationService } from "../../services/authentication.service";
import { IForceClear } from '../../models/api-models/Sales';
import { EcommerceService } from '../../services/ecommerce.service';
import { GeneralService } from '../../services/general.service';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { ACCOUNT_REGISTERED_STATUS, SettingsIntegrationTab, SettingsIntegrationTabV1, UNLIMITED_LIMIT } from '../constants/settings.constant';
import { SearchService } from '../../services/search.service';
import { SalesService } from '../../services/sales.service';
import { cloneDeep, find, isEmpty } from '../../lodash-optimized';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonActions } from '../../actions/common.actions';
import { SettingIntegrationComponentStore } from './utility/setting.integration.store';
import { InstitutionsListComponent } from './institutions-list/institutions-list.component';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';

@Component({
    selector: 'setting-integration',
    templateUrl: './setting.integration.component.html',
    styleUrls: ['./setting.integration.component.scss'],
    providers: [SettingIntegrationComponentStore]
})
export class SettingIntegrationComponent implements OnInit, AfterViewInit {
    public auth2: any;
    public smsFormObj: SmsKeyClass = new SmsKeyClass();
    public emailFormObj: EmailKeyClass = new EmailKeyClass();
    public paymentFormObj: PaymentClass = new PaymentClass();
    public razorPayObj: RazorPayClass = new RazorPayClass();
    /**Hold paypal request obj */
    public paypalObj: PayPalClass = new PayPalClass();
    public payoutObj: CashfreeClass = new CashfreeClass();
    public autoCollectObj: CashfreeClass = new CashfreeClass();
    public amazonSeller: AmazonSellerClass = new AmazonSellerClass();
    public accounts$: Observable<IOption[]>;
    /**Observable for paypal accounts */
    public paypalAccounts$: Observable<IOption[]>;
    /**True if paypal is update */
    public updatePaypal: boolean = false;
    public updateRazor: boolean = false;
    public autoCollectAdded: boolean = false;
    public payoutAdded: boolean = false;
    public bankAccounts$: Observable<IOption[]>;
    public gmailAuthCodeUrl$: Observable<string> = null;
    public amazonSellerForm: UntypedFormGroup;
    public amazonEditItemIdx: number;
    public amazonSellerRes: AmazonSellerClass[];
    public isGmailIntegrated$: Observable<boolean>;
    public isElectron: boolean = Configuration.isElectron;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    private isSellerAdded: Observable<boolean> = observableOf(false);
    private isSellerUpdate: Observable<boolean> = observableOf(false);
    /** Input mast for number format */
    public inputMaskFormat: string = '';
    /**This will use for select tab index */
    @Input() public selectedTabParent: number;
    @ViewChild('removegmailintegration', { static: true }) public removegmailintegration: TemplateRef<any>;
    @ViewChild('paymentForm', { static: true }) paymentForm: NgForm;
    @ViewChild('paymentFormAccountName', { static: true }) paymentFormAccountName: ShSelectComponent;
    /** Instance of create new account modal */
    @ViewChild('createNewAccountModal', { static: true }) public createNewAccountModal: TemplateRef<any>;
    /** Instance of edit account modal */
    @ViewChild('editAccountModal', { static: true }) public editAccountModal: TemplateRef<any>;
    /** Instance of create new account user modal */
    @ViewChild('createNewAccountUserModal', { static: true }) public createNewAccountUserModal: TemplateRef<any>;
    /** Instance of delete account user modal */
    @ViewChild('confirmationModal', { static: true }) public confirmationModal: TemplateRef<any>;
    /** Edit Account User Dailog Template Reference */
    @ViewChild('editAccountUserModal', { static: true }) public editAccountUserModal: TemplateRef<any>;

    //variable holding account Info
    public registeredAccount;
    public isEcommerceShopifyUserVerified: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public selectedCompanyUniqueName: string;
    /* This will clear the selected linked account */
    public forceClearLinkAccount$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the selected paypal linked account */
    public paypalForceClearLinkAccount$: Observable<IForceClear> = observableOf({ status: false });
    /** Stores the search results pagination details */
    public paypalAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public paypalDefaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public paypalPreventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public paypalDefaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public paypalAccounts: IOption[];
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public accounts: IOption[];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for create new account form */
    public createNewAccountForm: UntypedFormGroup;
    /** List of users to receive payment alerts */
    public paymentAlerts: any[] = [];
    /** Holds string for select all records */
    public selectAllRecords: string = SELECT_ALL_RECORDS;
    /* This will clear the selected payment updates values */
    public forceClearPaymentUpdates$: Observable<IForceClear> = observableOf({ status: false });
    /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** This will have bank account details */
    public activeBankAccount: any;
    /** This will have payor account details */
    public activePayorAccount: any;
    /** Form Group for edit account user form */
    public editAccountUserForm: UntypedFormGroup;
    /** Form Group for edit account form */
    public editAccountForm: UntypedFormGroup;
    /** Holds unlimited text for amount limit */
    public unlimitedLimit: string = UNLIMITED_LIMIT;
    /** This will hold active company data */
    public activeCompany: any;
    /** Holds image path */
    public imgPath: string = '';
    /** This will hold apiUrl */
    public apiUrl: string = '';
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** List of icici bank supported countries */
    public iciciBankSupportedCountryList: any[] = ["IN", "NP", "BT"];
    /** True, if is other country in payment integration */
    public isIciciBankSupportedCountry: boolean = false;
    /** True, if is add or manage group form outside */
    public isAddAndManageOpenedFromOutside: boolean = false;
    /** Hold editAccountUserModal mat dailog reference */
    public editAccountUserModalRef: any;
    /** Hold confirmationModalRef mat dailog reference */
    public confirmationModalRef: any;
    /** Holds array of company uniqueNames which ICICI allowed companies */
    public iciciAllowedCompanies: any[] = ICICI_ALLOWED_COMPANIES;
    /** Holds true if current company country is plaid supported country */
    public isPlaidSupportedCountry: boolean;
    /** Holds Create New Account Dialog Ref */
    public createNewAccountDialogRef: MatDialogRef<any>;
    /** Holds Edit New Account Dialog Ref */
    public editAccountModalRef: MatDialogRef<any>;
    /** Holds Create New Account User Dialog Ref */
    public createNewAccountUserModalRef: MatDialogRef<any>;
    /** Holds Linked account label for selected value */
    public linkedAccountLabel: string = '';
    /**  Holds Mat Dialog reference */
    public removeGmailIntegrationDialogRef: MatDialogRef<any>;
    /** Holds Store Delete end user agreement  API success state as observable*/
    public deleteEndUseAgreementSuccess$: Observable<any> = this.componentStore.select(state => state.deleteAccountSuccess);
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** Hold reference number */
    public referenceNumber: string = '';
    /** Holds Store Requisition API success state as observable*/
    public requisitionList$: Observable<any> = this.componentStore.select(state => state.requisitionList);
    /** True, if is integration module are in scope  */
    public hasIntegrationScope: boolean = false;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private ecommerceService: EcommerceService,
        private toasty: ToasterService,
        private _companyActions: CompanyActions,
        private _authenticationService: AuthenticationService,
        private _fb: UntypedFormBuilder,
        private settingsPermissionActions: SettingsPermissionActions,
        private generalService: GeneralService,
        private settingsIntegrationService: SettingsIntegrationService,
        private searchService: SearchService,
        private salesService: SalesService,
        public dialog: MatDialog,
        private activateRoute: ActivatedRoute,
        private commonAction: CommonActions,
        private changeDetectionRef: ChangeDetectorRef,
        private componentStore: SettingIntegrationComponentStore

    ) {
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl?.replace(':redirect_url', this.getRedirectUrl(AppUrl))?.replace(':client_id', GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
        this.isSellerAdded = this.store.pipe(select(s => s.settings.amazonState.isSellerSuccess), takeUntil(this.destroyed$));
        this.isSellerUpdate = this.store.pipe(select(s => s.settings.amazonState.isSellerUpdated), takeUntil(this.destroyed$));
        this.isGmailIntegrated$ = this.store.pipe(select(s => s.settings.isGmailIntegrated), takeUntil(this.destroyed$));

        this.store.pipe(select(s => s.session.user), take(1)).subscribe(result => {
            if (result && result.user) {
                this.generalService.user = result.user;
            }
        });
    }

    public ngOnInit() {
        this.imgPath = (isElectron) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        let companyUniqueName = this.generalService.companyUniqueName;
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.apiUrl = `${ApiUrl}company/${companyUniqueName}/imports/tally-import`;

        // getting all page data of integration page
        this.store.pipe(select(p => p?.settings?.integration), takeUntil(this.destroyed$)).subscribe((o) => {
            // set sms form data
            if (o?.smsForm) {
                this.smsFormObj = o.smsForm;
            }
            // set email form data
            if (o?.emailForm) {
                this.emailFormObj = o.emailForm;
            }
            // set razor pay form data
            if (o?.razorPayForm) {
                if (typeof o?.razorPayForm !== "string") {
                    this.razorPayObj = cloneDeep(o?.razorPayForm);
                    if (this.razorPayObj && this.razorPayObj.account === null) {
                        this.razorPayObj.account = { name: null, uniqueName: null };
                        this.forceClearLinkAccount$ = observableOf({ status: true });
                    }
                    this.razorPayObj.password = o?.razorPayForm?.userName ? 'YOU_ARE_NOT_ALLOWED' : '';
                }
                this.updateRazor = true;
            } else {
                this.setDummyData();
                this.updateRazor = false;
            }

            // set paypal form data
            if (o?.paypalForm) {
                if (typeof o?.paypalForm !== "string") {
                    this.paypalObj = cloneDeep(o?.paypalForm);
                    this.linkedAccountLabel = this.paypalObj?.account?.name;
                    if (this.paypalObj && this.paypalObj.account === null) {
                        this.paypalObj.account = { name: null, uniqueName: null };
                        this.paypalForceClearLinkAccount$ = observableOf({ status: true });
                    }
                }
                this.updatePaypal = true;
            } else {
                this.setPaypalDummyData();
                this.updatePaypal = false;
            }
            // set cashfree form data
            if (o.payoutForm && o.payoutForm.userName) {
                this.payoutObj = cloneDeep(o.payoutForm);
                this.payoutAdded = true;
            } else {
                this.payoutObj = new CashfreeClass();
                this.payoutAdded = false;
            }
            if (o.autoCollect && o.autoCollect.userName) {
                this.autoCollectObj = cloneDeep(o.autoCollect);
                this.autoCollectAdded = true;
            } else {
                this.autoCollectObj = new CashfreeClass();
                this.autoCollectAdded = false;
            }
            if (o.amazonSeller && o.amazonSeller.length) {
                this.amazonSellerRes = cloneDeep(o.amazonSeller);
                this.amazonSellerForm.controls['sellers']?.patchValue(this.amazonSellerRes);
                this.addAmazonSellerRow();
            }
        });

        this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                //This is not using no due to gocardless
                // this.isPlaidSupportedCountry = this.generalService.checkCompanySupportPlaid(res.country);
            }
        });

        this.amazonSellerForm = this._fb.group({
            sellers: this._fb.array([
                this.initAmazonReseller()
            ])
        });

        this.isSellerAdded.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.addAmazonSellerRow();
            }
        });

        this.isSellerUpdate.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.amazonEditItemIdx = null;
                this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
            }
        });

        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !isEmpty(res)) {
                res.userEntityRoles.forEach(role => {
                    const scopes = role.role.scopes;
                    if (scopes && scopes.some(scope => scope.name === 'INTEGRATION')) {
                        this.hasIntegrationScope = true;
                    }
                });
                if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
                    res.ecommerceDetails.forEach(item => {
                        if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
                            this.getShopifyVerifyStatus(item.uniqueName);
                        }
                    })
                }
            }
        });
        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.isGocardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
                if (this.iciciBankSupportedCountryList.includes(profile.countryV2.alpha2CountryCode)) {
                    this.isIciciBankSupportedCountry = true;
                } else {
                    this.isIciciBankSupportedCountry = false;
                }
            }
        });

        if (this.selectedCompanyUniqueName) {
            this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
        }

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.store.pipe(select(select => select.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response && this.isAddAndManageOpenedFromOutside) {
                this.activateRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                    if (resp?.referrer === 'payment') {
                        this.loadDefaultBankAccountsSuggestions();
                    }
                });
            }
            this.isAddAndManageOpenedFromOutside = response;
        });

        const broadcast = new BroadcastChannel(BROADCAST_CHANNELS.REAUTH_PLAID_SUCCESS);
        broadcast.onmessage = (event) => {
            if (event?.data) {
                this.loadPaymentData();
            }
        };
        window.addEventListener('message', event => {
            if (this.router.url === '/pages/settings/integration/payment') {
                if (event && event.data === "GOCARDLESS") {
                    if (this.referenceNumber) {
                        this.componentStore.getRequisition(this.referenceNumber);
                    }
                }
            }
        });

        this.requisitionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.loadPaymentData();
            }
        });

        this.deleteEndUseAgreementSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.loadPaymentData();
            }
        });
    }

    /**
     * This hook will be called after component is initialized
     *
     * @memberof SettingIntegrationComponent
     */
    public ngAfterViewInit(): void {
        if (this.selectedTabParent) {
            this.loadTabData(this.selectedTabParent);
        }
    }

    public setDummyData() {
        if (this.razorPayObj) {
            this.razorPayObj.userName = '';
            this.razorPayObj.password = '';
            this.razorPayObj.account = { name: null, uniqueName: null };
            this.razorPayObj.autoCapturePayment = true;
        }
        this.forceClearLinkAccount$ = observableOf({ status: true });
    }

    /**
     * This will be use for set paypal dummy data
     *
     * @memberof SettingIntegrationComponent
     */
    public setPaypalDummyData(): void {
        if (this.paypalObj) {
            this.paypalObj.email = null;
            this.paypalObj.account = { name: null, uniqueName: null };
        }
        this.paypalForceClearLinkAccount$ = observableOf({ status: true });
    }

    /**
     * This will be use for validation for paypal account email
     *
     * @param {*} emailStr
     * @return {*}  {boolean}
     * @memberof SettingIntegrationComponent
     */
    public validateEmail(emailStr: any): boolean {
        return EMAIL_VALIDATION_REGEX.test(emailStr);
    }

    /**
     * This will be use for select linked account
     *
     * @param {IOption} event
     * @memberof SettingIntegrationComponent
     */
    public selectLinkedAccount(event: IOption): void {
        if (event?.value) {
            this.linkedAccountLabel = event.label;
            this.paypalAccounts$.subscribe((arr: IOption[]) => {
                let res = find(arr, (account) => account?.value === event.value);
                if (res) {
                    this.paypalObj.account.name = res.text;
                }
            });
            this.paypalObj.account.uniqueName = event.value;
        }
    }

    /**
     * This will be use for save paypal details
     *
     * @return {*}
     * @memberof SettingIntegrationComponent
     */
    public savePaypalDetails(): void {
        let data = cloneDeep(this.paypalObj);
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
     * @memberof SettingIntegrationComponent
     */
    public updatePaypalDetails(): void {
        let data = cloneDeep(this.paypalObj);
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
     * @memberof SettingIntegrationComponent
     */
    public unlinkAccountFromPaypal(): void {
        if (this.paypalObj.account && this.paypalObj.account.name && this.paypalObj.account?.uniqueName) {
            let data = cloneDeep(this.paypalObj);
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
     * @memberof SettingIntegrationComponent
     */
    public deletePaypalDetails(): void {
        this.store.dispatch(this.settingsIntegrationActions.deletePaypalDetails());
        this.linkedAccountLabel = '';
    }


    /**
     * This will be use for scroll end handler
     *
     * @memberof SettingIntegrationComponent
     */
    public paypalHandleScrollEnd(): void {
        if (this.paypalAccountsSearchResultsPaginationData.page < this.paypalAccountsSearchResultsPaginationData.totalPages) {
            this.paypalOnAccountSearchQueryChanged(
                this.paypalAccountsSearchResultsPaginationData.query,
                this.paypalAccountsSearchResultsPaginationData.page + 1,
                (response) => {
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
        this.changeDetectionRef.detectChanges();
    }

    /**
    * Loads the default account search suggestion when module is loaded
    *
    * @private
    * @memberof SettingIntegrationComponent
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
        });
        this.changeDetectionRef.detectChanges();
    }

    /**
    * Search query change handler
    *
    * @param {string} query Search query
    * @param {number} [page=1] Page to request
    * @param {boolean} withStocks True, if search should include stocks in results
    * @param {Function} successCallback Callback to carry out further operation
    * @memberof SettingIntegrationComponent
    */
    public paypalOnAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.paypalAccountsSearchResultsPaginationData.query = query;
        if (!this.paypalPreventDefaultScrollApiCall &&
            (query || (this.paypalDefaultAccountSuggestions && this.paypalDefaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.paypalAccounts = searchResults;
                    } else {
                        this.paypalAccounts = [
                            ...this.paypalAccounts,
                            ...searchResults
                        ];
                    }
                    this.paypalAccounts$ = observableOf(this.paypalAccounts);
                    this.paypalAccountsSearchResultsPaginationData.page = data.body.page;
                    this.paypalAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.paypalAccountsSearchResultsPaginationData.page = data.body.page;
                        this.paypalAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    }
                }
            });
        } else {
            this.paypalAccounts = [...this.paypalDefaultAccountSuggestions];
            this.paypalAccountsSearchResultsPaginationData.page = this.paypalDefaultAccountPaginationData.page;
            this.paypalAccountsSearchResultsPaginationData.totalPages = this.paypalDefaultAccountPaginationData.totalPages;
            this.paypalPreventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.paypalPreventDefaultScrollApiCall = false;
            }, 500);
        }
        this.changeDetectionRef.detectChanges();
    }

    public onSubmitMsgform(f: NgForm) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveSMSKey(f?.value.smsFormObj));
        }
    }

    public onSubmitEmailform(f: NgForm) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveEmailKey(f?.value));
        }
    }

    public selectAccount(event: IOption) {
        if (event?.value) {
            this.razorPayObj.account.uniqueName = event.value;
            this.razorPayObj.account.name = event.label;
        }
    }

    public saveRazorPayDetails() {
        let data = cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.SaveRazorPayDetails(data));
    }

    public updateRazorPayDetails() {
        let data = cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
    }

    public unlinkAccountFromRazorPay() {
        if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account?.uniqueName) {
            let data = cloneDeep(this.razorPayObj);
            if (data) {
                data.account.uniqueName = null;
                data.account.name = null;
            }
            this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
        } else {
            this.toasty.warningToast(this.localeData?.collection?.unlink_razorpay_message);
        }
    }

    public deleteRazorPayDetails() {
        this.store.dispatch(this.settingsIntegrationActions.DeleteRazorPayDetails());
    }

    /**
     * Open confirmation dialog
     *
     * @memberof SettingIntegrationComponent
     */
    public openRemoveGmailIntegrationDialog(): void {
        this.removeGmailIntegrationDialogRef = this.dialog.open(this.removegmailintegration, {
            width: '630px'
        });
    }

    public removeGmailAccount() {
        this.store.dispatch(this.settingsIntegrationActions.RemoveGmailIntegration());
    }

    public selectCashfreeAccount(event: IOption, objToApnd) {
        let accObj = {
            name: event.label,
            uniqueName: event?.value
        };
        objToApnd.account = accObj;
    }

    public submitCashfreeDetail(f) {
        if (f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        }
    }

    public deleteCashFreeAccount() {
        this.store.dispatch(this.settingsIntegrationActions.DeleteCashfreeDetails());
    }

    public updateCashfreeDetail(f) {
        if (f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateCashfreeDetails(objToSend));
        }
    }

    public submitAutoCollect(f) {
        if (f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.AddAutoCollectUser(objToSend));
        }
    }

    public updateAutoCollect(f) {
        if (f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateAutoCollectUser(objToSend));
        }
    }

    public deleteAutoCollect() {
        this.store.dispatch(this.settingsIntegrationActions.DeleteAutoCollectUser());
    }

    /**
     * saveAmazonSeller
     */
    public saveAmazonSeller(obj) {
        let sellers = [];
        sellers.push(cloneDeep(obj?.value));
        this.store.dispatch(this.settingsIntegrationActions.AddAmazonSeller(sellers));
    }

    /**
     * updateAmazonSeller
     */
    public updateAmazonSeller(obj) {
        if (!obj?.value.sellerId) {
            return;
        }
        let sellerObj = cloneDeep(obj?.value);
        delete sellerObj['secretKey'];
        this.store.dispatch(this.settingsIntegrationActions.UpdateAmazonSeller(sellerObj));
    }

    /**
     * deleteAmazonSeller
     */
    public deleteAmazonSeller(sellerId, idx) {
        let seller = this.amazonSellerRes?.findIndex((o) => o.sellerId === sellerId);
        if (seller > -1) {
            this.store.dispatch(this.settingsIntegrationActions.DeleteAmazonSeller(sellerId));
            this.removeAmazonSeller(idx);
        } else {
            this.removeAmazonSeller(idx);
        }
    }

    // initial initAmazonReseller controls
    public initAmazonReseller() {
        // initialize our controls
        return this._fb.group({
            sellerId: [''],
            mwsAuthToken: [''],
            accessKey: [''],
            secretKey: ['']
        });
    }

    public addAmazonSellerRow(i?: number, item?: any) {
        const control = this.amazonSellerForm.controls['sellers'] as UntypedFormArray;
        if (item) {
            if (control.controls[i]) {
                control.controls[i]?.patchValue(item);
                if (control.controls[i]?.value.sellerId) {
                    control.controls[i].disable();
                }
            } else {
                control.push(this.initAmazonReseller());
                setTimeout(() => {
                    control.controls[i]?.patchValue(item);
                    if (control.controls[i]?.value.sellerId) {
                        control.controls[i].disable();
                    }
                }, 200);
            }
        } else {
            let arr = control?.value;
            if (!control?.value[arr?.length - 1]?.sellerId) {
                return;
            }
            control.push(this.initAmazonReseller());
        }
    }

    // remove amazon Seller controls
    public removeAmazonSeller(i: number) {
        // remove address from the list
        const control = this.amazonSellerForm.controls['sellers'] as UntypedFormArray;
        if (control?.length > 1) {
            control.removeAt(i);
        } else {
            control.controls[0].reset();
        }
    }

    /**
     * editAmazonSeller
     */
    public editAmazonSeller(idx: number) {
        this.enableDisableAmazonControl(idx, 'enable');
        this.amazonEditItemIdx = idx;
    }

    /**
     * enableDisableAmazonControl
     */
    public enableDisableAmazonControl(idx, type) {
        const control = this.amazonSellerForm.controls['sellers'] as UntypedFormArray;
        if (type === 'enable') {
            control.controls[idx].enable();
        } else {
            control.controls[idx].disable();
        }
    }

    private getRedirectUrl(baseHref: string) {
        return `${baseHref}pages/settings?tab=integration`;
    }

    /**
     * API call to get know about ecommerce platform shopify connected or not
     *
     * @param {string} ecommerceUniqueName ecommerce unique name for shopify
     * @memberof SettingIntegrationComponent
     */
    public getShopifyVerifyStatus(ecommerceUniqueName: string): void {
        const requestObj = { source: "shopify" };
        this.ecommerceService.isShopifyConnected(requestObj, ecommerceUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success' && response.body === 'VERIFIED') {
                    this.isEcommerceShopifyUserVerified = true;
                }
            }
        })
    }

    gmailIntegration(provider: string) {
        if (Configuration.isElectron) {
            // electronOauth2
            const { ipcRenderer } = (window as any).require("electron");
            if (provider === "google") {
                // google
                const t = ipcRenderer.send("authenticate-send-email", provider);
                ipcRenderer.once('take-your-gmail-token', (sender, arg: any) => {
                    const dataToSave = {
                        "access_token": arg.access_token,
                        "expires_in": arg.expiry_date,
                        "refresh_token": arg.refresh_token
                    };
                    this._authenticationService.saveGmailToken(dataToSave).pipe(takeUntil(this.destroyed$)).subscribe((res) => {

                        if (res?.status === 'success') {
                            this.toasty.successToast(this.localeData?.email?.gmail_added_successfully, this.commonLocaleData?.app_success);
                        } else {
                            this.toasty.errorToast(res.message, res.code);
                        }
                        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
                        this.router.navigateByUrl('/pages/settings/integration/email');
                    });
                });

            } else {
                // linked in
                const t = ipcRenderer.send("authenticate", provider);
            }

        }
    }

    /**
     * To map users with company permissions data for UI
     *
     * @param {ShareRequestForm[]} data  users with company permissions data
     * @returns
     * @memberof SettingIntegrationComponent
     */
    public prepareDataForUI(data: ShareRequestForm[]): any {
        return data.map((item) => {
            if (item.allowedCidrs && item.allowedCidrs.length > 0) {
                item.cidrsStr = item.allowedCidrs?.toString();
            } else {
                item.cidrsStr = null;
            }
            if (item.allowedIps && item.allowedIps.length > 0) {
                item.ipsStr = item.allowedIps?.toString();
            } else {
                item.ipsStr = null;
            }
            return item;
        });
    }

    /**
     * Loads payment tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadPaymentData(event?: any): void {
        this.store.pipe(select(select => select.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$)).subscribe(result => {
            this.isAddAndManageOpenedFromOutside = result;
        });
        if (event && event instanceof TabDirective || !event) {
            this.loadDefaultBankAccountsSuggestions();
            this.getAllBankAccounts();
            this.store.dispatch(this._companyActions.getAllRegistrations());
            this.store.pipe(take(1)).subscribe(s => {
                this.selectedCompanyUniqueName = s.session.companyUniqueName;
                this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
            });
        }
    }

    /**
     * Loads E-Commerce tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadEcommerceData(event?: any): void {
        if (event && event instanceof MatTabGroup || !event) {
            this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
        }
    }

    /**
     * Loads Collection tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadCollectionData(event?: any): void {
        if (event && event instanceof MatTabGroup || !event) {
            this.loadDefaultAccountsSuggestions();
            this.loadDefaultBankAccountsSuggestions();
            this.paypalLoadDefaultAccountsSuggestions();
            this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
            this.store.dispatch(this.settingsIntegrationActions.getPaypalDetails());
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Loads the Email tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadEmailData(event?: any): void {
        if (event && event instanceof MatTabGroup || !event) {
            this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
            this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
        }
    }

    /**
     * Loads SMS tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadSmsData(event?: any): void {
        if (event && event instanceof MatTabGroup || !event) {
            this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
        }
    }

    /**
     * Loads the tab data based on tab selected
     *
     * @private
     * @memberof SettingIntegrationComponent
     */
    private loadTabData(index: number): void {
        if (this.voucherApiVersion === 2) {
            if (SettingsIntegrationTab.Email === index) {
                this.loadEmailData();
            }
            if (SettingsIntegrationTab.Collection === index) {
                this.loadCollectionData();
            }
            if (SettingsIntegrationTab.Payment === index) {
                this.loadPaymentData();
            }
        } else {
            if (SettingsIntegrationTabV1.Email === index) {
                this.loadEmailData();
            }
            if (SettingsIntegrationTabV1.Collection === index) {
                this.loadCollectionData();
            }
            if (SettingsIntegrationTabV1.Payment === index) {
                this.loadPaymentData();
            }
        }
    }

    /**
     * This will navigate to selected tab
     *
     * @param {string} tab
     * @memberof SettingIntegrationComponent
     */
    public tabChanged(event: any): void {
        let tab = event?.tab?.textLabel?.toLocaleLowerCase();
        this.router.navigateByUrl('/pages/settings/integration/' + tab);
        this.loadTabData(event?.index);
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof SettingIntegrationComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [
                            ...this.accounts,
                            ...searchResults
                        ];
                    }
                    this.accounts$ = observableOf(this.accounts);
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = data.body.page;
                        this.defaultAccountPaginationData.totalPages = data.body.totalPages;
                    }
                }
            });
        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof SettingIntegrationComponent
     */
    public handleScrollEnd(): void {
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
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
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof SettingIntegrationComponent
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
        });
    }

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof SettingIntegrationComponent
     */
    private loadDefaultBankAccountsSuggestions(): void {
        this.salesService.getAccountsWithCurrency('bankaccounts,loanandoverdraft').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                const bankAccounts = response.body.results.map(account => ({
                    label: account?.name,
                    value: account?.uniqueName
                }))
                this.bankAccounts$ = observableOf(bankAccounts);
            }
        });
    }

    /**
     * Releases memory
     *
     * @memberof SettingIntegrationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will open create new account modal
     *
     * @memberof SettingIntegrationComponent
     */
    public openCreateNewAccountModal(): void {
        this.createNewAccountDialogRef = this.dialog.open(this.createNewAccountModal, {
            width: '630px',
            disableClose: true
        });
    }

    /**
     * Initiate request to open plaid popup
     *
     * @memberof SettingIntegrationComponent
     */
    public getPlaidLinkToken(itemId?: any): void {
        this.store.dispatch(this.commonAction.reAuthPlaid({ itemId: itemId, reauth: true }));
    }

    /**
    * This function will use for get institutions details
    *
    * @param {*} element
    * @memberof SettingIntegrationComponent
    */
    public openInstitutionsDialog(): void {
        let data = {
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData,
        }
        const dialogRef = this.dialog.open(InstitutionsListComponent, {
            data: data,
            width: 'var(--aside-pane-width)',
            panelClass: 'subscription-sidebar',
            role: 'alertdialog',
            ariaLabel: 'institutionsListDialog'
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.referenceNumber = response;
            }
        });
    }

    /**
     * This will use for select bank account only for plaid integration
     *
     * @param {*} event
     * @param {*} bank
     * @memberof SettingIntegrationComponent
     */
    public selectBankAccount(event: any, bank: any): void {
        if (event?.value) {
            let request = { bankAccountUniqueName: bank?.bankResource?.uniqueName };
            let accountForm = {
                accountNumber: bank?.bankResource?.accountNumber,
                accountUniqueName: event?.value,
                paymentAlerts: []
            };
            this.settingsIntegrationService.updateAccount(accountForm, request).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toasty.clearAllToaster();
                        this.toasty.successToast(response?.body?.message);
                    }
                } else {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * This will open the create new account user modal
     *
     * @param {*} bankAccount
     * @memberof SettingIntegrationComponent
     */
    public openCreateNewAccountUserModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.createNewAccountUserModalRef = this.dialog.open(this.createNewAccountUserModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
        });
    }

    /**
     * This will close the create new account user modal
     *
     * @memberof SettingIntegrationComponent
     */

    /**
     * This will get all connected bank accounts
     *
     * @memberof SettingIntegrationComponent
     */
    public getAllBankAccounts(): void {
        this.isLoading = true;
        this.connectedBankAccounts = [];

        this.settingsIntegrationService.getAllBankAccounts().pipe(take(1)).subscribe(response => {
            this.isLoading = false;
            if (response?.body) {
                this.connectedBankAccounts = response.body;

                this.connectedBankAccounts.forEach(bankAccount => {
                    if (bankAccount?.bankResource?.payor?.length > 0) {
                        bankAccount?.bankResource?.payor.forEach(payor => {
                            this.getPayorRegistrationStatus(bankAccount, payor);
                        });
                    }
                });
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * This returns the account unique name of account
     *
     * @param {number} index
     * @param {*} item
     * @returns {*}
     * @memberof SettingIntegrationComponent
     */
    public trackByAccountUniqueName(index: number, item: any): any {
        return item?.bankResource?.uniqueName;
    }

    /**
     * This returns the payment alert unique name of account
     *
     * @param {number} index
     * @param {*} item
     * @returns {*}
     * @memberof SettingIntegrationComponent
     */
    public trackByAlertUniqueName(index: number, item: any): any {
        return item?.uniqueName;
    }

    /**
     * This returns the payor unique name of payor
     *
     * @param {number} index
     * @param {*} item
     * @returns {*}
     * @memberof SettingIntegrationComponent
     */
    public trackByPayorUniqueName(index: number, item: any): any {
        return item?.bankUserId;
    }

    /**
     * This will delete/deregister the bank account login
     *
     * @memberof SettingIntegrationComponent
     */
    public deleteBankAccountLogin(): void {
        let model;
        if (this.isPlaidSupportedCountry) {
            model = { uniqueName: this.activeBankAccount?.uniqueName, urn: this.activeBankAccount?.bankUserId }
        } else {
            model = { uniqueName: this.activeBankAccount?.uniqueName, bankUserId: this.activeBankAccount?.bankUserId }
        }
        this.settingsIntegrationService.deleteBankAccountLogin(model).pipe(take(1)).subscribe(response => {
            if (response?.status === "success") {
                this.getAllBankAccounts();
            } else {
                this.toasty.clearAllToaster();
                this.toasty.errorToast(response?.message);
            }
        });
    }

    /**
     * This will show the delete bank account login confirmation modal
     *
     * @param {*} bankAccount
     * @param {*} payor
     * @memberof SettingIntegrationComponent
     */
    public showDeleteBankAccountLoginConfirmationModal(bankAccount: any, payor: any): void {
        if (this.isPlaidSupportedCountry) {
            this.activeBankAccount = { uniqueName: bankAccount?.bankResource?.uniqueName, urn: payor?.bankUserId, loginId: payor?.loginId };
        } else {
            this.activeBankAccount = { uniqueName: bankAccount?.bankResource?.uniqueName, bankUserId: payor?.bankUserId, loginId: payor?.loginId };
        }
        this.confirmationModalRef = this.dialog.open(this.confirmationModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
        });
    }

    /**
     * This will open the edit account user modal
     *
     * @param {*} bankAccount
     * @param {*} payor
     * @memberof SettingIntegrationComponent
     */
    public openEditAccountUserModal(bankAccount: any, payor: any): void {
        this.activeBankAccount = bankAccount;
        this.activePayorAccount = payor;
        this.editAccountUserModalRef = this.dialog.open(this.editAccountUserModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
        });
    }

    /**
     * This will open edit account modal
     *
     * @param {*} bankAccount
     * @memberof SettingIntegrationComponent
     */
    public openEditAccountModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.editAccountModalRef = this.dialog.open(this.editAccountModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
        });
    }

    /**
     * This will get the payor account registration status
     *
     * @param {*} bankAccount
     * @param {*} payor
     * @memberof SettingIntegrationComponent
     */
    public getPayorRegistrationStatus(bankAccount: any, payor: any): void {
        if (bankAccount?.bankResource?.uniqueName?.length && payor?.urn?.length) {
            let request;

            if (this.isPlaidSupportedCountry) {
                request = { bankAccountUniqueName: bankAccount.bankResource.uniqueName, urn: payor.urn };
            } else {
                request = { bankAccountUniqueName: bankAccount.bankResource.uniqueName, bankUserId: payor.urn };
            }

            this.settingsIntegrationService.getPayorRegistrationStatus(request).pipe(take(1)).subscribe(response => {
                payor.isConnected = (response?.body?.status === ACCOUNT_REGISTERED_STATUS);

                if (!payor.isConnected && response?.body?.message) {
                    this.toasty.errorToast(response?.body?.message);
                }
            });
        }
    }


    /**
     *This will use for copy api url link and display copied
     *
     * @memberof SettingIntegrationComponent
     */
    public copyUrl(): void {
        this.isCopied = true;
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }

    /**
     * This will be use for delete bank account
     *
     * @param {*} bank
     * @memberof SettingIntegrationComponent
     */
    public deleteBankAccount(bank: any): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.payment?.confirm_bank_delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStore.deleteEndUserAgreementByInstitutionId(bank?.bankResource?.uniqueName);
            }
        });
    }
}

