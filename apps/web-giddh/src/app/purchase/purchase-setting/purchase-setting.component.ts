import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { ToasterService } from '../../services/toaster.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';

@Component({
    selector: 'purchase-setting',
    templateUrl: './purchase-setting.component.html',
    styleUrls: ['./purchase-setting.component.scss']
})

export class PurchaseSettingComponent implements OnInit {

    public modelRef: BsModalRef;
    public isInvalidfield: boolean = true;
    public isMulticurrencyAccount: true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public purchaseBillSettings: any = {};
    public isLockDateSet: boolean = false;
    public lockDate: Date = new Date();
    public isEmailChanged: boolean = false;
    public originalEmail: string;
    public isGmailIntegrated: boolean;

    constructor(private modalService: BsModalService, private generalService: GeneralService, private invoiceActions: InvoiceActions, private store: Store<AppState>, private toaster: ToasterService, private settingsIntegrationActions: SettingsIntegrationActions) {
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
    }

    public ngOnInit(): void {
        this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$)).subscribe((setting: InvoiceSetting) => {
            if (setting && setting.invoiceSettings && setting.webhooks) {
                this.purchaseBillSettings = _.cloneDeep(setting.purchaseBillSettings);

                if (this.purchaseBillSettings.lockDate) {
                    this.isLockDateSet = true;
                    this.lockDate = moment(this.purchaseBillSettings.lockDate, GIDDH_DATE_FORMAT).toDate();
                } else {
                    this.isLockDateSet = false;
                }
            } else if (!setting || !setting.purchaseBillSettings) {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            }
        });

        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());

        this.store.pipe(select(s => s.settings.isGmailIntegrated), takeUntil(this.destroyed$)).subscribe(result => {
            this.isGmailIntegrated = result;
        });
    }

    public resetForm(): void {

    }

    public updateForm(): void {

    }

    public verfiyEmail(emailId: any): boolean {
        let email = new RegExp(/[a-z0-9!#$%&'*+=?^_{|}~-]+(?:.[a-z0-9!#$%&’*+=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email.test(emailId)) {
            this.store.dispatch(this.invoiceActions.updateInvoiceEmail(emailId));
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
            let emailTodelete = _.cloneDeep(emailId);
            emailTodelete = null;
            this.store.dispatch(this.invoiceActions.deleteInvoiceEmail(emailTodelete));
            return true;
        }
    }

    public onChangeEmail(email: string): void {
        this.isEmailChanged = email !== this.originalEmail;
    }
}