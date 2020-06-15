import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
    UserAmountRangeRequests,
    IntegratedBankList,
} from '../../models/api-models/SettingsIntegraion';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { TabsetComponent, ModalDirective } from "ngx-bootstrap";
import { CompanyActions } from "../../actions/company.actions";
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { Configuration } from "../../app.constant";
import { GoogleLoginProvider, LinkedinLoginProvider } from "../../theme/ng-social-login-module/providers";
import { AuthenticationService } from "../../services/authentication.service";
import { IForceClear } from '../../models/api-models/Sales';
import { EcommerceService } from '../../services/ecommerce.service';
import { forIn } from '../../lodash-optimized';
import { GeneralService } from '../../services/general.service';
import { ShareRequestForm } from '../../models/api-models/Permission';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { elementStylingMap } from '@angular/core/src/render3';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';

export declare const gapi: any;

@Component({
    selector: 'setting-integration',
    templateUrl: './setting.integration.component.html',
    styleUrls: ['./setting.integration.component.scss']
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
    public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
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
    public integratedBankList: IntegratedBankList;
    /** Add bank form reference */
    public addBankForm: FormGroup;



    @Input() private selectedTabParent: number;
    @ViewChild('integrationTab') public integrationTab: TabsetComponent;
    @ViewChild('removegmailintegration') public removegmailintegration: ModalDirective;
    @ViewChild('paymentForm') paymentForm: NgForm;
    @ViewChild('paymentFormAccountName') paymentFormAccountName: ShSelectComponent;
    //variable holding account Info
    public registeredAccount;
    /** To check is registration form open*/
    public openNewRegistration: boolean;
    /**Selected bank integration form index for update  */
    public selecetdUpdateIndex: number;
    public isEcommerceShopifyUserVerified: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public typeOTPList: IOption[] =
        [
            { label: "Bank OTP", value: "BANK" },
            { label: "GIDDH OTP", value: "GIDDH" },
        ];
    public amountUpToList: IOption[] =
        [
            { label: "Max limit as per Bank", value: "max" },
            { label: "Custom", value: "custom" },
        ];
    public approvalNameList: IOption[] = [];
    public selectedCompanyUniqueName: string;
    public isCreateInvalid: boolean = false;
    /** Maximum amount length limit */
    public maxLimit: number = 8;
    /** Maximum amount limit */
    public maxAmountLimit: number;
    /** To check bank update form in edit mode */
    public isBankUpdateInEdit: number = null;


    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private accountService: AccountService,
        private ecommerceService: EcommerceService,
        private toasty: ToasterService,
        private _companyActions: CompanyActions,
        private _authenticationService: AuthenticationService,
        private _fb: FormBuilder,
        private _generalActions: GeneralActions,
        private settingsPermissionActions: SettingsPermissionActions,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private settingsIntegrationService: SettingsIntegrationService) {
        this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl(AppUrl)).replace(':client_id', this.getGoogleCredentials().GOOGLE_CLIENT_ID);
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
        this.setCurrentPageTitle();
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
                this.razorPayObj = _.cloneDeep(o.razorPayForm);
                this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
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
                this.amazonSellerForm.controls['sellers'].patchValue(this.amazonSellerRes);
                // this.amazonSellerForm.controls['sellers'].disable();
                this.addAmazonSellerRow();
            }
        });

        this.flattenAccountsStream$.subscribe(data => {
            if (data) {
                let accounts: IOption[] = [];
                let bankAccounts: IOption[] = [];
                _.forEach(data, (item) => {
                    accounts.push({ label: item.name, value: item.uniqueName });
                    let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts');
                    if (findBankIndx !== -1) {
                        bankAccounts.push({ label: item.name, value: item.uniqueName });
                    }
                });
                this.accounts$ = observableOf(accounts);
                this.bankAccounts$ = observableOf(bankAccounts);
            }
        });

        this.amazonSellerForm = this._fb.group({
            sellers: this._fb.array([
                this.initAmazonReseller()
            ])
        });

        this.isSellerAdded.subscribe(a => {
            if (a) {
                this.addAmazonSellerRow();
            }
        });

        this.isSellerUpdate.subscribe(a => {
            if (a) {
                this.amazonEditItemIdx = null;
                this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
            }
        });
        //logic to get all registered account for integration tab
        this.store.dispatch(this._companyActions.getAllRegistrations());

        this.store.pipe(select(p => p.company), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.account) {
                this.registeredAccount = o.account;
                if (this.registeredAccount && this.registeredAccount.length === 0) {
                    this.openNewRegistration = true;

                }
                if (this.registeredAccount && this.registeredAccount.length) {
                    this.registeredAccount.map(item => {
                        if (item && !item.userAmountRanges) {
                            item.userAmountRanges = [this.getBlankAmountRangeRow()]
                        }
                    });
                }
                if (this.registeredAccount) {
                    this.registeredAccount.map(item => {
                        item.userAmountRanges.map(element => {
                            if (typeof element.maxBankLimit === "boolean") {
                                element.maxBankLimit = element.maxBankLimit ? 'max' : 'custom';
                            }
                        });
                    });
                }
                this.addBankForm.reset();
            }
        });

        // this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
        //     if (res && !_.isEmpty(res)) {
        //         if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
        //             res.ecommerceDetails.forEach(item => {
        //                 if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
        //                     this.getShopifyVerifyStatus(item.uniqueName);
        //                 }
        //             })
        //         }
        //     }
        // });

        this.store.pipe(take(1)).subscribe(s => {
            this.selectedCompanyUniqueName = s.session.companyUniqueName;
            this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
            this.getValidationForm('ICICI')
        });
        this.store.pipe(select(stores => stores.settings.usersWithCompanyPermissions), take(2)).subscribe(resp => {
            if (resp) {
                let data = _.cloneDeep(resp);
                let sortedArr = _.groupBy(this.prepareDataForUI(data), 'emailId');
                let arr: IOption[] = [];
                forIn(sortedArr, (value) => {
                    if (value[0].emailId === this.loggedInUserEmail) {
                        value[0].isLoggedInUser = true;
                    }
                    // arr.push({ name: value[0].userName, rows: value });
                    arr.push({ label: value[0].userName, value: value[0].userUniqueName, additional: value });
                });
                this.approvalNameList = _.sortBy(arr, ['label']);
            }
        });
    }

    public ngAfterViewInit() {
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }
    }

    public getInitialData() {
        this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
        this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
        this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
        this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
    }

    public setDummyData() {
        this.razorPayObj.userName = '';
        this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.razorPayObj.account = { name: null, uniqueName: null };
        this.razorPayObj.autoCapturePayment = true;
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
        if (fomValue.valid) {
            let requestObject = _.cloneDeep(fomValue.value)
            requestObject.userAmountRanges.map(element => {
                element.maxBankLimit = (element.maxBankLimit === 'max') ? 'true' : 'false';
            });

            this.store.dispatch(this.settingsIntegrationActions.SavePaymentInfo(requestObject));
            // this.clearForm();s
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
            this.toasty.warningToast('You don\'t have any account linked with Razorpay.');
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
                control.controls[i].patchValue(item);
                if (control.controls[i].value.sellerId) {
                    control.controls[i].disable();
                }
            } else {
                control.push(this.initAmazonReseller());
                setTimeout(() => {
                    control.controls[i].patchValue(item);
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
        this.integrationTab.tabs[id].active = true;
    }

    public openNewRegistartionForm() {
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
        let registeredAccountObj = _.cloneDeep(regAcc);
        registeredAccountObj.userAmountRanges.map(item => {
            item.maxBankLimit = item.maxBankLimit === "max" ? 'true' : 'false';
        });
        let requestData = {
            URN: registeredAccountObj.URN,
            accountUniqueName: registeredAccountObj.account.uniqueName,
            userAmountRanges: registeredAccountObj.userAmountRanges
        }
        this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentInfo(requestData));
        this.paymentFormObj = new PaymentClass();
    }

    public setCurrentPageTitle() {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Settings > Integration";
        currentPageObj.url = this.router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    /**
     * API call to get know about ecommerce platform shopify connected or not
     *
     * @param {string} ecommerceUniqueName ecommerce unique name for shopify
     * @memberof SettingIntegrationComponent
     */
    public getShopifyVerifyStatus(ecommerceUniqueName: string): void {
        const requestObj = { source: "shopify" };
        this.ecommerceService.isShopifyConnected(requestObj, ecommerceUniqueName).subscribe(response => {
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
                const t = ipcRenderer.send("authenticate", provider);
                ipcRenderer.once('take-your-gmail-token', (sender, arg: any) => {
                    // this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
                    const dataToSave = {
                        "access_token": arg.access_token,
                        "expires_in": arg.expiry_date,
                        "refresh_token": arg.refresh_token
                    };
                    this._authenticationService.saveGmailToken(dataToSave).subscribe((res) => {

                        if (res.status === 'success') {
                            this.toasty.successToast('Gmail account added successfully.', 'Success');
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
    public selectedMaxOrCustom(index: number, isUpdate: boolean, parentIndex?: number, ): void {
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
            userAmountRanges.controls[index].get('amount').patchValue(null);
            if (event.value === 'max') {
                userAmountRanges.controls[index].get('amount').patchValue(null);
                userAmountRanges.controls[index].get('amount').clearValidators();
                userAmountRanges.controls[index].get('amount').reset();
                if (this.checkIsMaxBankLimitSelectedField(userAmountRanges, index)) {
                    userAmountRanges.controls[index].get('maxBankLimit').patchValue('custom');
                    userAmountRanges.controls[index].get('amount').patchValue(null);
                    userAmountRanges.controls[index].get('amount').setErrors({ 'incorrect': true });
                    userAmountRanges.controls[index].get('amount').setValidators(Validators.compose([Validators.required, Validators.maxLength(this.maxLimit)]));
                    this.toasty.infoToast('You can not select max bank limit more than 1');
                }
            } else {
                userAmountRanges.controls[index].get('amount').setValidators(Validators.compose([Validators.required, Validators.maxLength(this.maxLimit)]));
                userAmountRanges.controls[index].get('amount').patchValue(null);
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
public maxLimitOrCustomChanged(event: any, index: number, isUpdate: boolean, parentIndex?: number, ): void {
        if (!isUpdate) {
            if (event === 'max' && this.checkIsMaxBankLimitSelected(this.paymentFormObj.userAmountRanges, index)) {
                this.paymentFormObj.userAmountRanges[index].maxBankLimit = "custom";
                this.paymentFormObj.userAmountRanges[index].amount = null;
                this.toasty.infoToast('You can not select max bank limit more than 1');
            } else {
                this.paymentFormObj.userAmountRanges[index].amount = null;
            }
        } else {
            if (event === 'max' && this.checkIsMaxBankLimitSelected(this.registeredAccount[parentIndex].userAmountRanges, index)) {
                this.registeredAccount[parentIndex].userAmountRanges[index].maxBankLimit = "custom";
                this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
                this.toasty.infoToast('You can not select max bank limit more than 1');
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
            } else {
                elementRef.classList.remove('error-box');
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
    public checkIsAmountRepeat(itemList: any[], value: any, index: number): boolean {

        let selected: boolean = false;
        if (itemList) {
            selected = itemList.some((item, indx) => {
                if (index !== indx && item.amount && value) {
                    return item.amount === value;
                }
            }
            );
        }
        this.isCreateInvalid = selected;
        return selected;
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
                this.toasty.infoToast('At least 1 row is required');
            }

        }
        if (item && indexUpdateList) {
            if (this.registeredAccount[indexUpdateList - 1].userAmountRanges.length > 1) {
                let itemIndxOfUpdate = this.registeredAccount[indexUpdateList - 1].userAmountRanges.findIndex((element) => element === item);
                if (itemIndxOfUpdate > -1) {
                    this.registeredAccount[indexUpdateList - 1].userAmountRanges.splice(itemIndxOfUpdate, 1);
                }
            } else {
                this.toasty.infoToast('At least 1 row is required');
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
            transactions.controls[index].get('approvalUniqueName').patchValue(null)
        } else if (event && this.registeredAccount && this.registeredAccount[parentIndex].userAmountRanges && isUpdate) {
            this.registeredAccount[parentIndex].userAmountRanges[index].approvalUniqueName = null;
            this.registeredAccount[parentIndex].userAmountRanges[index].approvalDetails = null;
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
            this.settingsIntegrationService.getValidationFormForBank(this.selectedCompanyUniqueName, bankType).subscribe(response => {
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
            corpId: [null, Validators.compose([Validators.required])],
            userId: [null, Validators.compose([Validators.required])],
            accountNo: [null, Validators.compose([Validators.required])],
            aliasId: [null, Validators.compose([])],
            accountUniqueName: [null, Validators.compose([Validators.required])],
            userAmountRanges: this._fb.array([
                this._fb.group({
                    maxBankLimit: ['max', Validators.compose([Validators.required])],
                    otpType: ['BANK', Validators.compose([Validators.required])],
                    amount: [''],
                    approvalUniqueName: [''],
                })
            ]),
        });
    }

    /**
     * To initialize user amout range of bank integration form
     *
     * @returns {FormGroup}
     * @memberof SettingIntegrationComponent
     */
    public initialUserAmountRangesForm(): FormGroup {
        let transactionsFields = this._fb.group({
            maxBankLimit: ['custom', Validators.compose([Validators.required])],
            otpType: ['', Validators.compose([Validators.required])],
            amount: [''],
            approvalUniqueName: [''],
        });
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
            this.toasty.infoToast('At least 1 row is required');
        }

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
    public preventZero(amount: number, index: number, parentIndex?: number, isUpdate?: boolean): void {
        if (Number(amount) <= 0 && !isUpdate) {
            const transactions = this.addBankForm.get('userAmountRanges') as FormArray;
            transactions.controls[index].get('amount').patchValue(null);
        }
        if (isUpdate && Number(amount) <= 0) {
            this.registeredAccount[parentIndex].userAmountRanges[index].amount = null;
        }
    }

    /**
     *Edit bank integration form
     *
     * @param {*} index
     * @memberof SettingIntegrationComponent
     */
    public editRegisterForm(index: any): void {
        this.isBankUpdateInEdit = index;
    }
}
