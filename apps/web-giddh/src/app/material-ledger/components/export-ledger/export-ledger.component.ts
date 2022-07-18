import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
export interface ExportBodyRequest {
    from?: string;
    to?: string;
    sort?: string;
    showVoucherNumber?: boolean;
    showVoucherTotal?: boolean;
    showEntryVoucher?: boolean;
    showDescription?: boolean;
    accountUniqueName?: string;
    exportType?: string;
    voucherType?: boolean;
}
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
    public withSorting: boolean = false;
    public universalDate$: Observable<any>;
    public isMobileScreen: boolean = true;
    /** Columnar report in balance type for Credit/Debit as +/- sign */
    public balanceTypeAsSign: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public dateRange: { from: string, to: string } = { from: '', to: '' };
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Moment object */
    public moment = moment;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    public exportRequest: ExportBodyRequest = {
        from: '',
        to: '',
        sort: '',
        showVoucherNumber: false,
        showVoucherTotal: false,
        showEntryVoucher: false,
        showDescription: false,
        accountUniqueName: '',
        exportType: 'LEDGER_EXPORT',
        voucherType: false
    }

    constructor(private ledgerService: LedgerService, private toaster: ToasterService, private permissionDataService: PermissionDataService, private store: Store<AppState>, private generalService: GeneralService, @Inject(MAT_DIALOG_DATA) public inputData, public dialogRef: MatDialogRef<any>, private changeDetectorRef: ChangeDetectorRef, private modalService: BsModalService) {
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
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    public exportLedger() {
        let exportByInvoiceNumber: boolean = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;


        let exportRequest = new ExportLedgerRequest();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.format = this.exportAs;
        exportRequest.balanceTypeAsSign = this.balanceTypeAsSign;
        exportRequest.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName;
        const body = _.cloneDeep(this.inputData?.advanceSearchRequest);

        if (body && body.dataToSend) {
            body.dataToSend.balanceTypeAsSign = this.balanceTypeAsSign;
            // body.dataToSend.sort = this.exportRequest.sort ? 'asc' : 'desc';
            body.dataToSend.from = this.exportRequest.from;
            body.dataToSend.to = this.exportRequest.to;
            body.dataToSend.accountUniqueName = this.inputData?.accountUniqueName;
            body.dataToSend.exportType = this.exportRequest.exportType;
            body.dataToSend.voucherType = this.exportRequest.voucherType;
            body.dataToSend.showVoucherNumber = this.exportRequest.showVoucherNumber;
            body.dataToSend.showVoucherTotal = this.exportRequest.showVoucherTotal;
            body.dataToSend.showEntryVoucher = this.exportRequest.showEntryVoucher;
            body.dataToSend.showDescription = this.exportRequest.showDescription;
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
    public onSelectDateRange(ev) {
        this.dateRange.from = moment(ev.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = moment(ev.picker.endDate).format(GIDDH_DATE_FORMAT);
    }

    /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof AuditLogsFormComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AuditLogsFormComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.dateRange.from = this.fromDate;
            this.dateRange.to = this.toDate;
        }
    }
}
