import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
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
    SmsKeyClass
} from '../../models/api-models/SettingsIntegraion';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { TabsetComponent, ModalDirective } from "ngx-bootstrap";
import { CompanyActions } from "../../actions/company.actions";
import { IRegistration } from "../../models/interfaces/registration.interface";
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { Configuration } from "../../app.constant";
import { GoogleLoginProvider, LinkedinLoginProvider } from "../../theme/ng-social-login-module/providers";
import { AuthenticationService } from "../../services/authentication.service";
import { IForceClear } from '../../models/api-models/Sales';
import { EcommerceService } from '../../services/ecommerce.service';

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

    @Input() private selectedTabParent: number;
    @ViewChild('integrationTab') public integrationTab: TabsetComponent;
    @ViewChild('removegmailintegration') public removegmailintegration: ModalDirective;
    @ViewChild('paymentForm') paymentForm: NgForm;
    @ViewChild('paymentFormAccountName') paymentFormAccountName: ShSelectComponent;
    //variable holding account Info
    public registeredAccount;
    public openNewRegistration: boolean;
    public selecetdUpdateIndex: number;
    public isEcommerceShopifyUserVerified: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });

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
        private _generalActions: GeneralActions) {
        this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl(AppUrl)).replace(':client_id', this.getGoogleCredentials().GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
        this.isSellerAdded = this.store.pipe(select(s => s.settings.amazonState.isSellerSuccess), takeUntil(this.destroyed$));
        this.isSellerUpdate = this.store.pipe(select(s => s.settings.amazonState.isSellerUpdated), takeUntil(this.destroyed$));
        this.isGmailIntegrated$ = this.store.pipe(select(s => s.settings.isGmailIntegrated), takeUntil(this.destroyed$));
        this.isPaymentAdditionSuccess$ = this.store.pipe(select(s => s.settings.isPaymentAdditionSuccess), takeUntil(this.destroyed$));
        this.isPaymentUpdationSuccess$ = this.store.pipe(select(s => s.settings.isPaymentUpdationSuccess), takeUntil(this.destroyed$));
        this.setCurrentPageTitle();
    }

    public ngOnInit() {
        //logic to switch to payment tab if coming from vedor tabs add payment
        if (this.selectedTabParent !== undefined && this.selectedTabParent !== null) {
            this.selectTab(this.selectedTabParent);
        }
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
                this.bankAccounts$ = observableOf(accounts);
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
            }
        });

        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !_.isEmpty(res)) {
                if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
                    res.ecommerceDetails.forEach(item => {
                        if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
                            this.getShopifyEcommerceVerifyStatus(item.uniqueName);
                        }
                    })
                }
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

    public onSubmitPaymentform(f: NgForm) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SavePaymentInfo(f.value));
            this.paymentFormObj = new PaymentClass();
            this.paymentFormObj.corpId = "";
            this.paymentFormObj.userId = "";
            this.paymentFormObj.accountNo = "";
            this.paymentFormObj.aliasId = "";
            this.paymentFormObj.accountUniqueName = "";
            this.forceClear$ = observableOf({ status: true });
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
        if (PRODUCTION_ENV) {
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

    public deRegisterForm(regAcc: IRegistration) {
        this.store.dispatch(this.settingsIntegrationActions.RemovePaymentInfo(regAcc.iciciCorporateDetails.URN));
    }

    public updateICICDetails(regAcc: IRegistration, index) {
        this.selecetdUpdateIndex = index;
        let requestData = {
            URN: regAcc.iciciCorporateDetails.URN,
            accountUniqueName: regAcc.account.uniqueName
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
    public getShopifyEcommerceVerifyStatus(ecommerceUniqueName: string): void {
        const requestObj = { source: "shopify" };
        this.ecommerceService.getShopifyEcommerceVerify(requestObj, ecommerceUniqueName).subscribe(response => {
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
}
