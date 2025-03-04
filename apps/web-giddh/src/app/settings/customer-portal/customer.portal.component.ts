import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, PaymentClass, PayPalClass, RazorPayClass, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { cloneDeep, find } from '../../lodash-optimized';
import { select, Store } from '@ngrx/store';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { debounceTime, filter, Observable, of as observableOf, pairwise, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { IForceClear } from '../../models/api-models/Sales';
import { AppState } from '../../store';
import { FormBuilder, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { ToasterService } from '../../services/toaster.service';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile } from '../constants/settings.constant';
import { ClipboardService } from 'ngx-clipboard';
import { Organization } from '../../models/api-models/Company';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';

@Component({
    selector: 'customer-portal',
    templateUrl: './customer.portal.component.html',
    styleUrls: ['./customer.portal.component.scss']
})
export class CustomerPortalComponent implements OnInit, AfterViewInit {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
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
    public defaultAccountPaginationData = {
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
    public voucherApiVersion: 1 | 2;
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** This will hold portal url */
    public portalUrl: any = PORTAL_URL;
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


    constructor(
        private generalService: GeneralService,
        private store: Store<AppState>,
        private searchService: SearchService,
        private _fb: UntypedFormBuilder,
        private changeDetectionRef: ChangeDetectorRef,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private toasty: ToasterService,
        private formBuilder: FormBuilder,
        private clipboardService: ClipboardService,
        private settingsProfileActions: SettingsProfileActions
    ) {
        this.initProfileForm();
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
    }

    /**
     * This hook will use for init
     *
     * @memberof ShopifyIntegrationComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(this.profileData.portalDomain);

        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
            if (organization) {
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

        if (this.organizationType === 'COMPANY') {
            this.profileForm?.get('portalDomain')?.valueChanges?.pipe(
                takeUntil(this.destroyed$),
                debounceTime(700),
                pairwise(),
                filter(([prev, curr]) => prev !== curr)
            ).subscribe(([prev, curr]) => {
                this.store.dispatch(this.settingsProfileActions.PatchProfile(this.profileData));
            });
        }

        // getting all page data of integration page
        this.store.pipe(select(p => p?.settings?.integration), takeUntil(this.destroyed$)).subscribe((o) => {
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
        });

        this.store.pipe(select(appState => appState.settings.profile), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.portalDomain) {
                this.profileForm.get('portalDomain').patchValue(response.portalDomain);
                this.profileData.portalDomain = response.portalDomain;
            }
        });

    }

    /**
 * Initialise Form
 *
 * @private
 * @memberof PersonalInformationComponent
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


    public ngAfterViewInit(): void {
        this.loadDefaultAccountsSuggestions();
        this.paypalLoadDefaultAccountsSuggestions();
        this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
        this.store.dispatch(this.settingsIntegrationActions.getPaypalDetails());
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
     * Releases memory
     *
     * @memberof SettingIntegrationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
 * Handles profile update operation
 *
 * @param {string} keyName Key to be updated
 * @memberof PersonalInformationComponent
 */
    public profileUpdated(keyName: string): void {
        const value = this.profileForm?.get(keyName).value;
        if (this.updatedData[keyName] !== value) {
            this.updatedData[keyName] = value;
            this.saveProfileSubject.next(true);
        }
    }

    /**
       *This will use for copy api url link and display copied
       *
       * @memberof PersonalInformationComponent
       */
    public copyUrl(): void {
        const urlToCopy = this.portalLoginUrl;
        this.clipboardService.copyFromContent(urlToCopy);
        this.isCopied = true;
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }


}
