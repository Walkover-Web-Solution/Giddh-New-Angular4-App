import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, PaymentClass, RazorPayClass, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyActions } from "../../actions/company.actions";
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { BootstrapToggleSwitch, Configuration, SELECT_ALL_RECORDS } from "../../app.constant";
import { AuthenticationService } from "../../services/authentication.service";
import { IForceClear } from '../../models/api-models/Sales';
import { EcommerceService } from '../../services/ecommerce.service';
import { GeneralService } from '../../services/general.service';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { ACCOUNT_REGISTERED_STATUS, SettingsIntegrationTab, UNLIMITED_LIMIT } from '../constants/settings.constant';
import { SearchService } from '../../services/search.service';
import { SalesService } from '../../services/sales.service';
import { cloneDeep, find, isEmpty } from '../../lodash-optimized';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { TabDirective } from 'ngx-bootstrap/tabs';

export interface ActiveTriggers {
    title: string;
    type: string;
    createdAt: string;
    uniqueName: string;
    argsMapping: string;
    isActive: boolean;
}

export interface table2 {
    triggers: string;
    type: string;
    content: string;
    text: string;
    icon: string;
    button: string;
}

const TABLE2_ELEMENT_DATA: table2[] = [
    { triggers: 'On-Board', type: 'Email', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Invoice Generation', type: 'SMS', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
];

const TABLE3_ELEMENT_DATA: table2[] = [
    { triggers: 'On-Board', type: 'Email', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Invoice Generation', type: 'SMS', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
    { triggers: 'Dues', type: 'Voice', content: 'Hello user, Welcome to Giddh. Please setup your account by providing your company details', text: '', icon: 'copy.svg', button: 'Activate' },
];

@Component({
    selector: 'setting-integration',
    templateUrl: './setting.integration.component.html',
    styleUrls: ['./setting.integration.component.scss']
})
export class SettingIntegrationComponent implements OnInit, AfterViewInit {
    /** Active trigger columns */
    public activeTriggersColumns: string[] = ['title', 'type', 'argsMapping', 'createdAt', 'action'];
    /** Data source for active triggers list */
    public activeTriggersDataSource: ActiveTriggers[] = [];
    public isActiveTriggersLoading: boolean = false;

    displayedtable2Columns: string[] = ['triggers', 'type', 'content', 'icon', 'button'];
    table2 = TABLE2_ELEMENT_DATA;

    displayedtable3Columns: string[] = ['triggers', 'type', 'content', 'button'];
    table3 = TABLE3_ELEMENT_DATA;

    public auth2: any;
    public smsFormObj: SmsKeyClass = new SmsKeyClass();
    public emailFormObj: EmailKeyClass = new EmailKeyClass();
    public paymentFormObj: PaymentClass = new PaymentClass();
    public razorPayObj: RazorPayClass = new RazorPayClass();
    public payoutObj: CashfreeClass = new CashfreeClass();
    public autoCollectObj: CashfreeClass = new CashfreeClass();
    public amazonSeller: AmazonSellerClass = new AmazonSellerClass();
    public accounts$: Observable<IOption[]>;
    public updateRazor: boolean = false;
    public autoCollectAdded: boolean = false;
    public payoutAdded: boolean = false;
    public bankAccounts$: Observable<IOption[]>;
    public gmailAuthCodeUrl$: Observable<string> = null;
    public amazonSellerForm: FormGroup;
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
    /** To check company country */
    public isIndianCompany: boolean = true;

    @Input() private selectedTabParent: number;
    //@ViewChild('integrationTab', { static: true }) public integrationTab: TabsetComponent;
    @ViewChild('removegmailintegration', { static: true }) public removegmailintegration: ModalDirective;
    @ViewChild('paymentForm', { static: true }) paymentForm: NgForm;
    @ViewChild('paymentFormAccountName', { static: true }) paymentFormAccountName: ShSelectComponent;
    /** Instance of create new account modal */
    @ViewChild('createNewAccountModal', { static: false }) public createNewAccountModal: ModalDirective;
    /** Instance of edit account modal */
    @ViewChild('editAccountModal', { static: false }) public editAccountModal: ModalDirective;
    /** Instance of create new account user modal */
    @ViewChild('createNewAccountUserModal', { static: false }) public createNewAccountUserModal: ModalDirective;
    /** Instance of edit account user modal */
    @ViewChild('editAccountUserModal', { static: false }) public editAccountUserModal: ModalDirective;
    /** Instance of delete account user modal */
    @ViewChild('confirmationModal', { static: false }) public confirmationModal: ModalDirective;

    //variable holding account Info
    public registeredAccount;
    public isEcommerceShopifyUserVerified: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public selectedCompanyUniqueName: string;
    /* This will clear the selected linked account */
    public forceClearLinkAccount$: Observable<IForceClear> = observableOf({ status: false });
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
    /** Stores the list of accounts */
    public accounts: IOption[];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for create new account form */
    public createNewAccountForm: FormGroup;
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
    public editAccountUserForm: FormGroup;
    /** Form Group for edit account form */
    public editAccountForm: FormGroup;
    /** Holds unlimited text for amount limit */
    public unlimitedLimit: string = UNLIMITED_LIMIT;
    /** This will hold active company data */
    public activeCompany: any;
    /** Holds image path */
    public imgPath: string = '';
    /** Holds communication platforms */
    public communicationPlatforms: any = {};
    /** Communication platform auth model  */
    public communicationPlatformAuthModel: any = {
        platform: "",
        authFields: []
    };
    /** True if communication platform get api in progress */
    public isCommunicationPlatformsLoading: boolean = true;
    /** True if communication platform verification api in progress */
    public isCommunicationPlatformVerificationInProcess: boolean = false;
    /** Holds the communication platform which is in edit mode */
    public editCommunicationPlatform: string = "";
    /** True if need to show trigger form */
    public showTriggerForm: boolean = false;
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;
    /** List of field suggestions */
    public fieldsSuggestion: any[] = [];
    /** List of action */
    public action: any[] = [];
    /** List of field suggestions */
    public compaignVariables: any[] = [
        'Var1', 'Var2', 'Var3', 'Var4', 'Var5'
    ];

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private ecommerceService: EcommerceService,
        private toasty: ToasterService,
        private _companyActions: CompanyActions,
        private _authenticationService: AuthenticationService,
        private _fb: FormBuilder,
        private settingsPermissionActions: SettingsPermissionActions,
        private generalService: GeneralService,
        private settingsIntegrationService: SettingsIntegrationService,
        private searchService: SearchService,
        private salesService: SalesService,
        private dialog: MatDialog
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
        this.getCommunicationPlatforms();
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        //logic to switch to payment tab if coming from vedor tabs add payment
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }

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
                    this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
                }
                this.updateRazor = true;
            } else {
                this.setDummyData();
                this.updateRazor = false;
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
                this.isIndianCompany = profile.countryV2.alpha2CountryCode === 'IN' ? true : false;
                if (!this.isIndianCompany && this.selectedTabParent === 3) {
                    this.selectedTabParent = 0;
                    this.selectTab(this.selectedTabParent);
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
    }

    public ngAfterViewInit() {
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }
        this.loadTabData();
    }

    public setDummyData() {
        if (this.razorPayObj) {
            this.razorPayObj.userName = '';
            this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
            this.razorPayObj.account = { name: null, uniqueName: null };
            this.razorPayObj.autoCapturePayment = true;
        }
        this.forceClearLinkAccount$ = observableOf({ status: true });
    }

    public onSubmitMsgform(f: NgForm) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveSMSKey(f.value.smsFormObj));
        }
    }

    public onSubmitEmailform(f: NgForm) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveEmailKey(f.value));
        }
    }

    public selectAccount(event: IOption) {
        if (event.value) {
            this.accounts$.subscribe((arr: IOption[]) => {
                let res = find(arr, (o) => o.value === event.value);
                if (res) {
                    this.razorPayObj.account.name = res.text;
                }
            });
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
        if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account.uniqueName) {
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

    public removeGmailAccount() {
        this.store.dispatch(this.settingsIntegrationActions.RemoveGmailIntegration());
    }

    public selectCashfreeAccount(event: IOption, objToApnd) {
        let accObj = {
            name: event.label,
            uniqueName: event.value
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
        sellers.push(cloneDeep(obj.value));
        this.store.dispatch(this.settingsIntegrationActions.AddAmazonSeller(sellers));
    }

    /**
     * updateAmazonSeller
     */
    public updateAmazonSeller(obj) {
        if (!obj.value.sellerId) {
            return;
        }
        let sellerObj = cloneDeep(obj.value);
        delete sellerObj['secretKey'];
        this.store.dispatch(this.settingsIntegrationActions.UpdateAmazonSeller(sellerObj));
    }

    /**
     * deleteAmazonSeller
     */
    public deleteAmazonSeller(sellerId, idx) {
        let seller = this.amazonSellerRes.findIndex((o) => o.sellerId === sellerId);
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
        const control = this.amazonSellerForm.controls['sellers'] as FormArray;
        if (item) {
            if (control.controls[i]) {
                control.controls[i]?.patchValue(item);
                if (control.controls[i].value.sellerId) {
                    control.controls[i].disable();
                }
            } else {
                control.push(this.initAmazonReseller());
                setTimeout(() => {
                    control.controls[i]?.patchValue(item);
                    if (control.controls[i].value.sellerId) {
                        control.controls[i].disable();
                    }
                }, 200);
            }
        } else {
            let arr = control.value;
            if (!control.value[arr?.length - 1]?.sellerId) {
                return;
            }
            control.push(this.initAmazonReseller());
        }
    }

    // remove amazon Seller controls
    public removeAmazonSeller(i: number) {
        // remove address from the list
        const control = this.amazonSellerForm.controls['sellers'] as FormArray;
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
        const control = this.amazonSellerForm.controls['sellers'] as FormArray;
        if (type === 'enable') {
            control.controls[idx].enable();
        } else {
            control.controls[idx].disable();
        }
    }

    private getRedirectUrl(baseHref: string) {
        return `${baseHref}pages/settings?tab=integration`;
    }

    public selectTab(id: number) {
        // if (this.integrationTab.tabs[id] && this.integrationTab.tabs[id] !== undefined) {
        //     this.integrationTab.tabs[id].active = true;
        // }
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

                        if (res.status === 'success') {
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
        //if (event && event instanceof TabDirective || !event) {
        this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
        // }
    }

    /**
     * Loads Collection tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadCollectionData(event?): void {
        // if (event && event instanceof TabDirective || !event) {
        this.loadDefaultAccountsSuggestions();
        this.loadDefaultBankAccountsSuggestions();
        this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
        //}
    }

    /**
     * Loads the Email tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadEmailData(event?: any): void {
        // if (event && event instanceof TabDirective || !event) {
        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
        this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
        // }
    }

    /**
     * Loads SMS tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadSmsData(event?: any): void {
        // if (event && event instanceof TabDirective || !event) {
        // if (event && event instanceof TabDirective || !event) {
        this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
        // }
        // }
    }

    /**
     * Loads the tab data based on tab selected
     *
     * @private
     * @memberof SettingIntegrationComponent
     */
    private loadTabData(): void {
        switch (this.selectedTabParent) {
            // case SettingsIntegrationTab.Sms:
            //     this.loadSmsData();
            //     break;
            case SettingsIntegrationTab.Email:
                this.loadEmailData();
                break;
            case SettingsIntegrationTab.Collection:
                this.loadCollectionData();
                break;
            // case SettingsIntegrationTab.ECommerce:
            //     this.loadEcommerceData();
            //     break;
            case SettingsIntegrationTab.Payment:
                this.loadPaymentData();
                break;
            default:
                break;
        }
    }

    /**
     * This will navigate to selected tab
     *
     * @param {string} tab
     * @memberof SettingIntegrationComponent
     */
    public tabChanged(tab: string): void {
        this.router.navigateByUrl('/pages/settings/integration/' + tab);
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
                            value: result.uniqueName,
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
                                value: result.uniqueName,
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
        this.createNewAccountModal?.show();
    }

    /**
     * This will close the create new account modal
     *
     * @memberof SettingIntegrationComponent
     */
    public closeCreateNewAccountModal(): void {
        this.createNewAccountModal?.hide();
    }

    /**
     * This will open the create new account user modal
     *
     * @param {*} bankAccount
     * @memberof SettingIntegrationComponent
     */
    public openCreateNewAccountUserModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.createNewAccountUserModal?.show();
    }

    /**
     * This will close the create new account user modal
     *
     * @memberof SettingIntegrationComponent
     */
    public closeCreateNewAccountUserModal(): void {
        this.createNewAccountUserModal?.hide();
    }

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
                    if (bankAccount?.iciciDetailsResource?.payor?.length > 0) {
                        bankAccount?.iciciDetailsResource?.payor.forEach(payor => {
                            this.getPayorRegistrationStatus(bankAccount, payor);
                        });
                    }
                });
            }
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
        return item?.iciciDetailsResource?.uniqueName;
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
        return item?.urn;
    }

    /**
     * This will delete/deregister the bank account login
     *
     * @memberof SettingIntegrationComponent
     */
    public deleteBankAccountLogin(): void {
        let model = { uniqueName: this.activeBankAccount?.uniqueName, urn: this.activeBankAccount?.urn }
        this.settingsIntegrationService.deleteBankAccountLogin(model).pipe(take(1)).subscribe(response => {
            if (response?.status === "success") {
                this.getAllBankAccounts();
                this.confirmationModal?.hide();
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
        this.activeBankAccount = { uniqueName: bankAccount?.iciciDetailsResource?.uniqueName, urn: payor?.urn, loginId: payor?.loginId };
        this.confirmationModal?.show();
    }

    /**
     * This will close the delete bank account login confirmation modal
     *
     * @memberof SettingIntegrationComponent
     */
    public closeDeleteBankAccountLoginConfirmationModal(): void {
        this.confirmationModal?.hide();
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
        this.editAccountUserModal?.show();
    }

    /**
     * This will close the edit account user modal
     *
     * @memberof SettingIntegrationComponent
     */
    public closeEditAccountUserModal(): void {
        this.editAccountUserModal?.hide();
    }

    /**
     * This will open edit account modal
     *
     * @param {*} bankAccount
     * @memberof SettingIntegrationComponent
     */
    public openEditAccountModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.editAccountModal?.show();
    }

    /**
     * This will close the edit account modal
     *
     * @memberof SettingIntegrationComponent
     */
    public closeEditAccountModal(): void {
        this.editAccountModal?.hide();
    }

    /**
     * This will get the payor account registration status
     *
     * @param {*} bankAccount
     * @param {*} payor
     * @memberof SettingIntegrationComponent
     */
    public getPayorRegistrationStatus(bankAccount: any, payor: any): void {
        let request = { bankAccountUniqueName: bankAccount?.iciciDetailsResource?.uniqueName, urn: payor?.urn };

        this.settingsIntegrationService.getPayorRegistrationStatus(request).pipe(take(1)).subscribe(response => {
            payor.isConnected = (response?.body?.status === ACCOUNT_REGISTERED_STATUS);

            if (!payor.isConnected && response?.body?.message) {
                this.toasty.errorToast(response?.body?.message);
            }
        });
    }

    /**
     * Get platforms and fields for integration
     *
     * @private
     * @memberof SettingIntegrationComponent
     */
    private getCommunicationPlatforms(): void {
        this.communicationPlatforms = [];
        this.isCommunicationPlatformsLoading = true;
        this.editCommunicationPlatform = "";
        this.settingsIntegrationService.getCommunicationPlatforms().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body?.platforms?.length > 0) {
                    response.body.platforms.forEach(platform => {
                        this.communicationPlatforms[platform.name] = [];
                        this.communicationPlatforms[platform.name].name = platform.name;
                        this.communicationPlatforms[platform.name].uniqueName = platform.uniqueName;

                        let fields = [];
                        platform.fields.forEach(pt => {
                            fields[pt.field] = pt;
                        });

                        this.communicationPlatforms[platform.name].fields = fields;
                        this.communicationPlatforms[platform.name].isConnected = (this.communicationPlatforms[platform.name]['fields']?.auth_key?.value);
                    });
                }
                if (this.communicationPlatforms['MSG91'].isConnected) {
                    this.getTriggers();
                    this.getFieldsSuggestion(response?.body?.platforms[0]?.name, "VOUCHER");
                    this.getCampaignList();

                } else {
                    this.editCommunicationPlatform = "MSG91";
                }
                this.isCommunicationPlatformsLoading = false;
            } else {
                this.toasty.showSnackBar("error", response?.message);
                this.isCommunicationPlatformsLoading = false;
            }
        });
    }

    /**
     * Verifies the integration with communication platform
     *
     * @param {string} platform
     * @memberof SettingIntegrationComponent
     */
    public verifyCommunicationPlatform(platform: string): void {
        this.isCommunicationPlatformVerificationInProcess = true;
        this.communicationPlatformAuthModel.platform = platform;
        this.communicationPlatformAuthModel.authFields.push({
            name: "authKey",
            value: this.communicationPlatforms?.MSG91?.fields?.auth_key?.value
        });

        this.settingsIntegrationService.verifyCommunicationPlatform(this.communicationPlatformAuthModel).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasty.showSnackBar("success", platform + " platform has been verified successfully.");
                this.getCommunicationPlatforms();
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
            this.isCommunicationPlatformVerificationInProcess = false;
        });
    }

    /**
     * Deletes the integration with communication platform
     *
     * @param {string} platformUniqueName
     * @memberof SettingIntegrationComponent
     */
    public deleteCommunicationPlatform(platformUniqueName: string): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.communication?.delete_platform,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.settingsIntegrationService.deleteCommunicationPlatform(platformUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toasty.showSnackBar("success", response?.body);
                        this.getCommunicationPlatforms();
                    } else {
                        this.toasty.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Gets the list of triggers
     *
     * @memberof SettingIntegrationComponent
     */
    public getTriggers(): void {
        this.isActiveTriggersLoading = true;
        this.activeTriggersDataSource = [];
        this.settingsIntegrationService.getTriggersList().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body?.items?.length > 0) {
                    response?.body?.items?.forEach(trigger => {
                        console.log(trigger);

                        const argsMapping = [];
                        if (trigger.argsMapping?.length > 0) {
                            trigger.argsMapping.forEach(arg => {
                                argsMapping.push(arg.name + " -> " + arg.value);
                            });
                        }

                        this.activeTriggersDataSource.push({ title: trigger.title, type: trigger.communicationPlatform, createdAt: trigger.createdAt, uniqueName: trigger.uniqueName, argsMapping: argsMapping?.join(", "), isActive: trigger.isActive });
                    });
                }
                this.isActiveTriggersLoading = false;
            } else {
                this.toasty.showSnackBar("error", response?.body);
                this.isActiveTriggersLoading = false;
            }
        });
    }

    public getFieldsSuggestion(platform: string, entity: any): void {
        this.settingsIntegrationService.getFieldSuggestions(platform, entity).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response) {
                    this.fieldsSuggestion = response.body?.suggestions?.map((result: any) => {
                        return {
                            value: result,
                            label: result
                        }
                    });
                    this.action = response.body?.subCondition[0].action;
                }
            }
        });
    }

    public getCampaignFields(slug: string): void {
        this.settingsIntegrationService.getCampaignFields(slug).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                console.log('cmp fields',response);

                }
            });
        }

    public getCampaignList(): void {
        this.settingsIntegrationService.getCampaignList().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                // console.log('cmp list',response);
                let slug ;
                response?.body?.data[0].slug
                console.log(slug);

                this.getCampaignFields(slug);
            }
        });
    }

    public onSelectFieldSuggestions(): void {

    }
    /**
     * Deletes the trigger
     *
     * @param {string} triggerUniqueName
     * @memberof SettingIntegrationComponent
     */
    public deleteTrigger(triggerUniqueName: string): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.communication?.delete_trigger,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.settingsIntegrationService.deleteTrigger(triggerUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toasty.showSnackBar("success", response?.body);
                        this.getTriggers();
                    } else {
                        this.toasty.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    public toggleTriggerForm(triggerUniqueName?: string): void {
        if (this.showTriggerForm) {
            this.showTriggerForm = false;
            return;
        }

        this.showTriggerForm = true;
    }
}
