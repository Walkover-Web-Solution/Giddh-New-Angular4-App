import { distinctUntilChanged, takeUntil, take } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-select/option.interface';
import * as dayjs from 'dayjs';
import { CompanyImportExportFileTypes } from '../../../models/interfaces/company-import-export.interface';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { CompanyImportExportService } from '../../../services/company-import-export-service';
import { ToasterService } from '../../../services/toaster.service';
import { saveAs } from 'file-saver';

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
    public from: string = dayjs().subtract(30, 'day').format(GIDDH_DATE_FORMAT);
    public to: string = dayjs().format(GIDDH_DATE_FORMAT);
    public selectedFile: File = null;
    public isExportInProcess$: Observable<boolean>;
    public isImportInProcess$: Observable<boolean>;
    public isImportSuccess$: Observable<boolean>;
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
        private store: Store<AppState>,
        private companyImportExportService: CompanyImportExportService,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private settingsBranchAction: SettingsBranchActions,
        private changeDetectorRef: ChangeDetectorRef,
        private toaster: ToasterService
    ) {
        this.universalDate$ = this.store.pipe(select(sessionStore => sessionStore.session.applicationDate), distinctUntilChanged(), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        this.fileTypes = [
            { label: this.localeData?.file_types.accounting_entries, value: CompanyImportExportFileTypes.ACCOUNTING_ENTRIES?.toString() },
            { label: this.localeData?.file_types.master, value: CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS?.toString() }
        ];

        this.currentOrganizationType = this.generalService.currentOrganizationType;

        this.universalDate$.subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
            this.changeDetectorRef.detectChanges();
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response?.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                const hoBranch = response.find(branch => !branch.parentBranch);
                const currentBranchUniqueName = this.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : hoBranch ? hoBranch?.uniqueName : '';
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    public selectedDate(value: any) {
        this.from = dayjs(value.picker.startDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        this.to = dayjs(value.picker.endDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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
            this.isExportInProcess$ = of(true);

            if(parseInt(this.fileType) === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                this.companyImportExportService.ExportRequest(this.currentBranch?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success') {
                        let res = { body: response?.body };
                        let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                        saveAs(blob, `${this.currentBranch.name}_Master_Except_Accounts_${this.from}_${this.to}_${this.activeCompany?.uniqueName}` + '.json');
                        this.toaster.successToast(this.commonLocaleData?.app_messages?.data_exported);
                        this.backButtonPressed();
                    } else {
                        this.toaster.errorToast(response.message);
                    }
                    this.isExportInProcess$ = of(false);
                });
            } else {
                this.companyImportExportService.ExportLedgersRequest(this.from, this.to, this.currentBranch?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success' && response?.body) {
                        if (response?.body?.type === "message") {
                            this.toaster.successToast(response?.body?.file);
                        } else {
                            let res = { body: response?.body?.file };
                            let blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
                            saveAs(blob, `${this.currentBranch?.name}_Accounting_Entries_${this.from}_${this.to}_${this.activeCompany?.uniqueName}` + '.json');
                            this.toaster.successToast(this.commonLocaleData?.app_messages?.data_exported);
                            this.backButtonPressed();
                        }
                    } else {
                        this.toaster.errorToast(response?.message);
                    }
                    this.isExportInProcess$ = of(false);
                });
            }
        } else {
            this.isImportInProcess$ = of(true);

            if(parseInt(this.fileType) === CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS) {
                this.companyImportExportService.ImportRequest(this.selectedFile, this.currentBranch?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.handleImportEntriesResponse(response);
                });
            } else {
                this.companyImportExportService.ImportLedgersRequest(this.selectedFile).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.handleImportEntriesResponse(response);
                });
            }
        }
    }

    public backButtonPressed() {
        this.backPressed.emit(true);
    }

    public ngOnDestroy(): void {
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
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

    /**
     * This will handle import entries response
     *
     * @private
     * @param {*} response
     * @memberof CompanyImportExportFormComponent
     */
    private handleImportEntriesResponse(response: any): void {
        if (response?.status === 'success') {
            this.toaster.successToast(response?.body);
            this.backButtonPressed();
        } else {
            this.toaster.errorToast(response?.message);
        }
        this.isImportInProcess$ = of(false);
    }
}
