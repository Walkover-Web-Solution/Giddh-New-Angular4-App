import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { TagRequest } from '../../models/api-models/settingsTags';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { BreakpointObserver } from '@angular/cdk/layout';
import { cloneDeep, map, orderBy } from '../../lodash-optimized';
import { SettingsTagService } from '../../services/settings.tag.service';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ToasterService } from '../../services/toaster.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { TrialBalanceRequest } from '../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../models/api-models/Company';
import { IForceClear } from '../../models/api-models/Sales';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';

@Component({
    selector: 'filter-multi-currency',
    templateUrl: './filter-multi-currency.component.html',
    styleUrls: [`./filter-multi-currency.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterMultiCurrencyComponent implements OnInit, OnDestroy {
    /** The current date object representing today's date */
    public today: Date = new Date();
    /** The selected date option, initialized to '0' */
    public selectedDateOption: string = '0';
    /** The reactive form group for managing filter inputs */
    public filterForm: UntypedFormGroup;
    /** The string used for searching items */
    public search: string = '';
    /** The list of financial options available for selection */
    public financialOptions: IOption[] = [];
    /** The form control for managing account search input */
    public accountSearchControl: UntypedFormControl = new UntypedFormControl();
    /** The list of tags associated with the component */
    public tags: TagRequest[] = [];
    /** The currently selected tag */
    public selectedTag: string;
    /** A boolean indicating the current state of the universal date picker */
    public universalDateICurrent: boolean = false;
    /** Stores the currently active company information */
    public activeCompany: any;
    /** Event emitter for sending the last synchronization date */
    @Output() public lastSyncDate = new EventEmitter<string>();
    /** Event emitter for notifying property changes */
    @Output() public onPropertyChanged = new EventEmitter<any>();
    /** Event emitter for sending the filter value */
    @Output() public filterValue = new EventEmitter<any>();
    /** Event emitter for notifying search changes */
    @Output() public seachChange = new EventEmitter<string>();
    /** A boolean indicating whether all elements are expanded */
    @Input() public expandAll: boolean;
    /** Event emitter for toggling the expand/collapse state of all elements */
    @Output() public expandAllChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Reference to the modal used for creating tags */
    @ViewChild('createTagModal', { static: true }) public createTagModal: ModalDirective;
    /** Template reference for the date picker directive */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Reference to the modal for managing its state */
    public modalRef: BsModalRef;
    /** The selected date range used in API requests */
    public selectedDateRange: any;
    /** The selected date range displayed on the user interface */
    public selectedDateRangeUi: any;
    /** Instance of the dayjs library for date manipulation */
    public dayjs = dayjs;
    /** The selected "from" date in string format */
    public fromDate: string;
    /** The selected "to" date in string format */
    public toDate: string;
    /** The label for the selected date range */
    public selectedRangeLabel: any = "";
    /** The x and y position of the date field used to position the date picker */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** ReplaySubject used to handle cleanup and prevent memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the local JSON data for the component */
    public localeData: any = {};
    /** Stores the common JSON data for the application */
    public commonLocaleData: any = {};
    /** List of companies available for selection */
    public companyList: any;
    /** List of currencies available for selection */
    public currencyList: any;
    public dateOptions: IOption[] = [];
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;


    constructor(private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private componentStore: MultiCurrencyReportsComponentStore
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
            shareCompanyList: [null],
            selectCurrency: [null]
        });

    }

    public ngOnInit() {
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.search = newValue;
                this.seachChange.emit(this.search);
                this.cd.detectChanges();
            });

        this.componentStore.universalDate$.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((a) => {
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

        this.componentStore.currencyList$.pipe(takeUntil(this.destroyed$)).subscribe(currency => {
            if (currency) {
                let currencyList = [];
                currency.forEach((res) => {
                    currencyList.push({ label: res.code, value: res.code, additional: { symbol: res.symbol } });
                })
                this.currencyList = currencyList;
            }
        });

        this.componentStore.companyList$.pipe(takeUntil(this.destroyed$)).subscribe(companies => {
            if (companies) {
                let orderedCompanies = _.orderBy(companies, 'name');
                this.companyList = orderedCompanies;
            }
        });
        this.componentStore.filterRequestData$.pipe(takeUntil(this.destroyed$)).subscribe(filterRequestData => {
            if (filterRequestData) {
                this.getForm('selectCurrency').patchValue(filterRequestData.request.reportCurrency);
                let selectCompany = [];
                filterRequestData.request.companiesList.forEach((company) => {
                    selectCompany.push(company.uniqueName)
                });
                this.getForm('shareCompanyList').patchValue(selectCompany);
                this.lastSyncDate.emit(filterRequestData.lastFetchedAt);
                this.cd.detectChanges();
            }
        });
    }

    public getForm(controlName: string): FormControl {
        return this.filterForm.get(controlName) as FormControl;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectedDate(value: any) {
        this.filterForm.controls['from'].setValue(dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT));
        this.filterForm.controls['to'].setValue(dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT));
    }

    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    public filterData() {
        this.onPropertyChanged.emit();
        let a = this.search = '';
        this.seachChange.emit(a);
    }

    public onSubmit() {
        let data = {
            companiesList: [],
            reportCurrency: ''
        };
        this.getForm('shareCompanyList').value?.forEach(control => {
            if (control) {
                data.companiesList.push({ from: this.getForm('from').value, to: this.getForm('to').value, uniqueName: control });
            }
        });
        data.reportCurrency = this.getForm('selectCurrency').value || this.activeCompany?.baseCurrency;
        this.filterValue.emit(data);
    }


    public toggleTagsModal() {
        this.createTagModal.toggle();
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
        }
    }
}
