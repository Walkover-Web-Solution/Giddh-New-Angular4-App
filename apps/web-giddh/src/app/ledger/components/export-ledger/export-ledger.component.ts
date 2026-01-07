import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest } from '../../../models/api-models/Ledger';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store, select } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { download } from '@giddh-workspaces/utils';
import { GeneralService } from '../../../services/general.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { Router } from '@angular/router';
import { ExportBodyRequest } from '../../../models/api-models/DaybookRequest';
import { VoucherComponentStore } from '../../../vouchers/utility/vouchers.store';
import { saveAs } from 'file-saver';
import { IOption } from '../../../app.constant';
import { CopyType } from '../../../shared/Enums/common.enum';
import { TributeConfig } from '../../../shared/helpers/directives/tributeMention/tributeType';
import { cloneDeep } from '../../../lodash-optimized';
@Component({
    selector: 'export-ledger',
    templateUrl: './export-ledger.component.html',
    styleUrls: ['./export-ledger.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [VoucherComponentStore],
    standalone:false
})

export class ExportLedgerComponent implements OnInit, OnDestroy {
    public emailTypeSelected: string = '';
    public exportAs: string = 'xlsx';
    public order: string = 'asc';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailTypeColumnar: string;
    public emailData: string = '';
    public withInvoiceNumber: boolean = false;
    public universalDate$: Observable<any>;
    /** Columnar report in balance type for Credit/Debit as +/- sign */
    public balanceTypeAsSign: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Reference to universal date picker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** To hold export request object */
    public exportRequest: ExportBodyRequest = {
        from: '',
        to: '',
        sort: 'ASC',
        showVoucherNumber: false,
        showVoucherTotal: false,
        showEntryVoucher: false,
        showDescription: false,
        accountUniqueName: '',
        exportType: 'LEDGER_EXPORT',
        showEntryVoucherNo: false,
        attachmentExport: false,
        voucherExport: true,
        fileNameFormat: '',
        ledgerView: false,
        mergePdf: false,
        copyTypes: [],
        showInAccountCurrency: null
    }
    /** Stores the voucher API version of the company */
    public voucherApiVersion: number;
    /** This will show/hide for v2 for bill to bill*/
    public enableBillToBill: boolean = false;
    /** This will use for bill to bill value*/
    public emailTypeBillToBill: string;
    /** This will use for stop multiple hit api*/
    public isLoading: boolean = false;
    /** This will use for export as file type*/
    public fileType: string = '';
    /** Holds the current date */
    public todayDate: any = new Date();
    /** List of available file formats with predefined values */
    public fileFormatList = [
        { value: 'Voucher Date', label: 'Voucher Date', key: 'DATE', showValue: dayjs(this.todayDate).format(GIDDH_DATE_FORMAT) },
        { value: 'Entry No', label: 'Entry No', key: 'ENTRY_NO', showValue: "3824" },
        { value: 'Account Name', label: 'Account Name', key: 'ACC_NAME', showValue: "Walkover" }
    ];
    /** List of selected file formats */
    public selectedFormatList: string = "";
    /** List of copy type */
    public copyTypes: IOption[] = [];
    /** Prefix of format file name */
    public fileFormatPrefix: string = "AS";
    /* Will check if form is valid */
    public isValidForm: boolean = true;
    /** Tribute config */
    public tributeConfig: TributeConfig = {
        trigger: '{',
        suggestionPrefix: '{',
        suggestionSuffix: '}',
    };

    constructor(
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private permissionDataService: PermissionDataService,
        private store: Store<AppState>,
        private generalService: GeneralService,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private componentStore: VoucherComponentStore
    ) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.pipe(select(value => value.ledger.account), takeUntil(this.destroyed$)).subscribe(ledgerAccount => {
            ledgerAccount?.parentGroups?.forEach(group => {
                if (["sundrycreditors", "sundrydebtors"].includes(group?.uniqueName)) {
                    this.enableBillToBill = true;
                }
            });
        });

        if (this.inputData?.isLedgerAccountAllowsMultiCurrency) {
            this.exportRequest.showInAccountCurrency = !this.inputData?.currencyTogglerModel;
        }

        this.fileType = this.exportRequest.ledgerView ? 'XLSX' : 'CSV';

        if (this.permissionDataService.getData && this.permissionDataService.getData.length > 0) {
            (Array.isArray(this.permissionDataService.getData) ? this.permissionDataService.getData : []).forEach(f => {
                if (f.name === 'LEDGER') {
                    let isAdmin = f.permissions?.filter((prm) => prm.code === 'UPDT');
                    this.emailTypeSelected = isAdmin?.length ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeMini = isAdmin?.length ? 'admin-condensed' : 'view-condensed';
                    this.emailTypeDetail = isAdmin?.length ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeColumnar = 'columnar';
                    this.emailTypeBillToBill = 'billToBill';
                }
            });
        }

        if (this.inputData?.advanceSearchRequest?.dataToSend?.bsRangeValue) {
            let dateObj = this.inputData?.advanceSearchRequest?.dataToSend?.bsRangeValue;
            let universalDate = cloneDeep(dateObj);
            this.selectedDateRange = { startDate: dateObj[0], endDate: dateObj[1] };
            this.selectedDateRangeUi = dateObj[0].format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dateObj[1].format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = universalDate[0].format(GIDDH_DATE_FORMAT);
            this.toDate = universalDate[1].format(GIDDH_DATE_FORMAT);
        } else {
            this.universalDate$.pipe(take(1)).subscribe(dateObj => {
                if (dateObj) {
                    let universalDate = cloneDeep(dateObj);
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                }
            });
        }

        this.componentStore.bulkExportVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response?.status === "success" && response?.body) {
                if (response.body.type === "base64") {
                    let blob = this.generalService.base64ToBlob(response.body.file, 'application/zip', 512);
                    saveAs(blob, this.inputData?.voucherType + `.zip`);
                }
            }
        });
    }

    /**
     * This will use for export ledger
     *
     * @memberof ExportLedgerComponent
     */
    public exportLedger() {
        this.isLoading = true;
        let exportByInvoiceNumber: boolean = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;

        let exportRequest = new ExportLedgerRequest();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.format = this.exportAs;
        exportRequest.balanceTypeAsSign = this.balanceTypeAsSign;
        exportRequest.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName;
        exportRequest.from = this.fromDate;
        exportRequest.to = this.toDate;

        let body = cloneDeep(this.inputData?.advanceSearchRequest);
        if (body && body.dataToSend) {
            body.dataToSend.type = this.emailTypeSelected;
            body.dataToSend.balanceTypeAsSign = this.balanceTypeAsSign;
            body.dataToSend.sort = this.exportRequest.sort ? 'ASC' : 'DESC';
            body.dataToSend.from = this.fromDate;
            body.dataToSend.to = this.toDate;
            body.dataToSend.accountUniqueName = this.inputData?.accountUniqueName;
            body.dataToSend.exportType = this.exportRequest.exportType;
            body.dataToSend.fileType = this.fileType;
            if (this.inputData?.isLedgerAccountAllowsMultiCurrency) {
                body.dataToSend.showInAccountCurrency = this.exportRequest.showInAccountCurrency;
            }
            if (this.emailTypeSelected === this.emailTypeDetail) {
                body.dataToSend.ledgerView = this.exportRequest.ledgerView ? 'T_View' : 'Statement_View';
                if (!this.exportRequest.ledgerView) {
                    body.dataToSend.showEntryVoucherNo = this.exportRequest.showEntryVoucherNo;
                    body.dataToSend.showVoucherNumber = this.exportRequest.showVoucherNumber;
                    body.dataToSend.showVoucherTotal = this.exportRequest.showVoucherTotal;
                    body.dataToSend.showEntryVoucher = this.exportRequest.showEntryVoucher;
                    body.dataToSend.showDescription = this.exportRequest.showDescription;
                }
            }
        }
        if (this.voucherApiVersion === 2 && this.emailTypeSelected === 'billToBill') {
            this.ledgerService.exportBillToBillLedger(exportRequest, this.inputData?.accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
                if (response?.status === "success") {
                    if (response?.body?.type === "message") {
                        this.toaster.showSnackBar("success", response.body.name);
                    } else {
                        let blob = this.generalService.base64ToBlob(response?.body?.data, 'application/vnd.ms-excel', 512);
                        return download(response.body.name, blob, 'application/vnd.ms-excel');
                    }
                } else if (response?.message) {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        } else {
            if (this.emailTypeSelected === 'voucher') {
                if (this.exportRequest.voucherExport && !this.exportRequest.copyTypes.length) {
                    this.isValidForm = false;
                    this.isLoading = false;
                    return;
                }
                let postRequest: any = {
                    attachmentExport: this.exportRequest.attachmentExport,
                    voucherExport: this.exportRequest.voucherExport,
                    entryUniqueNames: this.inputData?.selectEntryUniqueName
                };
                if (this.exportRequest.attachmentExport) {
                    let fileNameFormat = this.selectedFormatList?.trim();
                    if (fileNameFormat?.length) {
                        (Array.isArray(this.fileFormatList) ? this.fileFormatList : []).forEach(format => {
                            const pattern = new RegExp(`\\{${format.value}\\}`, 'g');
                            fileNameFormat = fileNameFormat.replace(pattern, `\${${format.key}}`);
                        });
                        postRequest.fileNameFormat = fileNameFormat;
                    } else {
                        postRequest.fileNameFormat = this.fileFormatPrefix + "-${" + this.fileFormatList[0].key + "}-${" + this.fileFormatList[1].key + "}-${" + this.fileFormatList[2].key + "}";
                    }
                }
                if (this.exportRequest.voucherExport) {
                    postRequest.mergePdf = this.exportRequest.mergePdf;
                    postRequest.copyTypes = this.exportRequest.copyTypes;
                }
                const getRequest = {
                    accountUniqueName: this.inputData?.accountUniqueName,
                    from: this.fromDate,
                    to: this.toDate
                };
                this.componentStore.bulkExportVoucher({ getRequest: getRequest, postRequest: postRequest });
                return;
            }
            this.ledgerService.ExportLedger(exportRequest, this.inputData?.accountUniqueName, body?.dataToSend, exportByInvoiceNumber).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
                if (response?.status === 'success') {
                    if (response.body) {
                        if (this.emailTypeSelected === 'admin-detailed' || this.emailTypeSelected === 'view-detailed') {
                            if (response.body.encodedData) {
                                let blob = this.generalService.base64ToBlob(response.body.encodedData, (response.body.type === "xlsx" ? 'application/vnd.ms-excel' : 'text/csv'), 512);
                                return download(response.body.name, blob, (response.body.type === "xlsx" ? 'application/vnd.ms-excel' : 'text/csv'));
                            } else {
                                this.toaster.showSnackBar("success", response.body);
                                this.router.navigate(["/pages/downloads/exports"]);
                            }
                        } else {
                            if (response?.status === "success") {
                                if (response?.body?.status === "success") {
                                    if (response.queryString.fileType === 'xlsx') {
                                        let blob = this.generalService.base64ToBlob(response.body.response, 'application/vnd.ms-excel', 512);
                                        return download(response.body.fileName, blob, 'application/vnd.ms-excel');
                                    } else if (response.queryString.fileType === 'pdf') {
                                        let blob = this.generalService.base64ToBlob(response.body.response, 'application/pdf', 512);
                                        return download(response.body.fileName, blob, 'application/pdf');
                                    }
                                } else {
                                    this.toaster.showSnackBar("success", response.body.message);
                                }
                            } else if (response.message) {
                                this.toaster.showSnackBar("error", response.message);
                            }
                        }
                    }
                } else {
                    this.toaster.showSnackBar("error", response.message, response.code);
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
        exportRequest.from = this.fromDate;
        exportRequest.to = this.toDate;

        this.dialogRef.close({
            isShowColumnarTable: true,
            exportRequest: exportRequest
        });
    }
    /**
     * This will show the datepicker
     *
     * @param {boolean} isOpen
     * @memberof ExportLedgerComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ExportLedgerComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Releases memory
     *
     * @memberof ExportLedgerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Generates a formatted file name based on selected file formats.
     *
     * @returns {string} The formatted file name string.
     * @memberof ExportLedgerComponent
     */
    public getFileFormat() {
        let fileNameFormat = this.selectedFormatList;
        (Array.isArray(this.fileFormatList) ? this.fileFormatList : []).forEach((format) => {
            if (this.selectedFormatList.includes(`{${format.value}}`)) {
                fileNameFormat = fileNameFormat.replaceAll(`{${format.value}}`, format.showValue);
            }
        });
        this.exportRequest.fileNameFormat = fileNameFormat;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof ExportLedgerComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.copyTypes = [
                { value: CopyType.ORIGINAL, label: this.localeData?.invoice_copy_options?.original },
                { value: CopyType.CUSTOMER, label: this.localeData?.invoice_copy_options?.customer },
                { value: CopyType.TRANSPORT, label: this.localeData?.invoice_copy_options?.transport }
            ];
        }
    }

    /**
     * Handler for fileType change from the view
     *
     * @param {string} newType
     * @memberof ExportLedgerComponent
     */
    public onLedgerView(type: string): void {
        this.fileType = type ? 'XLSX' : 'CSV';
    }
}
