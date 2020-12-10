import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';
import { createSelector } from 'reselect';
import { Observable, ReplaySubject } from 'rxjs';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';

@Component({
    selector: 'tb-pl-bs-filter',  // <home></home>
    templateUrl: './tb-pl-bs-filter.component.html',
    styleUrls: [`./tb-pl-bs-filter.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy, OnChanges {
    public today: Date = new Date();
    public selectedDateOption: string = '0';
    public filterForm: FormGroup;
    public search: string = '';
    public financialOptions: IOption[] = [];
    public accountSearchControl: FormControl = new FormControl();
    public tags$: Observable<TagRequest[]>;
    public selectedTag: string;
    public datePickerOptions: any = {
        hideOnEsc: true,
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'Last 1 Day': [
                moment().subtract(1, 'days'),
                moment()
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days'),
                moment()
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days'),
                moment()
            ],
            'Last 6 Months': [
                moment().subtract(6, 'months'),
                moment()
            ],
            'Last 1 Year': [
                moment().subtract(12, 'months'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year'),
                moment()
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
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
    // public expandAll?: boolean = null;
    @Output()
    public expandAll: EventEmitter<boolean> = new EventEmitter<boolean>();
    public showClearSearch: boolean;
    public request: TrialBalanceRequest = {};
    public expand: boolean = false;
    public dateOptions: IOption[] = [{label: 'Date Range', value: '1'}, {label: 'Financial Year', value: '0'}];
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
    @ViewChild('createTagModal', {static: true}) public createTagModal: ModalDirective;

    public universalDate$: Observable<any>;
    public newTagForm: FormGroup;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;

    constructor(private fb: FormBuilder,
                private cd: ChangeDetectorRef,
                private store: Store<AppState>,
                private _settingsTagActions: SettingsTagActions,
                private settingsBranchAction: SettingsBranchActions,
                private generalService: GeneralService) {
        this.filterForm = this.fb.group({
            from: [''],
            to: [''],
            fy: [''],
            selectedDateOption: ['1'],
            branchUniqueName: [],
            selectedFinancialYearOption: [''],
            refresh: [false],
            tagName: ['']
        });

        this.newTagForm = this.fb.group({
            name: ['', Validators.required],
            description: []
        });

        this.store.dispatch(this._settingsTagActions.GetALLTags());
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$), distinctUntilChanged());

    }

    public get selectedCompany() {
        return this._selectedCompany;
    }

    // init form and other properties from input company
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        if (!value) {
            return;
        }
        this._selectedCompany = value;
        this.financialOptions = value.financialYears.map(q => {
            return {label: q.uniqueName, value: q.uniqueName};
        });

        if (this.filterForm.get('selectedDateOption').value === '0' && value.activeFinancialYear) {
            this.datePickerOptions = {
                ...this.datePickerOptions, startDate: moment(value.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY'),
                endDate: moment(value.activeFinancialYear.financialYearEnds, 'DD-MM-YYYY')
            };

            // this.assignStartAndEndDateForDateRangePicker(value.activeFinancialYear.financialYearStarts, value.activeFinancialYear.financialYearEnds);

            this.filterForm.patchValue({
                to: value.activeFinancialYear.financialYearEnds,
                from: value.activeFinancialYear.financialYearStarts,
                selectedFinancialYearOption: value.activeFinancialYear.uniqueName
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // if (changes['needToReCalculate']) {
        //   this.calculateTotal();
        // }
    }

    public ngOnInit() {

        this.imgPath = (isElectron|| isCordova) ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
        //
        if (!this.showLabels) {
            this.filterForm.patchValue({selectedDateOption: '0'});
        }
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700))
            .subscribe((newValue) => {
                this.search = newValue;
                this.seachChange.emit(this.search);
                this.cd.detectChanges();
            });

        this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
            if (tags && tags.length) {
                _.map(tags, (tag) => {
                    tag.value = tag.name;
                    tag.label = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })).pipe(takeUntil(this.destroyed$));

        this.universalDate$.subscribe((a) => {
            if (a) {
                let date = _.cloneDeep(a);
                if (date[0].getDate() === (new Date().getDate() + 1) && date[1].getDate() === new Date().getDate()) {
                    this.universalDateICurrent = true;
                    this.setCurrentFY();
                } else {
                    this.universalDateICurrent = false;
                    this.datePickerOptions = { ...this.datePickerOptions, startDate: date[0], endDate: date[1], chosenLabel: date[2] };

                    // assign dates
                    // this.assignStartAndEndDateForDateRangePicker(date[0], date[1]);

                    this.filterForm.patchValue({
                        from: moment(a[0]).format('DD-MM-YYYY'),
                        to: moment(a[1]).format('DD-MM-YYYY')
                    });
                }

                // if filter type is not date picker then set filter as datepicker
                if (this.filterForm.get('selectedDateOption').value === '0') {
                    this.filterForm.patchValue({
                        selectedDateOption: '1'
                    });
                }

                if (!this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
                this.filterData();
            }
        });
        this.store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                    this.filterForm.get('branchUniqueName').setValue(this.currentBranch.uniqueName);
                    this.filterForm.updateValueAndValidity();
                    this.cd.detectChanges();
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });
    }

    public setCurrentFY() {
        // set financial years based on company financial year
        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            return companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                } else {
                    return false;
                }
            });
        })), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp && this.universalDateICurrent) {
                let activeFinancialYear = selectedCmp.activeFinancialYear;
                if (activeFinancialYear) {
                    this.datePickerOptions = {
                        ...this.datePickerOptions,
                        startDate: moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day'), endDate: moment(), chosenLabel: undefined
                    };

                    // assign dates
                    // this.assignStartAndEndDateForDateRangePicker(activeFinancialYear.financialYearStarts, null);
                    this.filterForm.patchValue({
                        from: moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day').format('DD-MM-YYYY'),
                        to: moment().format('DD-MM-YYYY')
                    });
                }
            }
        });
    }

    public ngOnDestroy() {
        //
    }

    public selectDateOption(v: IOption) {
        // this.selectedDateOption = v.value || '';
    }

    public selectedDate(value: any) {
        this.filterForm.controls['from'].setValue(moment(value.picker.startDate).format('DD-MM-YYYY'));
        this.filterForm.controls['to'].setValue(moment(value.picker.endDate).format('DD-MM-YYYY'));
        this.filterData();
    }

    public selectFinancialYearOption(v: IOption) {
        if (v.value) {
            let financialYear = this._selectedCompany.financialYears.find(p => p.uniqueName === v.value);
            let index = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === v.value);
            if (financialYear) {
                this.filterForm.patchValue({
                    to: financialYear.financialYearEnds,
                    from: financialYear.financialYearStarts,
                    fy: index === 0 ? 0 : index * -1
                });
            }
        } else {
            this.filterForm.patchValue({
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
        let data = _.cloneDeep(this.filterForm.value);
        data.refresh = true;
        this.onPropertyChanged.emit(data);
    }

    public setFYFirstTime(selectedFY: string) {
        if (selectedFY) {
            let inx = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === selectedFY);
            if (inx !== -1) {
                this.filterForm.patchValue({
                    fy: inx === 0 ? 0 : inx * -1
                });
            }
        }
    }

    public toggleTagsModal() {
        this.createTagModal.toggle();
    }

    public createTag() {
        this.store.dispatch(this._settingsTagActions.CreateTag(this.newTagForm.getRawValue()));
        this.toggleTagsModal();
    }

    /**
     * emitExpand
     */
    public emitExpand() {
        this.expand = !this.expand;
        setTimeout(() => {
            this.expandAll.emit(this.expand);
        }, 10);
    }

    public onTagSelected(ev) {
        this.selectedTag = ev.value;
        this.filterForm.get('tagName').patchValue(ev.value);
        this.filterForm.get('refresh').patchValue(true);
        this.onPropertyChanged.emit(this.filterForm.value);
    }

    public dateOptionIsSelected(ev) {
        if (ev) {
            if (ev.value === '0') {
                this.selectFinancialYearOption(this.financialOptions[0]);
            } else {
                this.filterForm.patchValue({
                    from: moment(this.datePickerOptions.startDate).format('DD-MM-YYYY'),
                    to: moment(this.datePickerOptions.endDate).format('DD-MM-YYYY')
                });
            }
        }
    }

    /**
     * Branch change handler
     *
     * @memberof TbPlBsFilterComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.expand = false;
        setTimeout(() => {
            this.expandAll.emit(this.expand);
        }, 10);
        this.onPropertyChanged.emit(this.filterForm.value);
    }

    /**
     * assign date to start and end date for date range picker
     * @param from
     * @param to
     */
    private assignStartAndEndDateForDateRangePicker(from, to) {
        from = from || moment().subtract(30, 'd');
        to = to || moment();
        this.filterForm.get('selectedDateRange').patchValue({
            startDate: moment(from, GIDDH_DATE_FORMAT),
            endDate: moment(to, GIDDH_DATE_FORMAT)
        });
    }
}
