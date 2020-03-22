import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../../models/api-models/Ledger';
import { base64ToBlob, validateEmail } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some } from '../../../lodash-optimized';
import * as moment from 'moment/moment';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'export-ledger',
    templateUrl: './exportLedger.component.html',
    styleUrls: ['./exportLedger.component.scss']
})
export class ExportLedgerComponent implements OnInit {
    @Input() public accountUniqueName: string = '';
    // @Input() public from: string = '';
    // @Input() public to: string = '';
    @Input() public advanceSearchRequest: any;
    @Output() public closeExportLedgerModal: EventEmitter<boolean> = new EventEmitter();
    public emailTypeSelected: string = '';
    public exportAs: string = 'xlsx';
    public order: string = 'asc';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailTypeColumnar: string;
    public emailData: string = '';
    public withInvoiceNumber: boolean = false;
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _ledgerService: LedgerService, private _toaster: ToasterService, private _permissionDataService: PermissionDataService, private store: Store<AppState>) {
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this._permissionDataService.getData.forEach(f => {
            if (f.name === 'LEDGER') {
                let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
                this.emailTypeColumnar = 'columnar';
            }
        });
    }

    public exportLedger() {
        let exportByInvoiceNumber: boolean = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;
        let exportRequest = new ExportLedgerRequest();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.sort = this.order;
        exportRequest.format = this.exportAs;

        const body = _.cloneDeep(this.advanceSearchRequest);
        if (!body.dataToSend.bsRangeValue) {
            this.universalDate$.pipe(take(1)).subscribe(a => {
                if (a) {
                    body.dataToSend.bsRangeValue = [moment(a[0], 'DD-MM-YYYY').toDate(), moment(a[1], 'DD-MM-YYYY').toDate()];
                }
            });
        }

        exportRequest.from = moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        exportRequest.to = moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);

        //delete body.dataToSend;

        this._ledgerService.ExportLedger(exportRequest, this.accountUniqueName, body.dataToSend, exportByInvoiceNumber).subscribe(response => {
            if (response.status === 'success') {
                if (response.body) {
                    if (response.body.status === "success") {
                        if (response.queryString.fileType === 'xlsx') {
                            let blob = base64ToBlob(response.body.response, 'application/vnd.ms-excel', 512);
                            return saveAs(blob, `${this.accountUniqueName}.xls`);
                        } else if (response.queryString.fileType === 'pdf') {
                            let blob = base64ToBlob(response.body.response, 'application/pdf', 512);
                            return saveAs(blob, `${this.accountUniqueName}.pdf`);
                        }
                    } else if (response.body.message) {
                        this._toaster.infoToast(response.body.message);
                    }
                }

            } else {
                this._toaster.errorToast(response.message, response.code);
            }
        });
    }

    public sendLedgEmail() {
        this._toaster.clearAllToaster();
        let data = this.emailData;
        const sendData = new MailLedgerRequest();
        data = data.replace(RegExp(' ', 'g'), '');
        const cdata = data.split(',');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < cdata.length; i++) {
            if (validateEmail(cdata[i])) {
                sendData.recipients.push(cdata[i]);
            } else {
                // this._toaster.clearAllToaster();
                this._toaster.warningToast('Enter valid Email ID', 'Warning');
                data = '';
                sendData.recipients = [];
                break;
            }
        }

        if (sendData.recipients.length > 0) {
            const body = _.cloneDeep(this.advanceSearchRequest);
            if (!body.dataToSend.bsRangeValue) {
                this.universalDate$.pipe(take(1)).subscribe(a => {
                    if (a) {
                        body.dataToSend.bsRangeValue = [moment(a[0], 'DD-MM-YYYY').toDate(), moment(a[1], 'DD-MM-YYYY').toDate()];
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
            this._ledgerService.MailLedger(sendData, this.accountUniqueName, emailRequestParams).subscribe(sent => {
                if (sent.status === 'success') {
                    this._toaster.successToast(sent.body, sent.status);
                    this.emailData = '';
                } else {
                    this._toaster.errorToast(sent.message, sent.status);
                }
            });
        }
    }
}
