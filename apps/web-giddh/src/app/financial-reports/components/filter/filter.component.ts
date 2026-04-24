import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import * as dayjs from 'dayjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, IOption } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { ToasterService } from '../../../services/toaster.service';
import { IForceClear } from '../../../models/api-models/Sales';
import { ServiceConfig } from '../../../services/service.config';
import { ReportType } from '../../../multi-currency-reports/multi-currency.const';
import { FinancialReportsComponentStore } from '../../financial-reports.store';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { TlPlService } from '../../../services/tl-pl.service';
import { cloneDeep, find, findIndex, get, map, orderBy } from '../../../lodash-optimized';

@Component({
selector: 'financial-filter',
    templateUrl: './filter.component.html',
    styleUrls: [`./filter.component.scss`],
    providers: [FinancialReportsComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FinancialReportsFilterComponent implements OnInit, OnDestroy {
    public today: Date = new Date();
    public selectedDateOption: string = '0';
    public filterForm: UntypedFormGroup;
    public search: string = '';
    public financialOptions: IOption[] = [];
    public accountSearchControl: UntypedFormControl = new UntypedFormControl();
    public tags: IOption[] = [];
    public selectedTag: string;
    @Input() public tbExportXLS: boolean = false;
    @Input() public tbExportCsv: boolean = false;
    @Input() public plBsExportXLS: boolean = false;
    @Input() public BsExportXLS: boolean = false;
    @Output() public seachChange = new EventEmitter<string>();
    @Output() public tbExportXLSEvent = new EventEmitter<string>();
    @Output() public tbExportCsvEvent = new EventEmitter<string>();
    @Output() public plBsExportXLSEvent = new EventEmitter<string>();
    /** True, when expand all operation is performed */
    @Input() public expandAll: boolean;
    /** Controls the visibility of the button and branch fitter for project wise accounting.  */
    @Input() public isProjectWiseAccounting: boolean = false;
    @Output()
    public expandAllChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    public showClearSearch: boolean;
    public request: TrialBalanceRequest = {};
    public dateOptions: IOption[] = [];
    public imgPath: string;
    public universalDateICurrent: boolean = false;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    @Input() public showLoader: boolean = true;
    @Input() public showLabels: boolean = false;
    @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
    /** Emits true to show Tally Report options */
    @Output() public showReportTally = new EventEmitter<boolean>();
    public universalDate$: Observable<any>;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
/** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** dayjs object */
    public dayjs = dayjs;
    public selectedRangeLabel: any = "";
    public currentOrganizationType: OrganizationType;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** True if show Tally Report options */
    public isReconciled: boolean | null = null;
    /** Holds reconcile date range */
    public isReconcileModeDateRange: string = null;
    /** True if show reconcile options */
    public showReconcileOptions: boolean = false;
    /** True if show confirmation on date change */
    public showConfirmationOnDateChange: boolean = false;
    /** From date for datepicker */
    public fromDate: string;
    /** To date for datepicker */
    public toDate: string;
    /** Holds voucher api version */
    public voucherApiVersion: number;

    constructor(
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsTagService: SettingsTagService,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private toaster: ToasterService,
        @Inject(ServiceConfig) private serviceConfig,
        private componentStore: FinancialReportsComponentStore,
        private dialog: MatDialog,
        private tlPlService: TlPlService
    ) {
        this.filterForm = this.fb.group({
            from: [''],
            to: [''],
            fy: [''],
            selectedDateOption: ['1'],
            branchUniqueName: [this.generalService.currentBranchUniqueName ?? ''],
            selectedFinancialYearOption: [''],
            refresh: [false],
            tagName: [''],
            compareValue: [null],
            compareType: [null]
        });

        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    public get selectedCompany() {
        return this._selectedCompany;
    }

    /**
     * init form and other properties from input company
     *
     * @memberof FinancialReportsFilterComponent
     */
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        if (!value) {
            return;
        }
        this._selectedCompany = value;
        this.financialOptions = value.financialYears.map(q => {
            return { label: q?.uniqueName, value: q?.uniqueName };
        });

        if (this.filterForm.get('selectedDateOption')?.value === '0' && value.activeFinancialYear) {
            this.filterForm?.patchValue({
                to: value.activeFinancialYear.financialYearEnds,
                from: value.activeFinancialYear.financialYearStarts,
                selectedFinancialYearOption: value.activeFinancialYear?.uniqueName
            });
        }
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(state => state.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.getTags();
        if (!this.isProjectWiseAccounting) {
            this.componentStore.reconcileDateRange$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    const fromDate = dayjs(response.fromDate).format(GIDDH_DATE_FORMAT);
                    const toDate = dayjs(response.toDate).format(GIDDH_DATE_FORMAT);
                    this.isReconcileModeDateRange = fromDate + ' - ' + toDate;
                    const isSameDateRange = this.isSameDateRange(fromDate, toDate);
                    this.showReconcileOptions = isSameDateRange;
                    this.showConfirmationOnDateChange = isSameDateRange;
                    this.showTallyReportOptions(isSameDateRange);
                    this.cd.detectChanges();
                } else if (response === null) {
                    this.showConfirmationOnDateChange = false;
                    this.isReconcileModeDateRange = null;
                    this.showReconcileOptions = true;
                    this.cd.detectChanges();
                }
            });

            this.tlPlService.isReportTailed$.pipe(
                filter(response => response !== null && response !== undefined),
                debounceTime(200),
                takeUntil(this.destroyed$)
            ).subscribe(() => {
                this.getReconcileDateRange();
            });
        }

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.imgPath = this.serviceConfig.IMG_PATH.replace('images/', 'icon/');
        if (!this.showLabels) {
            this.filterForm?.patchValue({ selectedDateOption: '0' });
        }
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.search = newValue;
                this.seachChange.emit(this.search);
                this.cd.detectChanges();
            });

        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            if (a) {
                this.universalDateICurrent = false;
                // assign dates

                this.filterForm?.patchValue({
                    from: dayjs(a[0]).format(GIDDH_DATE_FORMAT),
                    to: dayjs(a[1]).format(GIDDH_DATE_FORMAT)
                });

                // if filter type is not date picker then set filter as datepicker
                if (this.filterForm.get('selectedDateOption')?.value === '0') {
                    this.filterForm?.patchValue({
                        selectedDateOption: '1'
                    });
                }

                if (!this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
                /** To set local datepicker */
                let universalDate = cloneDeep(a);
                this.selectedDateRange = { startDate: dayjs(a[0]), endDate: dayjs(a[1]) };
                this.selectedDateRangeUi = dayjs(a[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(a[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.filterData();
            }
        });
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany?.uniqueName !== this.activeCompany?.uniqueName) {
                this.activeCompany = activeCompany;
            }
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response?.length) {
                this.filterForm.get('branchUniqueName').setValue("");
                this.forceClear$ = observableOf({ status: true });
                this.currentCompanyBranches = [];
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany?.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
                this.generalService.currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                this.filterForm.get('branchUniqueName').setValue(this.generalService.currentBranchUniqueName);
                this.filterForm.updateValueAndValidity();
                this.cd.detectChanges();
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
        this.isReconciled = false;
    }

    public setCurrentFY() {
        // set financial years based on company financial year
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && this.universalDateICurrent) {
                let activeFinancialYear = activeCompany.activeFinancialYear;
                if (activeFinancialYear) {
                    // assign dates
                    this.filterForm?.patchValue({
                        from: dayjs(activeFinancialYear.financialYearStarts, GIDDH_DATE_FORMAT).startOf('day').format(GIDDH_DATE_FORMAT),
                        to: dayjs().format(GIDDH_DATE_FORMAT)
                    });
                }
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectedDate(value: any) {
        this.filterForm.controls['from'].setValue(dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT));
        this.filterForm.controls['to'].setValue(dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT));
    }

    public selectFinancialYearOption(v: IOption) {
        if (v.value) {
            let financialYear = this._selectedCompany.financialYears.find(p => p?.uniqueName === v.value);
            if (this.showConfirmationOnDateChange && !this.isSameDateRange(financialYear?.financialYearStarts, financialYear?.financialYearEnds)) {
                //show confirmation dialog
                const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                    panelClass: ['mat-dialog-sm'],
                    data: {
                        configuration: this.generalService.deleteConfiguration(this.localeData?.reconcile_mode_turned_off_message, this.commonLocaleData)
                    }
                });
                dialogRef.afterClosed().subscribe((response) => {
                    if (response === this.commonLocaleData?.app_yes) {
                        const index = this._selectedCompany.financialYears?.findIndex(p => p?.uniqueName === v.value);
                        if (financialYear) {
                            this.filterForm?.patchValue({
                                to: financialYear.financialYearEnds,
                                from: financialYear.financialYearStarts,
                                fy: index === 0 ? 0 : index * -1
                            });

                            this.toDate = financialYear.financialYearEnds;
                            this.fromDate = financialYear.financialYearStarts;
                            this.filterForm.get('selectedFinancialYearOption').patchValue(v.value);
                            this.showTallyReportOptions(false);
                            this.filterData();
                        }
                    } else {
                        this.filterForm?.get('selectedDateOption').patchValue('1');
                        this.cd.detectChanges();
                    }
                });
            } else {
                const index = this._selectedCompany.financialYears?.findIndex(p => p?.uniqueName === v.value);
                if (financialYear) {
                    this.filterForm?.patchValue({
                        to: financialYear.financialYearEnds,
                        from: financialYear.financialYearStarts,
                        fy: index === 0 ? 0 : index * -1
                    });
                    this.toDate = financialYear.financialYearEnds;
                    this.fromDate = financialYear.financialYearStarts;
                    this.filterForm.get('selectedFinancialYearOption').patchValue(v.value);
                }
            }
        } else {
            this.filterForm?.patchValue({
                to: '',
                from: '',
                fy: ''
            });
            this.toDate = '';
            this.fromDate = '';
        }
    }

    /**
     * Checks if the date range is the same
     *
     * @param {string} from
     * @param {string} to
     * @returns {boolean}
     * @memberof FinancialReportsFilterComponent
     */
    private isSameDateRange(from: string, to: string): boolean {
        if (!from || !to) {
            return false;
        }
        return this.filterForm.get('from')?.value === from && this.filterForm.get('to')?.value === to;
    }

    public filterData() {
        this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption']?.value);
        this.onPropertyChanged.emit(this.filterForm?.value);
        // this will clear the search and reset it after we click apply --G0-2745
        let a = this.search = '';
        this.seachChange.emit(a);
        this.getReconcileDateRange();
    }

    public refreshData() {
        this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption']?.value);
        let data = cloneDeep(this.filterForm?.value);
        let a = this.search = '';
        this.seachChange.emit(a);
        data.refresh = true;
        this.onPropertyChanged.emit(data);
        this.emitExpand(false);
    }

    public setFYFirstTime(selectedFY: string) {
        if (selectedFY) {
            let inx = this._selectedCompany.financialYears?.findIndex(p => p?.uniqueName === selectedFY);
            if (inx !== -1) {
                this.filterForm?.patchValue({
                    fy: inx === 0 ? 0 : inx * -1
                });
            }
        }
    }

    /**
     * Gets the list of tags
     *
     * @memberof FinancialReportsFilterComponent
     */
    public getTags(): void {
        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success") {
                this.tags = orderBy(response?.body, 'name')?.map(tag => {
                    return { label: tag?.name, value: tag?.name };
                }) as IOption[];
                this.cd.detectChanges();
            }
        });
    }

    /**
     * Emit Expand
     *
     * @param {boolean} event
     * @memberof FinancialReportsFilterComponent
     */
    public emitExpand(event: boolean) {
        setTimeout(() => {
            this.expandAllChange.emit(event);
        }, 10);
    }

    public onTagSelected(ev) {
        this.selectedTag = ev?.value;
        this.filterForm.get('tagName')?.patchValue(ev?.value);
        this.filterForm.get('refresh')?.patchValue(true);
        this.onPropertyChanged.emit(this.filterForm?.value);
    }

    /**
     * Date option selected handler
     *
     * @param {IOption} event
     * @memberof FinancialReportsFilterComponent
     */
    public dateOptionIsSelected(event: IOption): void {
        if (event) {
            if (event.value === '0') {
                this.selectFinancialYearOption(this.financialOptions[0]);
            } else {
                const fromDate = dayjs(this.selectedDateRange.startDate).format(GIDDH_DATE_FORMAT);
                const toDate = dayjs(this.selectedDateRange.endDate).format(GIDDH_DATE_FORMAT);
                if (this.showConfirmationOnDateChange && !this.isSameDateRange(fromDate, toDate)) {
                    const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                        panelClass: ['mat-dialog-sm'],
                        data: {
                            configuration: this.generalService.deleteConfiguration(this.localeData?.reconcile_mode_turned_off_message, this.commonLocaleData)
                        }
                    });
                    dialogRef.afterClosed().subscribe((response) => {
                        if (response === this.commonLocaleData?.app_yes) {
                            this.filterForm?.patchValue({
                                from: fromDate,
                                to: toDate
                            });
                            this.fromDate = fromDate;
                            this.toDate = toDate;
                            this.showTallyReportOptions(false);
                            this.filterData();
                        } else {
                            this.filterForm?.get('selectedDateOption').patchValue('0');
                            this.cd.detectChanges();
                        }
                    });
                } else {
                    this.filterForm?.patchValue({
                        from: fromDate,
                        to: toDate
                    });
                    this.fromDate = fromDate;
                    this.toDate = toDate;
                }
            }
        }
    }

    /**
     * Branch change handler
     *
     * @memberof FinancialReportsFilterComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.generalService.currentBranchUniqueName = selectedEntity?.value;
        setTimeout(() => {
            this.expandAllChange.emit(false);
        }, 10);
        this.onPropertyChanged.emit(this.filterForm?.value);
    }

    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen
     * @param {*} element
     * @memberof FinancialReportsFilterComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean, element?: any): void {
        if (isOpen && this.universalDatepickerTrigger) {
            this.universalDatepickerTrigger?.openMenu();
        } else if (!isOpen && this.universalDatepickerTrigger) {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof FinancialReportsFilterComponent
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
            const isDifferentDate = !this.isSameDateRange(value.startDate, value.endDate);

            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.filterForm.controls['from'].setValue(this.fromDate);
            this.filterForm.controls['to'].setValue(this.toDate);
            if (isDifferentDate) {
                this.showTallyReportOptions(false);
                this.filterData();
            }
        }
    }

    /**
     * Handle compare with event
     *
     * @param {any} event
     * @memberof FinancialReportsFilterComponent
     */
    public handleCompareWithEvent(event: any): void {
        this.filterForm.patchValue(event);
    }

    /**
     * Show Tally Report options
     *
     * @param {boolean} showReconcileOptions
     * @memberof FinancialReportsFilterComponent
     */
    public showTallyReportOptions(showReconcileOptions?: boolean): void {
        if (showReconcileOptions !== undefined) {
            this.isReconciled = showReconcileOptions;
        } else {
            this.isReconciled = !this.isReconciled;
        }
        this.showReportTally.emit(this.isReconciled);
    }

    /**
     * Get reconcile mode date range
     *
     * @memberof FinancialReportsFilterComponent
     */
    public getReconcileDateRange(): void {
        if (this.isProjectWiseAccounting) {
            return;
        }
        let reportType = ReportType.TRIAL_BALANCE;
        if (this.BsExportXLS) {
            reportType = ReportType.BALANCE_SHEET;
        } else if (this.plBsExportXLS) {
            reportType = ReportType.PROFIT_LOSS;
        }
        this.componentStore.getReconcileDateRange({ reportType, branchUniqueName: this.generalService.currentBranchUniqueName });
    }

    /**
     * Go to reconcile mode date range
     *
     * @memberof FinancialReportsFilterComponent
     */
    public goToReconcileDateRange(): void {
        this.componentStore.reconcileDateRange$.pipe(take(1)).subscribe(response => {
            if (response) {
                const fromDate = dayjs(response.fromDate).format(GIDDH_DATE_FORMAT);
                const toDate = dayjs(response.toDate).format(GIDDH_DATE_FORMAT);
                // Update selected date range to universal date picker
                this.selectedDateRange = { startDate: dayjs(response.fromDate), endDate: dayjs(response.toDate) };
                this.selectedDateRangeUi = dayjs(response.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);

                // Update form values
                this.filterForm.get('from').patchValue(fromDate);
                this.filterForm.get('to').patchValue(toDate);
                this.filterForm?.get('selectedDateOption').patchValue('1');

                // Trigger filter
                this.filterData();
                this.cd.detectChanges();
            }
        });
    }

    /**
     * Callback when translation is complete
     *
     * @param {boolean} event
     * @memberof FinancialReportsFilterComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.cd.detectChanges();
            this.dateOptions = [
                { label: this.commonLocaleData?.app_date_range, value: '1' },
                { label: this.commonLocaleData?.app_financial_year, value: '0' }
            ];
        }
    }
}
