import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../../models/api-models/Ledger';
import { validateEmail } from '../../../shared/helpers/helperFunctions';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some } from '../../../lodash-optimized';
import * as moment from 'moment/moment';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store, select } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { download } from '@giddh-workspaces/utils';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'export-ledger',
    templateUrl: './export-ledger.component.html',
    styleUrls: ['./export-ledger.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExportLedgerComponent implements OnInit {
    public emailTypeSelected: string = '';
    public exportAs: string = 'xlsx';
    public order: string = 'asc';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailTypeColumnar: string;
    public emailData: string = '';
    public withInvoiceNumber: boolean = false;
    public universalDate$: Observable<any>;
    public isMobileScreen: boolean = true;
    /** Columnar report in balance type for Credit/Debit as +/- sign */
    public balanceTypeAsSign: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private ledgerService: LedgerService, private toaster: ToasterService, private permissionDataService: PermissionDataService, private store: Store<AppState>, private generalService: GeneralService, @Inject(MAT_DIALOG_DATA) public inputData, public dialogRef: MatDialogRef<any>, private changeDetectorRef: ChangeDetectorRef) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.permissionDataService.getData && this.permissionDataService.getData.length > 0) {
            this.permissionDataService.getData.forEach(f => {
                if (f.name === 'LEDGER') {
                    let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                    this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                    this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeColumnar = 'columnar';
                }
            });
        }
    }

    public exportLedger() {
        let exportByInvoiceNumber: boolean = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;
        let exportRequest = new ExportLedgerRequest();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.sort = this.order;
        exportRequest.format = this.exportAs;
        exportRequest.balanceTypeAsSign = this.balanceTypeAsSign;
        exportRequest.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName;
        const body = _.cloneDeep(this.inputData?.advanceSearchRequest);
        if (body && body.dataToSend) {
            body.dataToSend.balanceTypeAsSign = this.balanceTypeAsSign;
        }
        if (!body.dataToSend.bsRangeValue) {
            this.universalDate$.pipe(take(1)).subscribe(res => {
                if (res) {
                    body.dataToSend.bsRangeValue = [moment(res[0], GIDDH_DATE_FORMAT).toDate(), moment(res[1], GIDDH_DATE_FORMAT).toDate()];
                }
            });
        }

        exportRequest.from = moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        exportRequest.to = moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);

        this.ledgerService.ExportLedger(exportRequest, this.inputData?.accountUniqueName, body.dataToSend, exportByInvoiceNumber).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response.status === 'success') {
                if (response.body) {
                    if (response.body.status === "success") {
                        if (response.queryString.fileType === 'xlsx') {
                            let blob = this.generalService.base64ToBlob(response.body.response, 'application/vnd.ms-excel', 512);
                            return download(`${this.inputData?.accountUniqueName}.xlsx`, blob, 'application/vnd.ms-excel');
                        } else if (response.queryString.fileType === 'pdf') {
                            let blob = this.generalService.base64ToBlob(response.body.response, 'application/pdf', 512);
                            return download(`${this.inputData?.accountUniqueName}.pdf`, blob, 'application/pdf');
                        }
                    } else if (response.body.message) {
                        this.toaster.showSnackBar("info", response.body.message);
                    }
                }
            } else {
                this.toaster.showSnackBar("error", response.message, response.code);
            }
        });
    }

    public sendLedgEmail() {
        let data = this.emailData;
        const sendData = new MailLedgerRequest();
        data = (data) ? data.replace(RegExp(' ', 'g'), '') : "";
        const cdata = data.split(',');

        if (cdata && cdata.length > 0) {
            for (let i = 0; i < cdata.length; i++) {
                if (validateEmail(cdata[i])) {
                    sendData.recipients.push(cdata[i]);
                } else {
                    this.toaster.showSnackBar("warning", this.localeData?.email_error, this.commonLocaleData?.app_warning);
                    data = '';
                    sendData.recipients = [];
                    break;
                }
            }
        }

        if (sendData && sendData.recipients && sendData.recipients.length > 0) {
            const body = _.cloneDeep(this.inputData?.advanceSearchRequest);
            if (!body.dataToSend.bsRangeValue) {
                this.universalDate$.pipe(take(1)).subscribe(a => {
                    if (a) {
                        body.dataToSend.bsRangeValue = [moment(a[0], GIDDH_DATE_FORMAT).toDate(), moment(a[1], GIDDH_DATE_FORMAT).toDate()];
                    }
                });
            }
            let from = moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
            let to = moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);
            let emailRequestParams = new ExportLedgerRequest();
            emailRequestParams.from = from;
            emailRequestParams.to = to;
            emailRequestParams.type = this.emailTypeSelected;
            emailRequestParams.format = this.exportAs;
            emailRequestParams.sort = this.order;
            emailRequestParams.withInvoice = this.withInvoiceNumber;
            emailRequestParams.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName;
            this.ledgerService.MailLedger(sendData, this.inputData?.accountUniqueName, emailRequestParams).pipe(takeUntil(this.destroyed$)).subscribe(sent => {
                if (sent.status === 'success') {
                    this.toaster.showSnackBar("success", sent.body, sent.status);
                    this.emailData = '';
                    this.changeDetectorRef.detectChanges();
                } else {
                    this.toaster.showSnackBar("error", sent.message, sent.status);
                }
            });
        }
    }

    /**
     * Handler for report type change
     *
     * @param {string} reportType Selected report type to be exported
     * @memberof ExportLedgerComponent
     */
    public handleReportTypeChange(reportType: string): void {
        if (reportType === 'columnar') {
            this.exportAs = 'xlsx';
        }
    }

    /**
     * To show columnar report table on ledeger
     *
     * @memberof ExportLedgerComponent
     */
    public showColumnarReport(): void {
        let exportRequest = new ExportLedgerRequest();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.sort = this.order;
        exportRequest.format = this.exportAs;
        exportRequest.balanceTypeAsSign = this.balanceTypeAsSign;
        exportRequest.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName;

        this.dialogRef.close({
            isShowColumnarTable: true,
            exportRequest: exportRequest
        });
    }
}
