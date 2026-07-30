import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some, cloneDeep } from '../../../../lodash-optimized';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from 'apps/web-giddh/src/app/app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { takeUntil } from 'rxjs/operators';
import { ExportBodyRequest } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { IOption } from 'apps/web-giddh/src/app/app.constant';
import { CopyType } from 'apps/web-giddh/src/app/shared/Enums/common.enum';
import { TributeConfig } from 'apps/web-giddh/src/app/shared/helpers/directives/tributeMention/tributeType';
import { VoucherComponentStore } from 'apps/web-giddh/src/app/vouchers/utility/vouchers.store';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
    selector: 'export-group-ledger',
    templateUrl: './export-group-ledger.component.html',
    styleUrls: ['./export-group-ledger.component.scss'],
    standalone: false,
    providers: [VoucherComponentStore]
})

export class ExportGroupLedgerComponent implements OnInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeExportGroupLedgerModal: EventEmitter<any> = new EventEmitter();
    /** Event emitter for the close dialog */
    @Output() public closeExportGroupAccountModal: EventEmitter<any> = new EventEmitter();
    /** Holds active group unique name */
    @Input() public activeGroupUniqueName: string = '';

    public emailTypeSelected: string = '';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailData: string = '';
    public order: string = 'asc';
    public dateRange: { from: string, to: string } = { from: '', to: '' };
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Directive to get reference of datepicker menu trigger */
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
    /* Universal date observer */
    public universalDate$: Observable<any>;
