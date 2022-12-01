import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import * as dayjs from 'dayjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { BreakpointObserver } from '@angular/cdk/layout';
import { cloneDeep, map, orderBy } from '../../../lodash-optimized';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { ToasterService } from '../../../services/toaster.service';
import { IForceClear } from '../../../models/api-models/Sales';

@Component({
    selector: 'financial-filter',
    templateUrl: './filter.component.html',
    styleUrls: [`./filter.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialReportsFilterComponent implements OnInit, OnDestroy {
    public today: Date = new Date();
    public selectedDateOption: string = '0';
    public filterForm: FormGroup;
    public search: string = '';
    public financialOptions: IOption[] = [];
    public accountSearchControl: FormControl = new FormControl();
    public tags: TagRequest[] = [];
    public selectedTag: string;
    @Input() public tbExportPdf: boolean = false;
    @Input() public tbExportXLS: boolean = false;
    @Input() public tbExportCsv: boolean = false;
    @Input() public plBsExportXLS: boolean = false;
    @Input() public BsExportXLS: boolean = false;
    @Output() public seachChange = new EventEmitter<string>();
    @Output() public tbExportPdfEvent = new EventEmitter<string>();
    @Output() public tbExportXLSEvent = new EventEmitter<string>();
    @Output() public tbExportCsvEvent = new EventEmitter<string>();
    @Output() public plBsExportXLSEvent = new EventEmitter<string>();
    /** True, when expand all operation is performed */
    @Input() public expandAll: boolean;
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
    /** True, if mobile screen size is detected */
    public isMobileScreen: boolean = true;
    @Input() public showLoader: boolean = true;
    @Input() public showLabels: boolean = false;
    @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
    @ViewChild('createTagModal', { static: true }) public createTagModal: ModalDirective;
    public universalDate$: Observable<any>;
    public newTagForm: FormGroup;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** dayjs object */
    public dayjs = dayjs;
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });

    constructor(private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsTagService: SettingsTagService,
        private generalService: GeneralService,
        private breakPointObservar: BreakpointObserver,
        private settingsBranchAction: SettingsBranchActions,
        private modalService: BsModalService,
        private toaster: ToasterService
    ) {
        this.filterForm = this.fb.group({
            from: [''],
            to: [''],
            fy: [''],
            selectedDateOption: ['1'],
            branchUniqueName: [this.generalService.currentBranchUniqueName ?? ''],
            selectedFinancialYearOption: [''],
            refresh: [false],
            tagName: ['']
        });

        this.newTagForm = this.fb.group({
            name: ['', Validators.required],
            description: []
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

        if (this.filterForm.get('selectedDateOption').value === '0' && value.activeFinancialYear) {
            this.filterForm?.patchValue({
                to: value.activeFinancialYear.financialYearEnds,
                from: value.activeFinancialYear.financialYearStarts,
                selectedFinancialYearOption: value.activeFinancialYear?.uniqueName
            });
        }
    }

    public ngOnInit() {
        this.getTags();

        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
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

        this.universalDate$.subscribe((a) => {
            if (a) {
                this.universalDateICurrent = false;
                // assign dates

                this.filterForm?.patchValue({
                    from: dayjs(a[0]).format(GIDDH_DATE_FORMAT),
                    to: dayjs(a[1]).format(GIDDH_DATE_FORMAT)
                });

                // if filter type is not date picker then set filter as datepicker
                if (this.filterForm.get('selectedDateOption').value === '0') {
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
            if(activeCompany?.uniqueName !== this.activeCompany?.uniqueName) {
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
                    label: branch.alias,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
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
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
                this.filterForm.get('branchUniqueName').setValue(this.currentBranch?.uniqueName);
                this.filterForm.updateValueAndValidity();
                this.cd.detectChanges();
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });
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
        this.filterData();
    }

    public selectFinancialYearOption(v: IOption) {
        if (v.value) {
            let financialYear = this._selectedCompany.financialYears.find(p => p?.uniqueName === v.value);
            let index = this._selectedCompany.financialYears.findIndex(p => p?.uniqueName === v.value);
            if (financialYear) {
                this.filterForm?.patchValue({
                    to: financialYear.financialYearEnds,
                    from: financialYear.financialYearStarts,
                    fy: index === 0 ? 0 : index * -1
                });
            }
        } else {
            this.filterForm?.patchValue({
                to: '',
                from: '',
                fy: ''
            });
        }
        this.filterData();
    }

    public filterData() {
        this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption'].value);
        this.onPropertyChanged.emit(this.filterForm.value);
        // this will clear the search and reset it after we click apply --G0-2745
        let a = this.search = '';
        this.seachChange.emit(a);
    }

    public refreshData() {
        this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption'].value);
        let data = cloneDeep(this.filterForm.value);
        data.refresh = true;
        this.onPropertyChanged.emit(data);
        this.emitExpand(false);
    }

    public setFYFirstTime(selectedFY: string) {
        if (selectedFY) {
            let inx = this._selectedCompany.financialYears.findIndex(p => p?.uniqueName === selectedFY);
            if (inx !== -1) {
                this.filterForm?.patchValue({
                    fy: inx === 0 ? 0 : inx * -1
                });
            }
        }
    }

    public toggleTagsModal() {
        this.createTagModal.toggle();
    }

    public createTag() {
        this.settingsTagService.CreateTag(this.newTagForm.getRawValue()).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.toaster.clearAllToaster();
            if (response?.status === "success") {
                this.getTags();
                this.toaster.successToast(this.commonLocaleData?.app_messages?.tag_created, this.commonLocaleData?.app_success);
            } else {
                this.toaster.errorToast(response?.message, response?.code);                
            }
        });
        this.toggleTagsModal();
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
        this.selectedTag = ev.value;
        this.filterForm.get('tagName')?.patchValue(ev.value);
        this.filterForm.get('refresh')?.patchValue(true);
        this.onPropertyChanged.emit(this.filterForm.value);
    }

    public dateOptionIsSelected(ev) {
        if (ev) {
            if (ev.value === '0') {
                this.selectFinancialYearOption(this.financialOptions[0]);
            } else {
                this.filterForm?.patchValue({
                    from: dayjs(this.datePickerOption.startDate).format(GIDDH_DATE_FORMAT),
                    to: dayjs(this.datePickerOption.endDate).format(GIDDH_DATE_FORMAT)
                });
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
        setTimeout(() => {
            this.expandAllChange.emit(false);
        }, 10);
        this.onPropertyChanged.emit(this.filterForm.value);
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof FinancialReportsFilterComponent
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
     * @memberof FinancialReportsFilterComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof FinancialReportsFilterComponent
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
            this.filterForm.controls['from'].setValue(this.fromDate);
            this.filterForm.controls['to'].setValue(this.toDate);
            this.filterData();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof FinancialReportsFilterComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.dateOptions = [
                { label: this.commonLocaleData?.app_date_range, value: '1' },
                { label: this.commonLocaleData?.app_financial_year, value: '0' }
            ];
        }
    }

    /**
     * Fetching list of tags
     *
     * @memberof FinancialReportsFilterComponent
     */
    public getTags(): void {
        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                map(response?.body, (tag) => {
                    tag.value = tag.name;
                    tag.label = tag.name;
                });
                this.tags = orderBy(response?.body, 'name');
            }
        });
    }
}
