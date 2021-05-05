import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { CompanyCashFreeSettings, CompanyEmailSettings, EstimateSettings, InvoiceSetting, InvoiceSettings, InvoiceWebhooks, ProformaSettings } from '../../models/interfaces/invoice.setting.interface';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ToasterService } from '../../services/toaster.service';
import { RazorPayDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { IOption } from '../../theme/ng-select/option.interface';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonActions } from '../../actions/common.actions';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';

@Component({
    selector: 'app-invoice-setting',
    templateUrl: './invoice.settings.component.html',
    styleUrls: ['./invoice.setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceSettingComponent implements OnInit, OnDestroy {

    public invoiceSetting: InvoiceSettings = new InvoiceSettings();
    public proformaSetting: ProformaSettings = new ProformaSettings();
    public estimateSetting: EstimateSettings = new EstimateSettings();
    public webhooks: InvoiceWebhooks[];
    public invoiceWebhook: InvoiceWebhooks[];
    public estimateWebhook: InvoiceWebhooks[];
    public invoiceLastState: InvoiceSettings;
    public webhookLastState: InvoiceWebhooks[];
    public webhookIsValidate: boolean = false;
    public settingResponse: any;
    public formToSave: any;
    public proformaWebhook: InvoiceWebhooks[];
    public getRazorPayDetailResponse: boolean = false;
    public razorpayObj: RazorPayDetailsResponse = new RazorPayDetailsResponse();
    public companyEmailSettings: CompanyEmailSettings = new CompanyEmailSettings();
    public updateRazor: boolean = false;
    public accountList: any;
    public accountToSend: any = {};
    public linkAccountDropDown: IOption[] = [];
    public originalEmail: string;
    public isEmailChanged: boolean = false;
    public webhookMock: any = {
        url: '',
        triggerAt: '',
        entity: 'invoice'
    };
    public showDatePicker: boolean = false;
    public moment = moment;
    public isAutoPaidOn: boolean;
    public companyCashFreeSettings: CompanyCashFreeSettings = new CompanyCashFreeSettings();
    public paymentGatewayList: IOption[] = [];
    public isLockDateSet: boolean = false;
    public lockDate: Date = new Date();
    public isGmailIntegrated: boolean;
    public gmailAuthCodeUrl$: Observable<string> = null;
    /** True, if Gmail integration is to be displayed (TODO: Should be removed once URIs become secured) */
    shouldShowGmailIntegration: boolean;
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the active company information */
    public activeCompany$: Observable<any> = null;
    /** Stores the form fields of onboard form API, required for GST validation in E-Invoice */
    public formFields: any[] = [];

    constructor(
        private commonActions: CommonActions,
        private cdr: ChangeDetectorRef,
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _toasty: ToasterService, private settingsIntegrationActions: SettingsIntegrationActions,
        private _authenticationService: AuthenticationService,
        public _route: ActivatedRoute,
        private router: Router,
        private generalService: GeneralService
    ) {
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl(AppUrl)).replace(':client_id', this.getGoogleCredentials().GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
    }

    public ngOnInit() {
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
        this.activeCompany$ = this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.settings.isGmailIntegrated), takeUntil(this.destroyed$)).subscribe(result => {
            this.isGmailIntegrated = result;
        });
        this.initSettingObj();

        this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.code) {
                this.saveGmailAuthCode(val.code);
            }
        });

        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
            } else {
                let companyCountry;
                this.activeCompany$.pipe(take(1)).subscribe((response: any) => {
                    companyCountry = response.countryV2?.alpha2CountryCode;
                });
                if (companyCountry === 'IN') {
                    const requestObject = {
                        formName: 'onboarding',
                        country: companyCountry
                    };
                    this.store.dispatch(this.commonActions.GetOnboardingForm(requestObject));
                }
            }
        });
    }

    public initSettingObj() {
        this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$)).subscribe((setting: InvoiceSetting) => {
            if (setting && setting.invoiceSettings && setting.webhooks) {
                this.originalEmail = _.cloneDeep(setting.invoiceSettings.email);

                this.settingResponse = setting;
                this.estimateSetting = _.cloneDeep(setting.estimateSettings);
                this.invoiceSetting = _.cloneDeep(setting.invoiceSettings);
                this.proformaSetting = _.cloneDeep(setting.proformaSettings);
                this.invoiceSetting.autoPaid = this.invoiceSetting.autoPaid === 'runtime';

                // using last state to compare data before dispatching action
                this.invoiceLastState = _.cloneDeep(setting.invoiceSettings);
                this.webhookLastState = _.cloneDeep(setting.webhooks);

                let webhookArray = _.cloneDeep(setting.webhooks);

                // using filter to get webhooks for 'invoice' only
                this.invoiceWebhook = webhookArray.filter((obj) => obj.entity === 'invoice');
                this.invoiceWebhook.push(_.cloneDeep(this.webhookMock));


                this.estimateWebhook = webhookArray.filter((obj) => obj.entity === 'estimate');
                this.estimateWebhook.push(_.cloneDeep(this.webhookMock));


                this.proformaWebhook = webhookArray.filter((obj) => obj.entity === 'proforma');
                this.proformaWebhook.push(_.cloneDeep(this.webhookMock));


                if (webhookArray.length > 0) {
                    this.webhooks = webhookArray;
                } else {
                    // adding blank webhook row on load
                    this.webhooks = [_.cloneDeep(this.webhookMock)];
                }


                if (setting.razorPayform && !_.isEmpty(setting.razorPayform)) {
                    this.razorpayObj = _.cloneDeep(setting.razorPayform);
                    this.razorpayObj.password = 'YOU_ARE_NOT_ALLOWED';
                    this.updateRazor = true;
                    // this.razorpayObj.account.name = _.cloneDeep(setting.razorPayform.account.uniqueName) || '';
                } else {
                    this.updateRazor = false;
                }

                if (this.invoiceSetting.createPaymentEntry && !this.getRazorPayDetailResponse) {
                    this.store.dispatch(this.invoiceActions.getRazorPayDetail());
                    this.getRazorPayDetailResponse = true;
                }

                if (setting.companyEmailSettings) {
                    this.companyEmailSettings.sendThroughGmail = _.cloneDeep(setting.companyEmailSettings.sendThroughGmail);
                } else {
                    this.companyEmailSettings.sendThroughGmail = false;
                }

                if (this.invoiceSetting.lockDate) {
                    this.isLockDateSet = true;
                    this.lockDate = moment(this.invoiceSetting.lockDate, GIDDH_DATE_FORMAT).toDate();
                } else {
                    this.isLockDateSet = false;
                }
                this.companyCashFreeSettings = _.cloneDeep(setting.companyCashFreeSettings);
                this.cdr.detectChanges();
            } else if (!setting || !setting.webhooks) {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            }
        });
    }

    public onChangeSendInvoiceViaSms(isChecked) {
        if (!isChecked) {
            this.invoiceSetting.smsContent = '';
        }
    }

    /**
     * Add New Webhook
     */
    public addNewWebhook(webhook, entityType?: string) {
        webhook['entity'] = entityType;
        let objToSave = _.cloneDeep(webhook);
        if (!objToSave.url || !objToSave.triggerAt) {
            this._toasty.warningToast(this.localeData?.webhook_required_error);
            return false;
        } else if (objToSave.url && objToSave.triggerAt) {
            this.validateWebhook(objToSave);
            if (this.webhookIsValidate) {
                this.saveWebhook(objToSave);
            }
        }
    }

    /**
     * Save Webhook
     */
    public saveWebhook(webhook) {
        this.store.dispatch(this.invoiceActions.saveInvoiceWebhook(webhook));
    }

    /**
     * Delete Webhook
     */
    public deleteWebhook(webhook, index) {
        if (webhook.uniqueName) {
            this.store.dispatch(this.invoiceActions.deleteWebhook(webhook.uniqueName));
            this.initSettingObj();
        } else {
            this.webhooks.splice(index, 1);
        }
    }

    /**
     * Update Form
     */
    public UpdateForm(form = null) {

        let razorpayObj: RazorPayDetailsResponse = _.cloneDeep(this.settingResponse.razorPayform) || new RazorPayDetailsResponse();
        // check whether form is updated or not
        // if (!_.isEqual(form, this.invoiceLastState)) {
        // if (!_.isEqual(form, this.invoiceLastState)) {

        if (this.webhooks && this.webhooks.length > 0 && !this.webhooks[this.webhooks.length - 1].url && !this.webhooks[this.webhooks.length - 1].triggerAt) {
            this.webhooks.splice(this.webhooks.length - 1);
        }
        // perform operation to update 'invoice' webhooks
        this.mergeWebhooks(this.webhooks);

        this.formToSave = _.cloneDeep(this.settingResponse);
        this.formToSave.invoiceSettings = _.cloneDeep(this.invoiceSetting);
        this.formToSave.estimateSettings = _.cloneDeep(this.estimateSetting);
        this.formToSave.proformaSettings = _.cloneDeep(this.proformaSetting);
        this.formToSave.webhooks = _.cloneDeep(this.webhooks);
        this.formToSave.companyEmailSettings = {
            sendThroughGmail: _.cloneDeep(this.companyEmailSettings.sendThroughGmail) ? _.cloneDeep(this.companyEmailSettings.sendThroughGmail) : false,
            sendThroughSendgrid: false
        };
        delete this.formToSave.sendThroughGmail;
        delete this.formToSave.razorPayform; // delete razorPay before sending form
        if (this.formToSave.invoiceSettings.lockDate instanceof Date) {
            this.formToSave.invoiceSettings.lockDate = moment(this.formToSave.invoiceSettings.lockDate).format(GIDDH_DATE_FORMAT);
        }
        if (this.formToSave?.invoiceSettings?.gstEInvoiceEnable) {
            const invoiceSettings = this.formToSave.invoiceSettings;
            if (!invoiceSettings.gstEInvoiceUserName || !invoiceSettings.gstEInvoiceUserPassword || !invoiceSettings.gstEInvoiceGstin) {
                this._toasty.errorToast(this.localeData?.e_invoice_fields_required_error_message);
                return;
            }
            if (this.formFields['taxName'] && this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                let isValid = false;
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(invoiceSettings.gstEInvoiceGstin)) {
                        isValid = true;
                    }
                }
                if (!isValid) {
                    this._toasty.errorToast(this.localeData?.e_invoice_invalid_gstin_error_message);
                    return;
                }
            }
        }

        if (this.formToSave.invoiceSettings.autoPaid) {
            this.formToSave.invoiceSettings.autoPaid = 'runtime';
        } else {
            this.formToSave.invoiceSettings.autoPaid = 'never';
        }

        this.formToSave.companyCashFreeSettings = _.cloneDeep(this.companyCashFreeSettings);
        this.store.dispatch(this.invoiceActions.updateInvoiceSetting(this.formToSave));
        // }

        if (!_.isEqual(this.razorpayObj, razorpayObj) && form && form.createPaymentEntry) {
            this.saveRazorPay(this.razorpayObj, form);
        }
    }

    /**
     * Update RazorPay
     */

    public saveRazorPay(razorForm, form) {
        this.razorpayObj.account = _.cloneDeep(this.accountToSend);
        this.razorpayObj.autoCapturePayment = true;
        this.razorpayObj.companyName = '';
        if (form.createPaymentEntry && (!this.razorpayObj.userName || !this.razorpayObj.account)) {
            this._toasty.warningToast(this.localeData?.razorpay_error);
            return false;
        }
        let razorpayObj = _.cloneDeep(this.razorpayObj);
        if (this.updateRazor) {
            delete razorpayObj.password;
            this.store.dispatch(this.invoiceActions.updateRazorPayDetail(razorpayObj));
        } else {
            this.store.dispatch(this.invoiceActions.SaveRazorPayDetail(razorpayObj));
        }
    }

    /**
     * Merge Webhook before saving Form
     */
    public mergeWebhooks(webhooks) {
        let _webhooks = _.cloneDeep(webhooks);
        this.webhooks = _.concat(_webhooks, this.proformaWebhook, this.invoiceWebhook, this.estimateWebhook);
    }

    /**
     * Reset Form
     */
    public resetForm() {
        // this.invoiceSetting = this.invoiceLastState;
        this.initSettingObj();
    }

    /**
     * validate Webhook URL
     */
    public validateWebhook(webhook) {
        let url = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,5}[.]{0,1}/;
        if (!url.test(webhook.url)) {
            this._toasty.warningToast(this.localeData?.invalid_webhook_url);
        } else {
            this.webhookIsValidate = true;
        }
    }

    /**
     * Delete razor-pay detail
     */
    public deleteRazorPay() {
        this.store.dispatch(this.invoiceActions.deleteRazorPayDetail());
        this.updateRazor = false;
    }

    /**
     * select account to link with razorpay
     */
    public selectLinkAccount(data) {
        let arrOfAcc = _.cloneDeep(this.accountList);
        if (data.value) {
            let result = arrOfAcc.filter((obj) => obj.uniqueName === data.value);
            this.accountToSend.name = result[0].name;
            this.accountToSend.uniqueName = result[0].uniqueName;
        }
    }

    /**
     * verfiy Email
     */
    public verfiyEmail(emailId) {
        let email = new RegExp(/[a-z0-9!#$%&'*+=?^_{|}~-]+(?:.[a-z0-9!#$%&’*+=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email.test(emailId)) {
            this.store.dispatch(this.invoiceActions.updateInvoiceEmail(emailId));
        } else {
            this._toasty.warningToast(this.localeData?.invalid_email);
            return false;
        }
    }

    /**
     * delete Email
     */
    public deleteEmail(emailId) {
        if (!emailId) {
            return false;
        } else {
            let emailTodelete = _.cloneDeep(emailId);
            emailTodelete = null;
            this.store.dispatch(this.invoiceActions.deleteInvoiceEmail(emailTodelete));
        }
    }

    /**
     * checkDueDays
     */
    public checkDueDays(value: number, indx: number, flag: string) {
        if (indx !== null) {
            if (indx > -1 && value > 90 && flag === 'length') {
                let webhooks = _.cloneDeep(this.webhooks);
                webhooks[indx].triggerAt = 90;
                this.webhooks = webhooks;
            }
            if (indx > -1 && isNaN(value) && flag === 'alpha') {
                let webhooks = _.cloneDeep(this.webhooks);
                webhooks[indx].triggerAt = Number(String(webhooks[indx].triggerAt).replace(/\D/g, '')) !== 0 ? Number(String(webhooks[indx].triggerAt).replace(/\D/g, '')) : null;
                this.webhooks = webhooks;
            }
        }
    }

    /**
     * onChangeEmail
     */
    public onChangeEmail(email: string) {
        this.isEmailChanged = email !== this.originalEmail;
    }

    /**
     * validateDefaultDueDate
     */
    public validateDefaultDueDate(defaultDueDate: string) {
        if (defaultDueDate) {
            let invoiceSetting = _.cloneDeep(this.invoiceSetting);
            if (isNaN(Number(defaultDueDate)) && defaultDueDate.indexOf('-') === -1) {
                invoiceSetting.duePeriod = Number(defaultDueDate.replace(/\D/g, '')) !== 0 && !isNaN(Number(defaultDueDate.replace(/\D/g, ''))) ? Number(defaultDueDate.replace(/\D/g, '')) : null;
                setTimeout(() => {
                    this.invoiceSetting = invoiceSetting;
                });
            }
            if (defaultDueDate.indexOf('-') !== -1 && (defaultDueDate.indexOf('-') !== defaultDueDate.lastIndexOf('-')) || defaultDueDate.indexOf('-') > 0) {
                invoiceSetting.duePeriod = Number(defaultDueDate.replace(/\D/g, ''));
                setTimeout(() => {
                    this.invoiceSetting = invoiceSetting;
                });
            }
            if (String(defaultDueDate).length > 3) {
                if (defaultDueDate.indexOf('-') !== -1) {
                    invoiceSetting.duePeriod = Number(String(defaultDueDate).substring(0, 4));
                } else {
                    invoiceSetting.duePeriod = Number(String(defaultDueDate).substring(0, 3));
                }
                setTimeout(() => {
                    this.invoiceSetting = invoiceSetting;
                });
            }
        }
    }

    /**
     * setInvoiceLockDate
     */
    public setInvoiceLockDate(date) {
        this.invoiceSetting.lockDate = moment(date).format(GIDDH_DATE_FORMAT);
        this.showDatePicker = !this.showDatePicker;
    }

    public onLockDateBlur(ev) {
        this.isLockDateSet = !!ev.target.value;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    private saveGmailAuthCode(authCode: string) {
        const dataToSave = {
            code: authCode,
            client_secret: this.getGoogleCredentials().GOOGLE_CLIENT_SECRET,
            client_id: this.getGoogleCredentials().GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl(AppUrl)
        };
        this._authenticationService.saveGmailAuthCode(dataToSave).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.status === 'success') {
                this._toasty.successToast(this.localeData?.gmail_account_added, 'Success');
            } else {
                this._toasty.errorToast(res.message, res.code);
            }
            this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
            this.router.navigateByUrl('/pages/invoice/preview/settings/email');
        });
    }
    private getRedirectUrl(baseHref: string) {
        if (TEST_ENV) {
            return `${baseHref}pages/invoice/preview/sales?tab=settings&tabIndex=4`;
        } else if (PRODUCTION_ENV || STAGING_ENV || LOCAL_ENV) {
            /* All the above URIs are not secured and Google has blocked
              addition of unsecured URIs therefore show Gmail integration text only
              for PROD. This flag need to be removed once all the above URIs become secure */
            this.shouldShowGmailIntegration = true; // TODO: Remove flag after above URIs are secured
            return `${baseHref}pages/invoice/preview/settings`;
        }
    }

    private getGoogleCredentials() {
        if (PRODUCTION_ENV || isElectron || isCordova) {
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

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof InvoiceSettingComponent
     */
    public translationComplete(event: any): void {
        if(event) {
            this.paymentGatewayList = [
                { value: 'razorpay', label: this.localeData?.razorpay },
                { value: 'cashfree', label: this.localeData?.cashfree }
            ];
        }
    }

    /**
     * Handler for E-invoice authentication change
     *
     * @param {*} event Checkbox (ngModelChange) event
     * @memberof InvoiceSettingComponent
     */
    public handleEInvoiceChange(event: any): void {
        if (!event) {
            // E-Invoice unchecked reset the credentials
            this.invoiceSetting.gstEInvoiceGstin = '';
            this.invoiceSetting.gstEInvoiceUserName = '';
            this.invoiceSetting.gstEInvoiceUserPassword = '';
        } else {
            this.fetchCompanyGstDetails();
        }
    }

    /**
     * Auto-fills the GST number field for E-invoice
     *
     * @private
     * @memberof InvoiceSettingComponent
     */
    private fetchCompanyGstDetails(): void {
        let branches = [];
        let currentBranch;
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            if (response && response.length) {
                branches = response;

                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    currentBranch = branches.find(branch => branch.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    currentBranch =  branches.find(branch => !branch.parentBranch);
                }
                if (currentBranch && currentBranch.addresses) {
                    const defaultAddress = currentBranch.addresses.find(address => (address && address.isDefault));
                    if(defaultAddress) {
                        this.invoiceSetting.gstEInvoiceGstin = defaultAddress.taxNumber;
                    }
                }
            }
        });
    }
}