/** To unsubscribe observer */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** To hold export request object */
    public exportRequest: ExportBodyRequest = {
        from: '',
        to: '',
        sort: 'ASC',
        showVoucherNumber: false,
        showVoucherTotal: false,
        showEntryVoucher: false,
        showDescription: false,
        groupUniqueName: '',
        exportType: 'GROUP_LEDGER_EXPORT',
        showEntryVoucherNo: false,
        attachmentExport: false,
        voucherExport: true,
        fileNameFormat: '',
        mergePdf: false,
        copyTypes: []
    }
    /** To hold export request object */
    public fileType: string = 'CSV';
    /** Hold export type */
    public exportType: string = 'ledger';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Form Group for export form */
    public exportFormValue: any;
    /** Holds current group object */
    public currentGroup: any = {};
    /** Holds Group uniques name from Params */
    public groupUniqueName: string = '';
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
    /** Will check if form is valid */
    public isValidForm: boolean = true;
    /** Tribute config */
    public tributeConfig: TributeConfig = {
        trigger: '{',
        suggestionPrefix: '{',
        suggestionSuffix: '}',
    };

    constructor(private store: Store<AppState>, private _permissionDataService: PermissionDataService, private generalService: GeneralService,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private componentStore: VoucherComponentStore,
        private router: Router) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // Set a default date
        this.dateRange.from = dayjs(dayjs().subtract(30, 'day')).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = dayjs(dayjs()).format(GIDDH_DATE_FORMAT);

        if (this._permissionDataService.getData && this._permissionDataService.getData.length > 0) {
            (Array.isArray(this._permissionDataService.getData) ? this._permissionDataService.getData : []).forEach(f => {
                if (f.name === 'LEDGER') {
                    let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                    this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                    this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
                }
            });
        }

        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        this.componentStore.bulkExportVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response) {
                if (response?.status === "success" && response?.body) {
                    if (response.body.type === "base64") {
                        this.closeExportGroupLedgerModal.emit(true);
                        let blob = this.generalService.base64ToBlob(response.body.file, 'application/zip', 512);
                        return saveAs(blob, this.activeGroupUniqueName + `.zip`);
                    } else {
                        // for close master dialog
                        this.closeExportGroupLedgerModal.emit('close');
                        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
                        document.querySelector('body')?.classList?.remove('master-page');
                        this.router.navigate(["/pages/downloads/exports"]);
                    }
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            }
        });
    }

    /**
     * This will use for export ledger
     *
     * @memberof ExportGroupLedgerComponent
     */
    public exportLedger() {
        if (this.exportType === 'voucher') {
            if (this.exportRequest.voucherExport && !this.exportRequest.copyTypes.length) {
                this.isValidForm = false;
                return;
            }
            this.isLoading = true;
            let postRequest: any = {
                attachmentExport: this.exportRequest.attachmentExport,
                voucherExport: this.exportRequest.voucherExport,
                groupUniqueName: this.activeGroupUniqueName
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
                groupUniqueName: this.activeGroupUniqueName,
                from: this.fromDate,
                to: this.toDate,
                type: '',
                mail: '',
                q: ''
            };
            this.componentStore.bulkExportVoucher({ getRequest: getRequest, postRequest: postRequest });
            return;
        } else if (this.exportType === 'ledger') {
            this.exportRequest.from = this.fromDate;
            this.exportRequest.to = this.toDate;
            this.closeExportGroupLedgerModal.emit({ from: this.fromDate, to: this.toDate, type: this.emailTypeSelected, fileType: this.fileType, order: this.order, body: this.exportRequest });
        } else {
            let exportRequest: ExportBodyRequest = new ExportBodyRequest();
            exportRequest.exportType = "MASTER_EXPORT";
            exportRequest.groupUniqueNames = [this.activeGroupUniqueName];
            exportRequest.columnsToExport = [];
            const formValue = this.exportFormValue;
            if (formValue.openingBalance) {
                exportRequest.columnsToExport?.push("Opening Balance");
            }
            if (formValue.openingBalanceType) {
                exportRequest.columnsToExport?.push("Opening Balance Type");
            }
            if (formValue.foreignOpeningBalance) {
                exportRequest.columnsToExport?.push("Foreign Opening Balance");
            }
            if (formValue.foreignOpeningBalanceType) {
                exportRequest.columnsToExport?.push("Foreign Opening Balance Type");
            }
            if (formValue.currency) {
                exportRequest.columnsToExport?.push("Currency");
            }
            if (formValue.mobileNumber) {
                exportRequest.columnsToExport?.push("Mobile Number");
            }
            if (formValue.email) {
                exportRequest.columnsToExport?.push("Email");
            }
            if (formValue.attentionTo) {
                exportRequest.columnsToExport?.push("Attention to");
            }
            if (formValue.remark) {
                exportRequest.columnsToExport?.push("Remark");
            }
            if (formValue.address) {
                exportRequest.columnsToExport?.push("Address");
            }
            if (formValue.pinCode) {
                exportRequest.columnsToExport?.push("Pin Code");
            }
            if (formValue.taxNumber) {
                exportRequest.columnsToExport?.push("Tax Number");
            }
            if (formValue.partyType) {
                exportRequest.columnsToExport?.push("Party Type");
            }
            if (formValue.bankName) {
                exportRequest.columnsToExport?.push("Bank Name");
            }
            if (formValue.bankAccountNumber) {
                exportRequest.columnsToExport?.push("Bank Account Number");
            }
            if (formValue.ifscCode) {
                exportRequest.columnsToExport?.push("IFSC Code");
            }
            if (formValue.beneficiaryName) {
                exportRequest.columnsToExport?.push("Beneficiary Name");
            }
            if (formValue.branchName) {
                exportRequest.columnsToExport?.push("Branch Name");
            }
            if (formValue.swiftCode) {
                exportRequest.columnsToExport?.push("Swift Code");
            }
            this.isLoading = true;
            this.ledgerService.exportData(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                if (response?.status === "success") {
                    this.toaster.showSnackBar("success", response?.body);
                    this.closeExportGroupAccountModal.emit(true);
                    // for close master dialog
                    this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
                    document.querySelector('body')?.classList?.remove('master-page');
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        }
    }

    public onSelectDateRange(ev) {
        this.dateRange.from = dayjs(ev.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = dayjs(ev.picker.endDate).format(GIDDH_DATE_FORMAT);
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen Set to true to open the datepicker, false to close it
     * @memberof ExportGroupLedgerComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (this.universalDatepickerTrigger) {
            if (isOpen) {
                this.universalDatepickerTrigger.openMenu();
            } else {
                this.universalDatepickerTrigger.closeMenu();
            }
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value Selected date range object
     * @memberof ExportGroupLedgerComponent
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
            this.dateRange.from = this.fromDate;
            this.dateRange.to = this.toDate;
        }
    }

    /**
     * Releases memory
     *
     * @memberof ExportGroupLedgerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Generates a formatted file name based on selected file formats.
     *
     * @returns {string} The formatted file name string.
     * @memberof ExportGroupLedgerComponent
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
     * @memberof ExportGroupLedgerComponent
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
}