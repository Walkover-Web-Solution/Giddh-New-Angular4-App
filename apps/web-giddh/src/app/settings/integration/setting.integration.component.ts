import { Observable, of as observableOf, ReplaySubject, of } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import * as _ from '../../lodash-optimized';
import {
    AmazonSellerClass,
    CashfreeClass,
    EmailKeyClass,
    PaymentClass,
    RazorPayClass,
    SmsKeyClass,
    IntegratedBankList
} from '../../models/api-models/SettingsIntegraion';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { TabsetComponent, TabDirective } from "ngx-bootstrap/tabs";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyActions } from "../../actions/company.actions";
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { Configuration } from "../../app.constant";
import { AuthenticationService } from "../../services/authentication.service";
import { IForceClear } from '../../models/api-models/Sales';
import { EcommerceService } from '../../services/ecommerce.service';
import { GeneralService } from '../../services/general.service';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { SettingsIntegrationTab } from '../constants/settings.constant';
import { SearchService } from '../../services/search.service';
import { SalesService } from '../../services/sales.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import { isEqual } from '../../lodash-optimized';

export declare const gapi: any;

@Component({
    selector: 'setting-integration',
    templateUrl: './setting.integration.component.html',
    styleUrls: ['./setting.integration.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class SettingIntegrationComponent implements OnInit, AfterViewInit {

    public auth2: any;
    public smsFormObj: SmsKeyClass = new SmsKeyClass();
    public emailFormObj: EmailKeyClass = new EmailKeyClass();
    public paymentFormObj: PaymentClass = new PaymentClass();
    public razorPayObj: RazorPayClass = new RazorPayClass();
    public payoutObj: CashfreeClass = new CashfreeClass();
    public autoCollectObj: CashfreeClass = new CashfreeClass();
    public paymentGateway: CashfreeClass = new CashfreeClass();
    public amazonSeller: AmazonSellerClass = new AmazonSellerClass();
    public accounts$: Observable<IOption[]>;
    public updateRazor: boolean = false;
    public paymentGatewayAdded: boolean = false;
    public autoCollectAdded: boolean = false;
    public payoutAdded: boolean = false;
    public bankAccounts$: Observable<IOption[]>;
    public gmailAuthCodeUrl$: Observable<string> = null;
    public amazonSellerForm: FormGroup;
    public amazonEditItemIdx: number;
    public amazonSellerRes: AmazonSellerClass[];
    public isGmailIntegrated$: Observable<boolean>;
    public isPaymentAdditionSuccess$: Observable<boolean>;
    public isPaymentUpdationSuccess$: Observable<boolean>;
    public isElectron: boolean = Configuration.isElectron;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    private isSellerAdded: Observable<boolean> = observableOf(false);
    private isSellerUpdate: Observable<boolean> = observableOf(false);
    /** user who is logged in currently */
    private loggedInUserEmail: string;
    /** List of integrated bank */
    public integratedBankList: IntegratedBankList;
    /** Add bank form reference */
    public addBankForm: FormGroup;
    /** Input mast for number format */
    public inputMaskFormat: string = '';
    /** To check company country */
    public isIndianCompany: boolean = true;
    /** To check update bank form validations */
    public isUpdateBankFormValid$: Observable<boolean> = of(false);

    @Input() private selectedTabParent: number;
    @ViewChild('integrationTab', { static: true }) public integrationTab: TabsetComponent;
    @ViewChild('removegmailintegration', { static: true }) public removegmailintegration: ModalDirective;
    @ViewChild('paymentForm', { static: true }) paymentForm: NgForm;
    @ViewChild('paymentFormAccountName', { static: true }) paymentFormAccountName: ShSelectComponent;


    //variable holding account Info
    public registeredAccount;
    /** To check is registration form open*/
    public openNewRegistration: boolean;
    /**Selected bank integration form index for update  */
    public selecetdUpdateIndex: number;
    public isEcommerceShopifyUserVerified: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** List OTP type  */
    public typeOTPList: IOption[] = [];
    public amountUpToList: IOption[] = [];
    // public approvalNameList: IOption[] = [];
    public selectedCompanyUniqueName: string;
    public isCreateInvalid: boolean = false;
    /** update bank form validation for amount */
    public isUpdateInvalid: boolean = false;


    /** Maximum amount length limit */
    public maxLimit: number = 8;
    /** Maximum amount limit */
    public maxAmountLimit: number;
    /** To check bank update form in edit mode */
    public isBankUpdateInEdit: number = null;
    /** Update bank urn number */
    public updateBankUrnNumber: any;
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
    /** This will hold urn for which beneficiary will open */
    public activeUrn: any;
    /** Beneficiary aside pan status */
    public beneficiaryAsideState: string = "out";
    /** This will hold users list */
    public usersList: any[] = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private ecommerceService: EcommerceService,
        private toasty: ToasterService,
        private _companyActions: CompanyActions,
        private _authenticationService: AuthenticationService,
        private _fb: FormBuilder,
        private _generalActions: GeneralActions,
        private settingsPermissionActions: SettingsPermissionActions,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private settingsIntegrationService: SettingsIntegrationService,
        private searchService: SearchService,
        private salesService: SalesService
    ) {
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl?.replace(':redirect_url', this.getRedirectUrl(AppUrl))?.replace(':client_id', this.getGoogleCredentials().GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
        this.isSellerAdded = this.store.pipe(select(s => s.settings.amazonState.isSellerSuccess), takeUntil(this.destroyed$));
        this.isSellerUpdate = this.store.pipe(select(s => s.settings.amazonState.isSellerUpdated), takeUntil(this.destroyed$));
        this.isGmailIntegrated$ = this.store.pipe(select(s => s.settings.isGmailIntegrated), takeUntil(this.destroyed$));
        this.isPaymentAdditionSuccess$ = this.store.pipe(select(s => s.settings.isPaymentAdditionSuccess), takeUntil(this.destroyed$));
        this.isPaymentUpdationSuccess$ = this.store.pipe(select(s => s.settings.isPaymentUpdationSuccess), takeUntil(this.destroyed$));

        this.store.pipe(select(s => s.session.user), take(1)).subscribe(result => {
            if (result && result.user) {
                this.generalService.user = result.user;
                this.loggedInUserEmail = result.user.email;
            }
        });
    }

    public ngOnInit() {

        //logic to switch to payment tab if coming from vedor tabs add payment
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }
        this.addBankForm = this.createBankIntegrationForm();
        // getting all page data of integration page
        this.store.pipe(select(p => p.settings.integration), takeUntil(this.destroyed$)).subscribe((o) => {
            // set sms form data
            if (o.smsForm) {
                this.smsFormObj = o.smsForm;
            }
            // set email form data
            if (o.emailForm) {
                this.emailFormObj = o.emailForm;
            }
            // set razor pay form data
            if (o.razorPayForm) {
                if (typeof o.razorPayForm !== "string") {
                    this.razorPayObj = _.cloneDeep(o.razorPayForm);
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
                this.payoutObj = _.cloneDeep(o.payoutForm);
                // this.payoutObj.password = 'YOU_ARE_NOT_ALLOWED';
                this.payoutAdded = true;
            } else {
                this.payoutObj = new CashfreeClass();
                this.payoutAdded = false;
            }
            if (o.autoCollect && o.autoCollect.userName) {
                this.autoCollectObj = _.cloneDeep(o.autoCollect);
                // this.autoCollectObj.password = 'YOU_ARE_NOT_ALLOWED';
                this.autoCollectAdded = true;
            } else {
                this.autoCollectObj = new CashfreeClass();
                this.autoCollectAdded = false;
            }
            if (o.paymentGateway && o.paymentGateway.userName) {
                this.paymentGateway = _.cloneDeep(o.paymentGateway);
                this.paymentGatewayAdded = true;
            } else {
                this.paymentGateway = new CashfreeClass();
                this.paymentGatewayAdded = false;
            }
            if (o.amazonSeller && o.amazonSeller.length) {
                this.amazonSellerRes = _.cloneDeep(o.amazonSeller);
                this.amazonSellerForm.controls['sellers']?.patchValue(this.amazonSellerRes);
                // this.amazonSellerForm.controls['sellers'].disable();
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
        //logic to get all registered account for integration tab
        // this.store.dispatch(this._companyActions.getAllRegistrations());

        this.store.pipe(select(p => p.company), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && o.account) {
                if (!isEqual(this.registeredAccount, o.account)) {
                    this.registeredAccount = o.account;
                    if (this.registeredAccount && this.registeredAccount.length === 0) {
                        this.openNewRegistration = true;
                    }
                    if (this.registeredAccount && this.registeredAccount.length) {
                        this.registeredAccount.map(item => {
                            if (item && !item.userAmountRanges) {
                                item.userAmountRanges = [this.getBlankAmountRangeRow()]
                            }
                            if (!item.loginId) {
                                /* Login ID is not present, create it:
                                   Login ID = (Corporate ID).(User ID) or
                                   Login ID = Alias ID
                                */
                                if (item.aliasId) {
                                    item.loginId = item.aliasId
                                } else if (item.corpId && item.userId) {
                                    item.loginId = `${item.corpId}.${item.userId}`;
                                }
                            }
                            item.selectedUsers = this.usersList.filter(user => item.emailIds?.find(emailId => user.value === emailId)) ?? [];
                            this.getRegistrationStatus(item);
                            item.userAmountRanges.map(element => {
                                if (typeof element.maxBankLimit === "boolean") {
                                    element.maxBankLimit = element.maxBankLimit ? 'max' : 'custom';
                                }
                            });
                        });
                    }
                }
                if (this.addBankForm) {
                    this.addBankForm.reset();
                    this.addBankForm = this.createBankIntegrationForm();
                }
                this.isBankUpdateInEdit = null;
            }
        });

        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !_.isEmpty(res)) {
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
                if (!this.isIndianCompany && this.selectedTabParent === 4) {
                    this.selectedTabParent = 0;
                    this.selectTab(this.selectedTabParent);
                }
            }
        });

        // this.store.pipe(select(stores => stores.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(resp => {
        //     if (resp) {
        //         let data = _.cloneDeep(resp);
        //         let sortedArr = _.groupBy(this.prepareDataForUI(data), 'emailId');
        //         let arr: IOption[] = [];
        //         forIn(sortedArr, (value) => {
        //             if (value[0].emailId === this.loggedInUserEmail) {
        //                 value[0].isLoggedInUser = true;
        //             }
        //             arr.push({ label: value[0].userName, value: value[0].userUniqueName, additional: value });
        //         });
        //         let sortedArray = [];
        //         arr.forEach(item => {
        //             if (item.additional[0].mobileVerified) {
        //                 sortedArray.push(item);
        //             }
        //         });
        //         arr.forEach(item => {
        //             if (!item.additional[0].mobileVerified) {
        //                 sortedArray.push(item);
        //             }
        //         });
        //         this.approvalNameList = sortedArray;
        //     }
        // });

        if (this.selectedCompanyUniqueName) {
            this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
        }

        this.isPaymentUpdationSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.isBankUpdateInEdit = null;
                this.updateBankUrnNumber = null;
            }
        });

        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.usersList = [];
                response.forEach(user => {
                    this.usersList.push({ label: user.userName, value: user.emailId });
                });
            }
        });

    }

    public ngAfterViewInit() {
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }
        this.loadTabData();
    }

    // public getInitialData() {
    //     // this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
    //     // this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
    //     this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
    //     this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
    //     this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
    //     this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
    //     this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
    //     // this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
    //     this.store.pipe(take(1)).subscribe(s => {
    //         this.selectedCompanyUniqueName = s.session.companyUniqueName;
    //         this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
    //         this.getValidationForm('ICICI')
    //     });
    // }

    public setDummyData() {
        this.razorPayObj.userName = '';
        this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.razorPayObj.account = { name: null, uniqueName: null };
        this.razorPayObj.autoCapturePayment = true;
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


    /**
     *To submit form and send data to API Call
     *
     * @param {*} fomValue
     * @memberof SettingIntegrationComponent
     */
    public onSubmitPaymentform(fomValue: any): void {

        if (fomValue) {
            this.selecetdUpdateIndex = null;
            let requestObject = _.cloneDeep(fomValue);
            if (requestObject.userAmountRanges) {
                requestObject.userAmountRanges.map(element => {
                    element.maxBankLimit = (element.maxBankLimit === 'max') ? 'true' : 'false';
                });
            }
            this.isBankUpdateInEdit = null;
            this.updateBankUrnNumber = null;
            this.store.dispatch(this.settingsIntegrationActions.SavePaymentInfo(requestObject));
        }
    }

    public toggleCheckBox() {
        return this.razorPayObj.autoCapturePayment = !this.razorPayObj.autoCapturePayment;
    }

    public selectAccount(event: IOption) {
        if (event.value) {
            this.accounts$.subscribe((arr: IOption[]) => {
                let res = _.find(arr, (o) => o.value === event.value);
                if (res) {
                    this.razorPayObj.account.name = res.text;
                }
            });
        }
    }

    public saveRazorPayDetails() {
        let data = _.cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.SaveRazorPayDetails(data));
    }

    public updateRazorPayDetails() {
        let data = _.cloneDeep(this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
    }

    public unlinkAccountFromRazorPay() {
        if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account.uniqueName) {
            let data = _.cloneDeep(this.razorPayObj);
            data.account.uniqueName = null;
            data.account.name = null;
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
            let objToSend = _.cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        }
    }

    public deleteCashFreeAccount() {
        this.store.dispatch(this.settingsIntegrationActions.DeleteCashfreeDetails());
    }

    public updateCashfreeDetail(f) {
        if (f.userName && f.password) {
            let objToSend = _.cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateCashfreeDetails(objToSend));
        }
    }

    public submitAutoCollect(f) {
        if (f.userName && f.password) {
            let objToSend = _.cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.AddAutoCollectUser(objToSend));
        }
    }

    public updateAutoCollect(f) {
        if (f.userName && f.password) {
            let objToSend = _.cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateAutoCollectUser(objToSend));
        }
    }

    public deleteAutoCollect() {
        this.store.dispatch(this.settingsIntegrationActions.DeleteAutoCollectUser());
    }

    /**
     * submitPaymentGateway
     */
    public submitPaymentGateway(f) {
        if (f.userName && f.password) {
            this.store.dispatch(this.settingsIntegrationActions.AddPaymentGateway(f));
        }
    }

    /**
     * UpdatePaymentGateway
     */
    public updatePaymentGateway(f) {
        if (f.userName && f.password) {
            this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentGateway(f));
        }
    }

    /**
     * DeletePaymentGateway
     */
    public deletePaymentGateway() {
        this.store.dispatch(this.settingsIntegrationActions.DeletePaymentGateway());
    }

    /**
     * saveAmazonSeller
     */
    public saveAmazonSeller(obj) {
        let sellers = [];
        sellers.push(_.cloneDeep(obj.value));
        this.store.dispatch(this.settingsIntegrationActions.AddAmazonSeller(sellers));
    }

    /**
     * updateAmazonSeller
     */
    public updateAmazonSeller(obj) {
        if (!obj.value.sellerId) {
            return;
        }
        let sellerObj = _.cloneDeep(obj.value);
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
        const AmazonSellerControl = this.amazonSellerForm.controls['sellers'] as FormArray;
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
            if (!control.value[arr.length - 1].sellerId) {
                return;
            }
            control.push(this.initAmazonReseller());
        }
    }

    // remove amazon Seller controls
    public removeAmazonSeller(i: number) {
        // remove address from the list
        const control = this.amazonSellerForm.controls['sellers'] as FormArray;
        if (control.length > 1) {
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

    private getGoogleCredentials() {
        if (PRODUCTION_ENV || isCordova) {
            return {
                GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: 'eWzLFEb_T9VrzFjgE40Bz6_l'
            };
        } else {
            return {
                GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: '8htr7iQVXfZp_n87c99-jm7a'
            };
        }
    }

    public selectTab(id: number) {
        if (this.integrationTab.tabs[id] && this.integrationTab.tabs[id] !== undefined) {
            this.integrationTab.tabs[id].active = true;
        }
    }

    public openNewRegistartionForm() {
        this.isBankUpdateInEdit = null;
        this.addBankForm = this.createBankIntegrationForm();
        if (this.openNewRegistration) {
            //logic to get all registered account for integration tab
            this.store.dispatch(this._companyActions.getAllRegistrations());
            this.store.dispatch(this.settingsIntegrationActions.ResetICICIFlags());
        } else {
            this.openNewRegistration = true;
        }
        this.paymentFormObj = new PaymentClass();

        if (this.paymentForm) {
            this.paymentForm.resetForm();
            this.paymentFormAccountName.filter = '';
        }
    }

    public deRegisterForm(regAcc: IntegratedBankList) {
        this.store.dispatch(this.settingsIntegrationActions.ResetICICIFlags());
        this.store.dispatch(this.settingsIntegrationActions.RemovePaymentInfo(regAcc.URN));
    }

    /**
     * To update integrated bank details
     *
     * @param {IntegratedBankList} regAcc
     * @param {number} index
     * @memberof SettingIntegrationComponent
     */
    public updateIciciDetails(regAcc: IntegratedBankList, index: number) {
        this.selecetdUpdateIndex = index;
        this.store.dispatch(this.settingsIntegrationActions.ResetICICIFlags());
        let registeredAccountObj = _.cloneDeep(regAcc);
        registeredAccountObj.userAmountRanges.map(item => {
            item.maxBankLimit = item.maxBankLimit === "max" ? 'true' : 'false';
        });
        let requestData = {
            URN: this.updateBankUrnNumber,
            accountUniqueName: registeredAccountObj.accountUniqueName,
            userAmountRanges: registeredAccountObj.userAmountRanges,
            userNames: registeredAccountObj.userNames,
            emailIds: registeredAccountObj.emailIds
        }
        this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentInfo(requestData));
        this.paymentFormObj = new PaymentClass();
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
                    // this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
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
                        // this.router.navigateByUrl('/pages/settings?tab=integration&tabIndex=1');
                    });
                });

            } else {
                // linked in
                const t = ipcRenderer.send("authenticate", provider);
                // this.store.dispatch(this.loginAction.LinkedInElectronLogin(t));
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
                item.cidrsStr = item.allowedCidrs.toString();
            } else {
                item.cidrsStr = null;
            }
            if (item.allowedIps && item.allowedIps.length > 0) {
                item.ipsStr = item.allowedIps.toString();
            } else {
                item.ipsStr = null;
            }
            return item;
        });
    }

    /**
     * To select Max limit (Max bank or custom)
     *
     * @param {*} event  reference event
     * @param {number} index index number
     * @memberof SettingIntegrationComponent
     */
    public selectedMaxOrCustom(index: number, isUpdate: boolean, parentIndex?: number,): void {
        if (!isUpdate && this.paymentFormObj.userAmountRanges) {
            this.paymentFormObj.userAmountRanges[index].amount = null;
        }
        if (isUpdate && this.registeredAccount && this.registeredAccount[parentIndex].userAmountRanges) {
            this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
        }
    }

    /**
     * To select Max limit (Max bank or custom)
     *
     * @param {*} event  reference event
     * @param {number} index index number
     * @memberof SettingIntegrationComponent
     */
    public selectedMaxOrCustomField(index: number, isUpdate: boolean, parentIndex?: number, event?: any): void {

        if (!isUpdate) {
            let userAmountRanges = this.addBankForm.get('userAmountRanges') as FormArray;
            userAmountRanges.controls[index].get('amount')?.patchValue(null);
            if (event.value === 'max') {
                userAmountRanges.controls[index].get('maxBankLimit')?.patchValue('max');
                userAmountRanges.controls[index].get('amount')?.patchValue(null);
                userAmountRanges.controls[index].get('amount').clearValidators();
                userAmountRanges.controls[index].get('amount').reset();

                if (this.checkIsMaxBankLimitSelectedField(userAmountRanges, index)) {
                    userAmountRanges.controls[index].get('maxBankLimit')?.patchValue('custom');
                    userAmountRanges.controls[index].get('amount')?.patchValue(null);
                    userAmountRanges.controls[index].get('amount').setErrors({ 'incorrect': true });
                    userAmountRanges.controls[index].get('amount').setValidators(Validators.compose([Validators.required]));
                    this.toasty.infoToast(this.localeData?.payment?.max_limit_alert);
                }
            } else {
                userAmountRanges.controls[index].get('maxBankLimit')?.patchValue('custom');
                userAmountRanges.controls[index].get('amount').setValidators(Validators.compose([Validators.required]));
                userAmountRanges.controls[index].get('amount')?.patchValue(null);
            }
        }
        if (isUpdate && this.registeredAccount && this.registeredAccount[parentIndex].userAmountRanges) {
            this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
        }
    }


    /**
     * To call when max and custom limit options change
     *
     * @param {*} event
     * @param {number} index
     * @param {boolean} isUpdate
     * @param {number} [parentIndex]
     * @memberof SettingIntegrationComponent
     */
    public maxLimitOrCustomChanged(event: any, index: number, isUpdate: boolean, parentIndex?: number): void {

        if (!isUpdate) {
            if (event === 'max' && this.checkIsMaxBankLimitSelected(this.paymentFormObj.userAmountRanges, index)) {
                this.paymentFormObj.userAmountRanges[index].maxBankLimit = "custom";
                this.paymentFormObj.userAmountRanges[index].amount = null;
                this.toasty.infoToast(this.localeData?.payment?.max_limit_alert);
            } else {
                this.paymentFormObj.userAmountRanges[index].amount = null;
            }
        } else {
            if (event === 'max' && this.checkIsMaxBankLimitSelected(this.registeredAccount[parentIndex].userAmountRanges, index)) {
                this.registeredAccount[parentIndex].userAmountRanges[index].maxBankLimit = "custom";
                this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
                this.toasty.infoToast(this.localeData?.payment?.max_limit_alert);
            } else {
                this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
            }
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     * To check mac and custom is selected
     *
     * @param {any[]} itemList
     * @param {number} index
     * @returns {boolean}
     * @memberof SettingIntegrationComponent
     */
    public checkIsMaxBankLimitSelectedField(itemList: FormArray, index: number): boolean {


        let selected: boolean = false;
        if (itemList) {
            selected = itemList.controls.some((item, indx) => {
                if (index !== indx && item.get('maxBankLimit').value) {
                    return item.get('maxBankLimit').value === 'max';
                }
            }
            );
        }
        return selected;
    }

    public checkIsMaxBankLimitSelected(itemList: any[], index: number): boolean {

        let selected: boolean = false;
        if (itemList) {
            selected = itemList.some((item, indx) => {
                if (index !== indx && item.maxBankLimit) {
                    return item.maxBankLimit === 'max';
                }
            }
            );
        }
        return selected;
    }
    /**
     *To check if duplicate amount entered
     *
     * @param {*} item Selected element
     * @param {number} index Index of selected item
     * @param {HTMLInputElement} elementRef Input reference
     * @param {boolean} isUpdate True if is in update mode element
     * @param {number} [parentIndex] Index of parent object array
     * @memberof SettingIntegrationComponent
     */
    public changeAmount(item: any, index: number, elementRef: HTMLInputElement, isUpdate: boolean, parentIndex?: number) {
        if (!isUpdate && item && elementRef && this.paymentFormObj) {
            if (this.checkIsAmountRepeat(this.paymentFormObj.userAmountRanges, this.paymentFormObj.userAmountRanges[index].amount, index)) {
                elementRef.classList.add('error-box');
                this.isUpdateBankFormValid$ = of(false);
            } else {
                elementRef.classList.remove('error-box');
                this.checkFormValidations(this.addBankForm.value);
            }
        } else if (isUpdate && item && elementRef && this.registeredAccount[parentIndex]) {
            if (this.checkIsAmountRepeat(this.registeredAccount[parentIndex].userAmountRanges, this.registeredAccount[parentIndex].userAmountRanges[index].amount, index)) {
                elementRef.classList.add('error-box');
            } else {
                elementRef.classList.remove('error-box');
            }
        }
    }

    /**
     * To check is entered amount repeated
     *
     * @param {any[]} itemList List of item
     * @param {*} value Selected value
     * @param {number} index Index number
     * @returns {boolean}
     * @memberof SettingIntegrationComponent
     */
    public checkIsAmountRepeat(itemList: any[], value: any, index: number, isUpdateMode?: boolean): boolean {

        let selected: boolean = false;
        if (itemList) {
            selected = itemList.some((item, indx) => {
                if (index !== indx && item.amount && value) {
                    return Number(item.amount) === Number(value);
                }
            }
            );
        }
        if (!selected) {
            this.isCreateInvalid = this.isUpdateInvalid = this.toCheckBankAmountCustomFieldValidation(itemList);

        } else {
            this.isCreateInvalid = this.isUpdateInvalid = selected;
        }
        this.isUpdateBankFormValid$ = of(selected);
        return selected;
    }

    /**
     * To check duplicate amount in bank amount range field
     *
     * @param {any[]} itemList Amount rangeof bank integration array object
     * @returns {boolean}
     * @memberof SettingIntegrationComponent
     */
    public toCheckBankAmountCustomFieldValidation(itemList: any[]): boolean {
        let isInValid = false;
        if (itemList) {
            isInValid = itemList.some((item) => {
                return (item.maxBankLimit === 'custom' && !item.amount);
            });
        }
        return isInValid;
    }

    /**
     *Add new blank amount range row
     *
     * @param {number} [indexUpdateObj] selected item
     * @memberof SettingIntegrationComponent
     */
    public addNewAmountRangeRow(indexUpdateObj?: number): void {
        if (this.paymentFormObj && !indexUpdateObj && this.paymentFormObj.userAmountRanges) {
            this.paymentFormObj.userAmountRanges.push(this.getBlankAmountRangeRow());
        }
        if (indexUpdateObj && this.registeredAccount) {
            if (this.registeredAccount[indexUpdateObj - 1] && this.registeredAccount[indexUpdateObj - 1].userAmountRanges) {
                this.registeredAccount[indexUpdateObj - 1].userAmountRanges.push(this.getBlankAmountRangeRow());
            }
        }
    }

    /**
     * Get new blank amount range row
     *
     * @returns {UserAmountRangeRequests}
     * @memberof SettingIntegrationComponent
     */
    public getBlankAmountRangeRow(): any {
        let userAmountRanges = {
            amount: null,
            otpType: '',
            approvalUniqueName: '',
            maxBankLimit: 'custom',
        }
        // return new UserAmountRangeRequests();
        return userAmountRanges;
    }

    /**
     * Delete amount range row
     *
     * @param {*} item item object which need to remove
     * @memberof SettingIntegrationComponent
     */
    public deleteAmountRangeRow(item: any, indexUpdateList?: number): void {
        if (item && !indexUpdateList) {
            if (this.paymentFormObj.userAmountRanges.length > 1) {
                let itemIndx = this.paymentFormObj.userAmountRanges.findIndex((element) => element === item);
                if (itemIndx > -1) {
                    this.paymentFormObj.userAmountRanges.splice(itemIndx, 1);
                }
            } else {
                this.toasty.infoToast(this.localeData?.payment?.row_delete_error);
            }

        }
        if (item && indexUpdateList) {
            if (this.registeredAccount[indexUpdateList - 1].userAmountRanges.length > 1) {
                let itemIndxOfUpdate = this.registeredAccount[indexUpdateList - 1].userAmountRanges.findIndex((element) => element === item);
                if (itemIndxOfUpdate > -1) {
                    this.registeredAccount[indexUpdateList - 1].userAmountRanges.splice(itemIndxOfUpdate, 1);
                }
            } else {
                this.toasty.infoToast(this.localeData?.payment?.row_delete_error);
            }

        }
    }

    /**
     * To reset aaproval name if OTP type selected
     *
     * @param {IOption} event OTP type option event
     * @param {number} index index number
     * @param {boolean} isUpdate True if update mode
     * @memberof SettingIntegrationComponent
     */
    public selectedOtpType(event: IOption, index: number, isUpdate: boolean, parentIndex?: number): void {
        if (event && !isUpdate) {
            let validators = null;
            const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
            if (transactions.controls[index].get('otpType').value === 'GIDDH') {
                validators = Validators.compose([Validators.required]);
                transactions.controls[index].get('approvalUniqueName').setValidators(validators);
            } else {
                transactions.controls[index].get('approvalUniqueName').clearValidators();
            }
            transactions.controls[index].get('approvalUniqueName')?.patchValue(null)
        } else if (event && this.registeredAccount && this.registeredAccount[parentIndex].userAmountRanges && isUpdate) {
            this.registeredAccount[parentIndex].userAmountRanges[index].approvalUniqueName = null;
            this.registeredAccount[parentIndex].userAmountRanges[index].approvalDetails = null;
        }
        if (this.addBankForm && this.addBankForm.value) {
            this.checkFormValidations(this.addBankForm.value);
        }
    }

    /**
     * To clear/reset form
     *
     * @memberof SettingIntegrationComponent
     */
    public clearForm(): void {
        this.paymentFormObj = new PaymentClass();
        this.paymentFormObj.corpId = "";
        this.paymentFormObj.loginId = "";
        this.paymentFormObj.userId = "";
        this.paymentFormObj.accountNo = "";
        this.paymentFormObj.aliasId = "";
        this.paymentFormObj.accountUniqueName = "";
        this.paymentFormObj.userAmountRanges = [this.getBlankAmountRangeRow()];
        this.forceClear$ = observableOf({ status: true });
    }

    /**
     * To get validation of amount bank
     *
     * @param {string} bankType
     * @memberof SettingIntegrationComponent
     */
    public getValidationForm(bankType: string): void {
        if (this.selectedCompanyUniqueName && bankType) {
            this.settingsIntegrationService.getValidationFormForBank(this.selectedCompanyUniqueName, bankType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.status === 'success') {
                    if (response.body) {
                        this.maxLimit = String(response.body.maxAmount).length;
                        this.maxAmountLimit = String(response.body.maxAmount).length;

                    }
                }
            });
        }
    }


    /**
     * To create and initialize bank integration form
     *
     * @returns {FormGroup}
     * @memberof SettingIntegrationComponent
     */
    public createBankIntegrationForm(): FormGroup {
        return this._fb.group({
            loginId: [null, Validators.compose([Validators.required])],
            accountNo: [null, Validators.compose([Validators.required])],
            accountUniqueName: [null, Validators.compose([Validators.required])],
            userAmountRanges: this._fb.array([
                this._fb.group({
                    maxBankLimit: ['max', Validators.compose([Validators.required])],
                    otpType: ['BANK', Validators.compose([Validators.required])],
                    amount: [''],
                    approvalUniqueName: [''],
                })
            ]),
            userNames: [[]],
            emailIds: [[]]
        });
    }

    /**
     * To initialize user amout range of bank integration form
     *
     * @returns {FormGroup}
     * @memberof SettingIntegrationComponent
     */
    public initialUserAmountRangesForm(value?: any): FormGroup {
        let transactionsFields = this._fb.group({
            maxBankLimit: ['custom', Validators.compose([Validators.required])],
            otpType: ['', Validators.compose([Validators.required])],
            amount: [''],
            approvalUniqueName: [''],
        });
        if (value) {
            transactionsFields?.patchValue(value);
        }
        return transactionsFields;
    }


    /**
     * To add user amount range form
     *
     * @returns {*}
     * @memberof SettingIntegrationComponent
     */
    public addUserAmountRangesForm(): any {    // commented code because we no need GSTIN No. to add new address
        // if (value && !value.startsWith(' ', 0)) {
        const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
        transactions.push(this.initialUserAmountRangesForm());
        return;
    }

    /**
     * Prepare amount range array of bank integration
     *
     * @param {*} [addressObj=null]
     * @memberof SettingIntegrationComponent
     */
    public filledAmountRangesForm(addressObj: any = null) {
        const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
        transactions.push(this.initialUserAmountRangesForm(addressObj));
    }

    /**
     * To remove user amount range field
     *
     * @param {number} index
     * @memberof SettingIntegrationComponent
     */
    public removeUserAmountRangesForm(index: number): void {
        const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
        if (transactions.controls.length > 1) {
            transactions.removeAt(index);
        } else {
            this.toasty.infoToast(this.localeData?.payment?.row_delete_error);
        }
        this.isCreateInvalid = this.isUpdateInvalid = this.toCheckBankAmountCustomFieldValidation(transactions.value);
    }


    /**
     * Prevent zero amount form amount field
     *
     * @param {number} amount
     * @param {number} index
     * @param {number} [parentIndex]
     * @param {boolean} [isUpdate]
     * @memberof SettingIntegrationComponent
     */
    public preventZero(amount: number, index: number, parentIndex?: number, isUpdate?: boolean): any {

        if (!isUpdate) {
            const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
            if (Number(amount) <= 0) {
                transactions.controls[index].get('amount')?.patchValue(null);
            } else {
                transactions.controls[index].get('amount').setErrors(null);
            }
            this.checkFormValidations(this.addBankForm.value);
        }
        if (isUpdate) {
            if (Number(amount) <= 0) {
                this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
            }
        }
    }

    /**
     *Edit bank integration form
     *
     * @param {*} index
     * @memberof SettingIntegrationComponent
     */
    public editRegisterForm(index: any, updateFormValue?: IntegratedBankList): void {
        this.isBankUpdateInEdit = index;
        if (index === null) {
            this.resetUserSelection();
        } else {
            this.setUserSelection();
        }
        this.updateBankUrnNumber = null;
        this.addBankForm = this.createBankIntegrationForm();
        if (updateFormValue) {
            this.updateBankUrnNumber = updateFormValue.URN;
            if (updateFormValue.account && updateFormValue.account.uniqueName) {
                updateFormValue.accountUniqueName = updateFormValue.account.uniqueName;
            }
            this.openNewRegistration = false;
            this.addBankForm?.patchValue(updateFormValue);
            updateFormValue.userAmountRanges.forEach((item, indexAmount) => {
                if (indexAmount) {
                    this.filledAmountRangesForm(item);
                }
            });
            this.checkFormValidations(this.addBankForm.value);
            if (this.addBankForm.value) {
                this.isUpdateInvalid = this.toCheckBankAmountCustomFieldValidation(this.addBankForm.value.userAmountRanges);
            }
        } else {
            this.addBankForm = this.createBankIntegrationForm();
        }
    }

    /**
     *To check update form validation of bank integration
     *
     * @param {IntegratedBankList} item Form data
     * @returns {boolean}
     * @memberof SettingIntegrationComponent
     */
    public checkFormValidations(item: IntegratedBankList): boolean {
        let valid = false;
        if (item) {
            valid = (item.loginId && item.accountUniqueName && item.accountNo && item.userAmountRanges &&
                item.userAmountRanges.length) ? true : false;
            if (valid) {
                valid = item.userAmountRanges.every((rangeData: any) => {
                    return ((rangeData.maxBankLimit === 'max' && !rangeData.amount) || (rangeData.maxBankLimit === 'custom' && rangeData.amount)) && ((rangeData.otpType === 'GIDDH' && rangeData.approvalUniqueName) || (rangeData.otpType === 'BANK' && !rangeData.approvalUniqueName));
                });
            }
        }
        this.isUpdateBankFormValid$ = of(valid);
        return valid;
    }

    /** Note We have to use param 'postItem' as this need mapping on sh-select custome filter params
     * To apply custom sorting on approver list
     *
     * @param {IOption} preItem Params to sort selected item
     * @param {IOption} postItem Params to sort selected item
     * @returns
     * @memberof SettingIntegrationComponent
     */
    public customApproverNameListSorting(preItem: IOption, postItem: IOption): any {
        return (parseInt(preItem.label));
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
            this.store.dispatch(this._companyActions.getAllRegistrations());
            this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
            this.store.pipe(take(1)).subscribe(s => {
                this.selectedCompanyUniqueName = s.session.companyUniqueName;
                this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
                this.getValidationForm('ICICI')
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
        if (event && event instanceof TabDirective || !event) {
            this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
        }
    }

    /**
     * Loads Collection tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadCollectionData(event?): void {
        if (event && event instanceof TabDirective || !event) {
            this.loadDefaultAccountsSuggestions();
            this.loadDefaultBankAccountsSuggestions();
            this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
            // this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
            // this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
            // this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
        }
    }

    /**
     * Loads the Email tab data
     *
     * @param {any} event Tab select event
     * @memberof SettingIntegrationComponent
     */
    public loadEmailData(event?: any): void {
        if (event && event instanceof TabDirective || !event) {
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
        if (event && event instanceof TabDirective || !event) {
            if (event && event instanceof TabDirective || !event) {
                this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
            }
        }
    }

    /**
     * Loads the tab data based on tab selected
     *
     * @private
     * @memberof SettingIntegrationComponent
     */
    private loadTabData(): void {
        switch (this.selectedTabParent) {
            case SettingsIntegrationTab.Sms:
                this.loadSmsData();
                break;
            case SettingsIntegrationTab.Email:
                this.loadEmailData();
                break;
            case SettingsIntegrationTab.Collection:
                this.loadCollectionData();
                break;
            case SettingsIntegrationTab.ECommerce:
                this.loadEcommerceData();
                break;
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
                    value: result.uniqueName,
                    label: result.name
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
        this.salesService.getAccountsWithCurrency('bankaccounts').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                const bankAccounts = response.body.results.map(account => ({
                    label: account.name,
                    value: account.uniqueName
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
     * This will show beneficiary modal
     *
     * @param {*} urn
     * @memberof SettingIntegrationComponent
     */
    public showBeneficiaryModal(urn: any): void {
        this.activeUrn = urn;
        this.beneficiaryAsideState = "in";
    }

    /**
     * This will hide beneficiary modal
     *
     * @memberof SettingIntegrationComponent
     */
    public hideBeneficiaryModal(event?: any): void {
        this.activeUrn = '';
        this.beneficiaryAsideState = 'out'
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === ESCAPE) {
            this.hideBeneficiaryModal();
        }
    }

    /**
     * This will get the account registration status
     *
     * @param {*} account
     * @memberof SettingIntegrationComponent
     */
    public getRegistrationStatus(account: any): void {
        this.settingsIntegrationService.getRegistrationStatus(account.URN).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                account.registrationStatus = response?.body?.Status;
            } else {
                account.registrationStatus = "";
            }
        });
    }

    /**
     * Callback for user selected
     *
     * @param {*} event
     * @memberof SettingIntegrationComponent
     */
    public selectUser(event: any): void {
        if (event) {
            this.addBankForm.get('userNames')?.patchValue(event.map(ev => ev.label));
        }
    }

    /**
     * Selects the users
     *
     * @param {*} user Selected user
     * @param {*} event Select event
     * @param {*} userIndex Current user index in list
     * @memberof SettingIntegrationComponent
     */
    public selectUsers(user: any, event: any, userIndex): void {
        if (event && user) {
            if (event.target.checked) {
                user.isSelected = event.target.checked;
                this.usersList[userIndex].isSelected = true;
            } else {
                this.usersList[userIndex].isSelected = false;
            }
            this.addBankForm.get('userNames')?.patchValue(this.usersList.filter(ev => ev.isSelected && ev.label).map(user => user.label));
            this.addBankForm.get('emailIds')?.patchValue(this.usersList.filter(ev => ev.isSelected && ev.value).map(user => user.value));
        }
        event.stopPropagation();
    }

    public removeUser(user: any, isUpdate?: boolean): void {
        let i = 0;
        let matchedIndex = -1;

        for (i; i < this.usersList.length; i++) {
            if (user === this.usersList[i].value) {
                matchedIndex = i;
                break;
            }
        }

        let indx = -1;
        if (isUpdate) {
            indx = this.registeredAccount[this.isBankUpdateInEdit].selectedUsers.findIndex(selectedUser => selectedUser.value === user.value);
            this.registeredAccount[this.isBankUpdateInEdit].selectedUsers.splice(indx, 1);
        } else {
            indx = this.usersList.findIndex(selectedUser => selectedUser.value === user.value);
            this.usersList[indx].isSelected = false;
        }

        if (matchedIndex > -1) {
            this.usersList[matchedIndex].isSelected = false;
        }
    }

    public resetUserSelection(): void {
        this.usersList.forEach(user => user.isSelected = false);
    }

    public setUserSelection(): void {
        this.usersList.forEach(user => user.isSelected = this.registeredAccount[this.isBankUpdateInEdit].selectedUsers.some(selectedUser => selectedUser.value === user.value));
    }

    public getSelectedItemCount(items: Array<any>): number {
        return items?.filter(user => user.isSelected).length;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SettingIntegrationComponent
     */
    public translationComplete(event: any): void {
        if(event) {
            this.typeOTPList = [
                { label: this.localeData?.otp_types?.bank_otp, value: "BANK" },
                { label: this.localeData?.otp_types?.giddh_otp, value: "GIDDH" },
            ];

            this.amountUpToList = [
                { label: this.localeData?.amount_limit_types?.bank_limit, value: "max" },
                { label: this.localeData?.amount_limit_types?.custom, value: "custom" },
            ];
        }
    }
}
