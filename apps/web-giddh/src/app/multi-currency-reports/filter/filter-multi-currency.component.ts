import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { TagRequest } from '../../models/api-models/settingsTags';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES, IOption } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { cloneDeep, forEach, get, has, map, orderBy } from '../../lodash-optimized';

@Component({
selector: 'filter-multi-currency',
    templateUrl: './filter-multi-currency.component.html',
    styleUrls: [`./filter-multi-currency.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FilterMultiCurrencyComponent implements OnInit, OnDestroy {
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** A boolean indicating whether all elements are expanded */
    @Input() public expandAll: boolean;
    /** Event emitter for sending the last synchronization date */
    @Output() public lastSyncDate: EventEmitter<string> = new EventEmitter();
    /** Event emitter for notifying property changes */
    @Output() public onPropertyChanged: EventEmitter<any> = new EventEmitter();
    /** Event emitter for sending the filter value */
    @Output() public filterValue: EventEmitter<any> = new EventEmitter();
    /** Event emitter for notifying search changes */
    @Output() public searchChange: EventEmitter<string> = new EventEmitter();
    /** Event emitter for toggling the expand/collapse state of all elements */
    @Output() public expandAllChange: EventEmitter<boolean> = new EventEmitter();
    /** The current date object representing today's date */
    public today: Date = new Date();
    /** The selected date option, initialized to '0' */
    public selectedDateOption: string = '0';
    /** The reactive form group for managing filter inputs */
    public filterForm: FormGroup;
    /** The string used for searching items */
    public search: string = '';
    /** The list of financial options available for selection */
    public financialOptions: IOption[] = [];
    /** The form control for managing account search input */
    public accountSearchControl: FormControl = new FormControl<string>('');
    /** The list of tags associated with the component */
    public tags: TagRequest[] = [];
    /** The currently selected tag */
    public selectedTag: string;
    /** A boolean indicating the current state of the universal date picker */
    public universalDateICurrent: boolean = false;
    /** Stores the currently active company information */
    public activeCompany: any;
    /** The selected date range used in API requests */
    public selectedDateRange: any;
    /** The selected date range displayed on the user interface */
    public selectedDateRangeUi: any;
    /** Instance of the dayjs library for date manipulation */
    public dayjs: any = dayjs;
    /** The selected "from" date in string format */
    public fromDate: string;
    /** The selected "to" date in string format */
    public toDate: string;
    /** The label for the selected date range */
    public selectedRangeLabel: any = "";
    /** Stores the local JSON data for the component */
    public localeData: any = {};
    /** Stores the common JSON data for the application */
    public commonLocaleData: any = {};
    /** List of companies available for selection */
    public companyList: any;
    /** List of currencies available for selection */
    public currencyList: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** ReplaySubject used to handle cleanup and prevent memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Will check if form is valid */
    public isValidForm: boolean = true;

    constructor(private formBuilder: FormBuilder,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: MultiCurrencyReportsComponentStore
    ) {
        this.filterForm = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            shareCompanyList: [null, Validators.required],
            selectCurrency: [null, Validators.required]
        });
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe((activeCompany) => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                if (this.getForm('selectCurrency') && !this.getForm('selectCurrency').value) {
                    this.getForm('selectCurrency').patchValue(this.activeCompany.baseCurrency);
                }
            }
        });
    }

    /**
     * Initializes the component
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public ngOnInit(): void {
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                if (newValue) {
                    this.search = newValue;
                    this.searchChange.emit(this.search);
                    this.changeDetectionRef.detectChanges();
                }
            });

        this.componentStore.universalDate$.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.universalDateICurrent = false;
                this.filterForm?.patchValue({
                    from: dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT),
                    to: dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT)
                });
                if (!this.changeDetectionRef['destroyed']) {
                    this.changeDetectionRef.detectChanges();
                }
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.filterData();
            }
        });

        this.componentStore.currencyList$.pipe(takeUntil(this.destroyed$)).subscribe(currency => {
            if (currency) {
                this.currencyList = currency.map(res => ({
                    label: res.code,
                    value: res.code,
                    additional: { symbol: res.symbol }
                }));
            }
        });

        this.componentStore.companyList$.pipe(takeUntil(this.destroyed$)).subscribe(companies => {
            if (companies) {
                let orderedCompanies = orderBy(companies, 'name');
                this.companyList = orderedCompanies;
            }
        });
        this.componentStore.filterRequestData$.pipe(takeUntil(this.destroyed$)).subscribe(filterRequestData => {
            if (filterRequestData) {
                this.getForm('selectCurrency').patchValue(filterRequestData.request.reportCurrency);
                this.getForm('shareCompanyList').patchValue(filterRequestData.request.companiesList.map(company => company.uniqueName));
                setTimeout(() => {
                    this.sortSelectedCompaniesFirst();
                }, 0);
                this.lastSyncDate.emit(filterRequestData.lastFetchedAt);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Get a FormControl from the filter form
     *
     * @param {string} controlName - Name of the form control
     * @returns {FormControl} The requested form control
     * @memberof FilterMultiCurrencyComponent
     */
    public getForm(controlName: string): FormControl {
        return this.filterForm?.get(controlName) as FormControl;
    }
    /**
     * Cleanup resources on component destruction
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handle selected date and update the form values
     *
     * @param {any} value - Selected date value
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public selectedDate(value: any): void {
        this.filterForm.controls['from'].setValue(dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT));
        this.filterForm.controls['to'].setValue(dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT));
    }

    /**
     * Perform actions after the view is initialized
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public ngAfterViewInit(): void {
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Emit events to filter data
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public filterData(): void {
        this.onPropertyChanged.emit();
        const a = this.search = '';
        this.searchChange.emit(a);
    }

    /**
     * Handle form submission and emit filter values
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public onSubmit(): void {
        this.isValidForm = this.filterForm.valid;
        if (this.getForm('shareCompanyList').value.length) {
            const data = {
                companiesList: [],
                reportCurrency: ''
            };
            this.getForm('shareCompanyList').value?.forEach((control: any) => {
                if (control) {
                    data.companiesList.push({
                        from: this.getForm('from').value,
                        to: this.getForm('to').value,
                        uniqueName: control
                    });
                }
            });
            data.reportCurrency = this.getForm('selectCurrency').value || this.activeCompany?.baseCurrency;
            this.filterValue.emit(data);
        }
    }

    /**
     * Emit expand event
     *
     * @param {boolean} event - Event value
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public emitExpand(event: boolean): void {
        setTimeout(() => {
            this.expandAllChange.emit(event);
        }, 10);
    }
    
    /**
    * This will show the datepicker
    *
    * @param {boolean} isOpen
    * @memberof FilterMultiCurrencyComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {            
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Callback function for date/range selection in the datepicker
     *
     * @param {any} [value] - Selected date/range value
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.universalDatepickerTrigger?.closeMenu();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.universalDatepickerTrigger?.closeMenu();

        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.filterForm.controls['from'].setValue(this.fromDate);
            this.filterForm.controls['to'].setValue(this.toDate);
        }
    }

    /**
     * Sorts the company list by moving selected companies to the top.
     *
     * @returns {void}
     * @memberof FilterMultiCurrencyComponent
     */
    public sortSelectedCompaniesFirst(): void {
        const selectedCompaniesSet = new Set(this.filterForm.get('shareCompanyList')?.value || []);
        this.companyList = this.companyList.sort((a, b) => {
            const aChecked = selectedCompaniesSet.has(a.uniqueName) ? 1 : 0;
            const bChecked = selectedCompaniesSet.has(b.uniqueName) ? 1 : 0;
            return bChecked - aChecked; 
        });
        this.changeDetectionRef.detectChanges();
    }
}