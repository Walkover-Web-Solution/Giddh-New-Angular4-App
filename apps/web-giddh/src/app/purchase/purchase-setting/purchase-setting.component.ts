import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import * as dayjs from 'dayjs';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { BootstrapToggleSwitch } from '../../app.constant';
import { AuthenticationService } from '../../services/authentication.service';
import { InvoiceService } from '../../services/invoice.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { AppState } from '../../store';
import { TemplateFroalaComponent } from '../../shared/template-froala/template-froala.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'purchase-setting',
    templateUrl: './purchase-setting.component.html',
    styleUrls: ['./purchase-setting.component.scss']
})

export class PurchaseSettingComponent implements OnInit, OnDestroy {
    /* This will hold the invoice settings */
    public invoiceSettings: any = { purchaseBillSettings: { sendThroughGmail: false, changePOStatusOnExpiry: false, useCustomPONumber: false, enableNarration: false, enableVoucherDownload: false }, invoiceSettings: { purchaseRoundOff: false, generateAutoPurchaseNumber: false } };
    /* This will hold the PB lock date */
    public lockDate: Date = new Date();
    /* This will hold if email updated */
    public isEmailChanged: boolean = false;
    /* This will hold the original email*/
    public originalEmail: string;
    /* This will hold if gmail is integrated */
    public isGmailIntegrated: boolean;
    /* Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
    /* This will hold company uniquename */
    public companyUniqueName: any;
    /* Observable for gmail auth code url */
    public gmailAuthCodeUrl$: Observable<string> = null;
    /* This holds gmail auth code url */
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;

    constructor(private store: Store<AppState>, private dialog: MatDialog, private toaster: ToasterService, private settingsIntegrationActions: SettingsIntegrationActions, private invoiceService: InvoiceService, public purchaseOrderService: PurchaseOrderService, private generalService: GeneralService, public authenticationService: AuthenticationService, private route: ActivatedRoute) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));

        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl?.replace(':redirect_url', this.getRedirectUrl())?.replace(':client_id', GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseSettingComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.activeCompanyUniqueName$.subscribe(response => {
            this.companyUniqueName = response;
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.code) {
                this.saveGmailAuthCode(val.code);
            }
        });

        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
        this.initSettings();
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseSettingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This initializes the settings
     *
     * @memberof PurchaseSettingComponent
     */
    public initSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.invoiceSettings = _.cloneDeep(response.body);

                if (!this.invoiceSettings.purchaseBillSettings.enableVoucherDownload) {
                    this.invoiceSettings.purchaseBillSettings.enableVoucherDownload = false;
                }

                if (!this.invoiceSettings.invoiceSettings.purchaseRoundOff) {
                    this.invoiceSettings.invoiceSettings.purchaseRoundOff = false;
                }

                if (!this.invoiceSettings.invoiceSettings.generateAutoPurchaseNumber) {
                    this.invoiceSettings.invoiceSettings.generateAutoPurchaseNumber = false;
                }

                this.originalEmail = _.cloneDeep(this.invoiceSettings.purchaseBillSettings.email);

                if (this.invoiceSettings.purchaseBillSettings.lockDate) {
                    this.lockDate = dayjs(this.invoiceSettings.purchaseBillSettings.lockDate, GIDDH_DATE_FORMAT).toDate();
                }
            }
        });

        this.store.pipe(select(state => state.settings.isGmailIntegrated), takeUntil(this.destroyed$)).subscribe(result => {
            this.isGmailIntegrated = result;
        });
    }

    /**
     * This will reset the form with default settings
     *
     * @memberof PurchaseSettingComponent
     */
    public resetForm(): void {
        this.initSettings();
    }

    /**
     * This will update the form settings
     *
     * @memberof PurchaseSettingComponent
     */
    public updateForm(): void {
        let formToSave = _.cloneDeep(this.invoiceSettings);

        if (formToSave.purchaseBillSettings.lockDate instanceof Date) {
            formToSave.purchaseBillSettings.lockDate = dayjs(formToSave.purchaseBillSettings.lockDate).format(GIDDH_DATE_FORMAT);
        }

        this.invoiceService.UpdateInvoiceSetting(formToSave).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.toaster.successToast(response.body);
            } else {
                this.toaster.errorToast(response.message);
            }
        });
    }

    /**
     * This will verify the email and will save the email
     *
     * @param {*} emailId
     * @returns {boolean}
     * @memberof PurchaseSettingComponent
     */
    public verifyEmail(emailId: any): boolean {
        let email = new RegExp(/[a-z0-9!#$%&'*+=?^_{|}~-]+(?:.[a-z0-9!#$%&’*+=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email.test(emailId)) {
            this.updateSettingsEmail(emailId);
            return true;
        } else {
            this.toaster.warningToast(this.localeData?.invalid_email);
            return false;
        }
    }

    /**
     * This will delete the email
     *
     * @param {*} emailId
     * @returns {boolean}
     * @memberof PurchaseSettingComponent
     */
    public deleteEmail(emailId: any): boolean {
        if (!emailId) {
            return false;
        } else {
            this.updateSettingsEmail(null);
            return true;
        }
    }

    /**
     * This will update the variable to hold if email changed
     *
     * @param {string} email
     * @memberof PurchaseSettingComponent
     */
    public onChangeEmail(email: string): void {
        this.isEmailChanged = email !== this.originalEmail;
    }

    /**
     * This will update the settings email
     *
     * @param {*} emailAddress
     * @memberof PurchaseSettingComponent
     */
    public updateSettingsEmail(emailAddress: any): void {
        let getRequestObject = {
            companyUniqueName: this.companyUniqueName
        };

        let postRequestObject = {
            emailAddress: emailAddress
        };

        this.purchaseOrderService.updateSettingsEmail(getRequestObject, postRequestObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.initSettings();
                this.toaster.successToast(response.body);
            } else {
                this.toaster.errorToast(response.message);
            }
        });
    }

    /**
     * This will update the gmail integration
     *
     * @private
     * @param {string} authCode
     * @memberof PurchaseSettingComponent
     */
    private saveGmailAuthCode(authCode: string): void {
        const dataToSave = {
            code: authCode,
            client_secret: GOOGLE_CLIENT_SECRET,
            client_id: GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl()
        };

        this.authenticationService.saveGmailAuthCode(dataToSave).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.toaster.successToast(this.localeData?.gmail_account_added, this.commonLocaleData?.app_success);
                } else {
                    this.toaster.errorToast(res.message, res.code);
                }
                this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
            }
        });
    }

    /**
     * This will return page url
     *
     * @returns {string}
     * @memberof PurchaseSettingComponent
     */
    public getRedirectUrl(): string {
        return AppUrl + 'pages/purchase-management/purchase/settings';
    }


    /**
    * Opens custom email dialog
    *
    * @memberof PurchaseSettingComponent
    */
    public openCustomEmailDialog(type: string): void {
        this.dialog.open(TemplateFroalaComponent, {
            data: type,
            width: 'var(--aside-pane-width)',
            height: '70vh',
            position: {
                right: '15px',
                bottom: '0'
            }
        });
    }
}
