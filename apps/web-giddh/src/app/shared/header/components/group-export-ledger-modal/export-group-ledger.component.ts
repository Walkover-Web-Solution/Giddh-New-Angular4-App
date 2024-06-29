import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { Component, EventEmitter, OnInit, Output, ViewChild, Input, TemplateRef } from '@angular/core';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some } from '../../../../lodash-optimized';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from 'apps/web-giddh/src/app/app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { takeUntil } from 'rxjs/operators';
import { ExportBodyRequest } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';

@Component({
    selector: 'export-group-ledger',
    templateUrl: './export-group-ledger.component.html',
    styleUrls: ['./export-group-ledger.component.scss']
})

export class ExportGroupLedgerComponent implements OnInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeExportGroupLedgerModal: EventEmitter<any> = new EventEmitter();
    /** Holds group unique name */
    @Input() public currentGrpUniqueName: string = '';

    public emailTypeSelected: string = '';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailData: string = '';
    public order: string = 'asc';
    public dateRange: { from: string, to: string } = { from: '', to: '' };
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
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
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
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
        showEntryVoucherNo: false
    }
    /** To hold export request object */
    public fileType: string = 'CSV';
    /** hold exportType value */
    public expotyType: string = 'ledger';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Form Group for export  form */
    public exportForm: any;
    /** Holds current group object */
    public currentGroup: any = {};
    /** Holds Group uniques name from Params */
    public groupUniqueName: string = '';

    constructor(private store: Store<AppState>, private _permissionDataService: PermissionDataService, private generalService: GeneralService, private modalService: BsModalService,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private router: Router,
        private formBuilder: FormBuilder,
        private groupWithAccountsAction: GroupWithAccountsAction) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // Set a default date
        this.dateRange.from = dayjs(dayjs().subtract(30, 'day')).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = dayjs(dayjs()).format(GIDDH_DATE_FORMAT);

        if (this._permissionDataService.getData && this._permissionDataService.getData.length > 0) {
            this._permissionDataService.getData.forEach(f => {
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
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    /**
     * This will use for export ledger
     *
     * @memberof ExportGroupLedgerComponent
     */
    public exportLedger() {
        if (this.expotyType === 'ledger') {
            this.exportRequest.from = this.fromDate;
            this.exportRequest.to = this.toDate;
            this.closeExportGroupLedgerModal.emit({ from: this.fromDate, to: this.toDate, type: this.emailTypeSelected, fileType: this.fileType, order: this.order, body: this.exportRequest });
        } else {
            let exportRequest: ExportBodyRequest = new ExportBodyRequest();
            exportRequest.exportType = "MASTER_EXPORT";
            exportRequest.fileType = "CSV";
            exportRequest.groupUniqueNames = [this.currentGrpUniqueName];
            exportRequest.columnsToExport = [];
            const formValue = this.exportForm;
            if (formValue.openingBalance) {
                exportRequest.columnsToExport?.push("Opening Balance")
            }
            if (formValue.openingBalanceType) {
                exportRequest.columnsToExport?.push("Opening Balance Type")
            }
            if (formValue.foreignOpeningBalance) {
                exportRequest.columnsToExport?.push("Foreign Opening Balance")
            }
            if (formValue.foreignOpeningBalanceType) {
                exportRequest.columnsToExport?.push("Foreign Opening Balance Type")
            }
            if (formValue.currency) {
                exportRequest.columnsToExport?.push("Currency")
            }
            if (formValue.mobileNumber) {
                exportRequest.columnsToExport?.push("Mobile Number")
            }
            if (formValue.email) {
                exportRequest.columnsToExport?.push("Email")
            }
            if (formValue.attentionTo) {
                exportRequest.columnsToExport?.push("Attention to")
            }
            if (formValue.remark) {
                exportRequest.columnsToExport?.push("Remark")
            }
            if (formValue.address) {
                exportRequest.columnsToExport?.push("Address")
            }
            if (formValue.pinCode) {
                exportRequest.columnsToExport?.push("Pin Code")
            }
            if (formValue.taxNumber) {
                exportRequest.columnsToExport?.push("Tax Number")
            }
            if (formValue.partyType) {
                exportRequest.columnsToExport?.push("Party Type")
            }
            if (formValue.bankName) {
                exportRequest.columnsToExport?.push("Bank Name")
            }
            if (formValue.bankAccountNumber) {
                exportRequest.columnsToExport?.push("Bank Account Number")
            }
            if (formValue.ifscCode) {
                exportRequest.columnsToExport?.push("IFSC Code")
            }
            if (formValue.beneficiaryName) {
                exportRequest.columnsToExport?.push("Beneficiary Name")
            }
            if (formValue.branchName) {
                exportRequest.columnsToExport?.push("Branch Name")
            }
            if (formValue.swiftCode) {
                exportRequest.columnsToExport?.push("Swift Code")
            }
            this.isLoading = true;
            this.ledgerService.exportData(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                if (response?.status === "success") {
                    this.toaster.showSnackBar("success", response?.body);
                    this.closeExportGroupLedgerModal.emit();
                    this.router.navigate(['pages/downloads'])
                } else {
                    this.toaster.showSnackBar("error", response?.body);
                }
            });
            // for close master dialog
            this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
            document.querySelector('body')?.classList?.remove('master-page');
        }
    }

    public onSelectDateRange(ev) {
        this.dateRange.from = dayjs(ev.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = dayjs(ev.picker.endDate).format(GIDDH_DATE_FORMAT);
    }

    /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof ExportGroupLedgerComponent
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
     * @memberof ExportGroupLedgerComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ExportGroupLedgerComponent
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
}
