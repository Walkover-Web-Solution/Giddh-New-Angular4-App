import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { ToasterService } from '../../services/toaster.service';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { InvoiceService } from '../../services/invoice.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { GeneralService } from '../../services/general.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'purchase-setting',
    templateUrl: './purchase-setting.component.html',
    styleUrls: ['./purchase-setting.component.scss']
})

export class PurchaseSettingComponent implements OnInit, OnDestroy {
    public isInvalidfield: boolean = true;
    public isMulticurrencyAccount: true;
    public invoiceSettings: any = { purchaseBillSettings: {} };
    public lockDate: Date = new Date();
    public isEmailChanged: boolean = false;
    public originalEmail: string;
    public isGmailIntegrated: boolean;
    /* Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
    public companyUniqueName: any;
    public gmailAuthCodeUrl$: Observable<string> = null;
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private toaster: ToasterService, private settingsIntegrationActions: SettingsIntegrationActions, private invoiceService: InvoiceService, public purchaseOrderService: PurchaseOrderService, private generalService: GeneralService, public authenticationService: AuthenticationService, private route: ActivatedRoute) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));

        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl()).replace(':client_id', this.generalService.getGoogleCredentials().GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
    }

    public ngOnInit(): void {
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

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public initSettings(): void {
        this.invoiceService.GetInvoiceSetting().subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.invoiceSettings = _.cloneDeep(response.body);

                if (this.invoiceSettings.purchaseBillSettings.lockDate) {
                    this.lockDate = moment(this.invoiceSettings.purchaseBillSettings.lockDate, GIDDH_DATE_FORMAT).toDate();
                }
            }
        });

        this.store.pipe(select(state => state.settings.isGmailIntegrated), takeUntil(this.destroyed$)).subscribe(result => {
            this.isGmailIntegrated = result;
        });
    }

    public resetForm(): void {
        this.initSettings();
    }

    public updateForm(): void {
        let formToSave = _.cloneDeep(this.invoiceSettings);

        if (formToSave.purchaseBillSettings.lockDate instanceof Date) {
            formToSave.purchaseBillSettings.lockDate = moment(formToSave.purchaseBillSettings.lockDate).format(GIDDH_DATE_FORMAT);
        }

        this.invoiceService.UpdateInvoiceSetting(formToSave).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.toaster.successToast(response.body);
            } else {
                this.toaster.errorToast(response.message);
            }
        });
    }

    public verifyEmail(emailId: any): boolean {
        let email = new RegExp(/[a-z0-9!#$%&'*+=?^_{|}~-]+(?:.[a-z0-9!#$%&’*+=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email.test(emailId)) {
            this.updateSettingsEmail(emailId);
            return true;
        } else {
            this.toaster.warningToast('Invalid Email Address.');
            return false;
        }
    }

    public deleteEmail(emailId: any): boolean {
        if (!emailId) {
            return false;
        } else {
            this.updateSettingsEmail(null);
            return true;
        }
    }

    public onChangeEmail(email: string): void {
        this.isEmailChanged = email !== this.originalEmail;
    }

    public updateSettingsEmail(emailAddress: any): void {
        let getRequestObject = {
            companyUniqueName: this.companyUniqueName
        };

        let postRequestObject = {
            emailAddress: emailAddress
        };

        this.purchaseOrderService.updateSettingsEmail(getRequestObject, postRequestObject).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.initSettings();
                this.toaster.successToast(response.body);
            } else {
                this.toaster.errorToast(response.message);
            }
        });
    }

    private saveGmailAuthCode(authCode: string): void {
        const dataToSave = {
            code: authCode,
            client_secret: this.generalService.getGoogleCredentials().GOOGLE_CLIENT_SECRET,
            client_id: this.generalService.getGoogleCredentials().GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl()
        };

        this.authenticationService.saveGmailAuthCode(dataToSave).subscribe((res) => {
            if (res.status === 'success') {
                this.toaster.successToast('Gmail account added successfully.', 'Success');
            } else {
                this.toaster.errorToast(res.message, res.code);
            }
            this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
        });
    }

    public getRedirectUrl(): string {
        return AppUrl + 'pages/purchase-management/purchase-settings';
    }
}