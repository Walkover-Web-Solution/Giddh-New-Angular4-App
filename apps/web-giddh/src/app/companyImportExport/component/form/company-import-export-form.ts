import { distinctUntilChanged, takeUntil, take } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-select/option.interface';
import * as moment from 'moment';
import { CompanyImportExportFileTypes } from '../../../models/interfaces/companyImportExport.interface';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { CompanyImportExportActions } from '../../../actions/company-import-export/company-import-export.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';

@Component({
    selector: 'company-import-export-form-component',
    templateUrl: 'company-import-export-form.html',
    styleUrls: [`./company-import-export-form.scss`],
})

export class CompanyImportExportFormComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input('mode') public mode: 'export' | 'import' = 'export';
    @Output('backPressed') public backPressed: EventEmitter<boolean> = new EventEmitter();
    public fileTypes: IOption[] = [];
    public fileType: string = '';
    public from: string = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
    public to: string = moment().format(GIDDH_DATE_FORMAT);
    public selectedFile: File = null;

    public isExportInProcess$: Observable<boolean>;
    public isExportSuccess$: Observable<boolean>;
    public isImportInProcess$: Observable<boolean>;
    public isImportSuccess$: Observable<boolean>;
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
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _store: Store<AppState>,
        private _companyImportExportActions: CompanyImportExportActions,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private settingsBranchAction: SettingsBranchActions,
        private changeDetectorRef: ChangeDetectorRef) {
        this.isExportInProcess$ = this._store.pipe(select(s => s.companyImportExport.exportRequestInProcess), takeUntil(this.destroyed$));
        this.isExportSuccess$ = this._store.pipe(select(s => s.companyImportExport.exportRequestSuccess), takeUntil(this.destroyed$));
        this.isImportInProcess$ = this._store.pipe(select(s => s.companyImportExport.importRequestInProcess), takeUntil(this.destroyed$));
        this.isImportSuccess$ = this._store.pipe(select(s => s.companyImportExport.importRequestSuccess), takeUntil(this.destroyed$));
        this.universalDate$ = this._store.pipe(select(sessionStore => sessionStore.session.applicationDate), distinctUntilChanged(), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        this.fileTypes = [
            { label: this.localeData?.file_types.accounting_entries, value: CompanyImportExportFileTypes.ACCOUNTING_ENTRIES.toString() },
            { label: this.localeData?.file_types.master, value: CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS.toString() }
        ];

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.isExportSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });

        this.isImportSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });
        this.universalDate$.subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
            this.changeDetectorRef.detectChanges();
        });
        this._store.pipe(
            select(state => state.session.activeCompany), take(1)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this._store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                const hoBranch = response.find(branch => !branch.parentBranch);
                const currentBranchUniqueName = this.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : hoBranch ? hoBranch.uniqueName : '';
                if (!this.currentBranch.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                    this.currentBranch.name = this.currentBranch.name + (this.currentBranch.alias ? ` (${this.currentBranch.alias})` : '');
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this._store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });
    }

    public selectedDate(value: any) {
        this.from = moment(value.picker.startDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        this.to = moment(value.picker.endDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
    }

    public fileSelected(file: File) {
        if (file && file[0]) {
            this.selectedFile = file[0];
        } else {
            this.selectedFile = null;
        }
    }

    public save() {
        if (this.mode === 'export') {
            this._store.dispatch(this._companyImportExportActions.ExportRequest(parseInt(this.fileType), this.from, this.to, this.currentBranch.uniqueName, this.currentBranch.name));
        } else {
            this._store.dispatch(this._companyImportExportActions.ImportRequest(parseInt(this.fileType), this.selectedFile, this.currentBranch.uniqueName));
        }
    }

    public backButtonPressed() {
        this.backPressed.emit(true);
    }

    public ngOnDestroy(): void {
        this._store.dispatch(this._companyImportExportActions.ResetCompanyImportExportState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof CompanyImportExportFormComponent
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
     * @memberof CompanyImportExportFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof CompanyImportExportFormComponent
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
            this.from = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.to = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Branch change handler
     *
     * @memberof CompanyImportExportFormComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
    }
}
