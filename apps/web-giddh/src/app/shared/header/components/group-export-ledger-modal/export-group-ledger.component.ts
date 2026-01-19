import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some, cloneDeep } from '../../../../lodash-optimized';
import { ExportColumnsHelper } from '../../../helpers/export-columns.helper';
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

/**
 * Handles Component functionality
 */
@Component({
    selector: 'export-group-ledger',
    templateUrl: './export-group-ledger.component.html',
    styleUrls: ['./export-group-ledger.component.scss'],
    standalone: false
})

/**
 * ExportGroupLedgerComponent component
 * Handles exportgroupledger functionality and user interactions
 */
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
        showEntryVoucherNo: false
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private _permissionDataService: PermissionDataService, private generalService: GeneralService,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private groupWithAccountsAction: GroupWithAccountsAction) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        // Set a default date
        this.dateRange.from = dayjs(dayjs().subtract(30, 'day')).format(GIDDH_DATE_FORMAT);
        this.dateRange.to = dayjs(dayjs()).format(GIDDH_DATE_FORMAT);

        /**
         * Handles if functionality
         */
        if (this._permissionDataService.getData && this._permissionDataService.getData.length > 0) {
            (Array.isArray(this._permissionDataService.getData) ? this._permissionDataService.getData : []).forEach(f => {
                /**
                 * Handles if functionality
                 */
                if (f.name === 'LEDGER') {
                    let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                    this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                    this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                    this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
                }
            });
        }

        this.universalDate$.subscribe(dateObj => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
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
        /**
         * Handles if functionality
         */
        if (this.exportType === 'ledger') {
            this.exportRequest.from = this.fromDate;
            this.exportRequest.to = this.toDate;
            this.closeExportGroupLedgerModal.emit({ from: this.fromDate, to: this.toDate, type: this.emailTypeSelected, fileType: this.fileType, order: this.order, body: this.exportRequest });
        } else {
            let exportRequest: ExportBodyRequest = new ExportBodyRequest();
            exportRequest.exportType = "MASTER_EXPORT";
            exportRequest.groupUniqueNames = [this.activeGroupUniqueName];
            exportRequest.columnsToExport = ExportColumnsHelper.buildColumnsToExport(this.exportFormValue);
            this.isLoading = true;
            this.ledgerService.exportData(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                /**
                 * Handles if functionality
                 */
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

    /**
     * Handles selectdaterange event
     */
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
        /**
         * Handles if functionality
         */
        if (this.universalDatepickerTrigger) {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
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
