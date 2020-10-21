import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { MatDatepickerInputEvent, MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ReplaySubject } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { GIDDH_DATE_RANGE_PICKER_RANGES, DatePickerDefaultRangeEnum } from '../../app.constant';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';

const moment = _moment;

@Component({
    selector: 'giddh-daterangepicker',
    styleUrls: ['./giddh-daterangepicker.component.scss'],
    templateUrl: './giddh-daterangepicker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GiddhDaterangepickerComponent implements OnInit, OnChanges, OnDestroy {
    public giddhDaterangepickerSidebar = GiddhDaterangepickerSidebarComponent;

    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();
    /** Taking start date */
    @Input() public inputStartDate: any = '';
    /** Taking end date */
    @Input() public inputEndDate: any = '';

    @ViewChild('picker', {static: true}) picker: MatDatepicker<Date>;

    public startDate: any = '';
    public endDate: any = '';
    public minDate: any;
    public maxDate: any;

    /** Subject to unsubscribe from all listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private generalService: GeneralService, private store: Store<AppState>, private settingsFinancialYearActions: SettingsFinancialYearActions, private cdr: ChangeDetectorRef) {

    }

    /**
     * Initializes the component
     *
     * @memberof GiddhDaterangepickerComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());

        if (this.inputStartDate) {
            this.startDate = moment(this.inputStartDate, GIDDH_DATE_FORMAT).toDate();
        }
        if (this.inputEndDate) {
            this.endDate = moment(this.inputEndDate, GIDDH_DATE_FORMAT).toDate();
        }

        this.generalService.selectedRange.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response && response.value) {
                this.startDate = response.value[0];
                this.endDate = response.value[1];

                this.dateSelected.emit({name: response.name, startDate: this.startDate, endDate: this.endDate});
                this.picker.close();
            }
        });

        this.store.pipe(select(state => state.settings.financialYears), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let financialYears = response.financialYears;

                if (financialYears[0].financialYearStarts) {
                    let minDate = new Date(financialYears[0].financialYearStarts.split("-").reverse().join("-"));
                    this.minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                }

                if (financialYears[financialYears.length - 1].financialYearEnds) {
                    let maxDate = new Date(financialYears[financialYears.length - 1].financialYearEnds.split("-").reverse().join("-"));
                    this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                }
            }
        });
    }

    /**
     * Updates the value on value change event
     *
     * @param {SimpleChanges} changes
     * @memberof GiddhDaterangepickerComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.inputStartDate && changes.inputStartDate.currentValue) {
            this.startDate = changes.inputStartDate.currentValue.toDate();
        }
        if (changes.inputStartDate && changes.inputEndDate.currentValue) {
            this.endDate = changes.inputEndDate.currentValue.toDate();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Callback for date range change
     *
     * @param {MatDatepickerInputEvent<Date>} event
     * @memberof GiddhDaterangepickerComponent
     */
    public dateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
        if(type === "start") {
            this.startDate = moment(event.value, GIDDH_DATE_FORMAT).toDate();
        }
        if(type === "end") {
            this.endDate = moment(event.value, GIDDH_DATE_FORMAT).toDate();
        }
    }

    public openDatepicker(): void {
        if(this.picker) {
            this.picker.open();
        }
    }
}

/** Custom sidebar component for datepicker. */
@Component({
    selector: 'giddh-daterangepicker-sidebar',
    templateUrl: './giddh-daterangepicker-sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GiddhDaterangepickerSidebarComponent<D> implements OnInit, OnDestroy {
    /* This will store available date ranges */
    public datePickerRanges: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public financialYears: any[] = [];
    public currentFinancialYearUniqueName: string = "";
    public minDate: any;
    public maxDate: any;
    /** Subject to unsubscribe from all listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private calendar: MatCalendar<D>, private dateAdapter: DateAdapter<D>,
        @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, private cdr: ChangeDetectorRef, private generalService: GeneralService, private store: Store<AppState>) {
        calendar.stateChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => cdr.markForCheck());
    }

    public ngOnInit(): void {
        this.store.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            let currentCompanyUniqueName = "";

            if (s.session) {
                currentCompanyUniqueName = _.cloneDeep(s.session.companyUniqueName);
            }
            if (currentCompanyUniqueName && s.session.companies) {
                let companies = _.cloneDeep(s.session.companies);
                let activeCompany = companies.find((c) => c.uniqueName === currentCompanyUniqueName);
                if (activeCompany && activeCompany.activeFinancialYear) {
                    this.currentFinancialYearUniqueName = activeCompany.activeFinancialYear.uniqueName;
                }
            }
        });

        this.getFinancialYears();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public changeMonth(mode: string): void {
        if(mode === "previous") {
            if(this.calendar.activeDate > this.minDate) {
                this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
            }
        } else {
            if(this.calendar.activeDate < this.maxDate) {
                this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
            }
        }
    }

    get monthName(): any {
        return this.dateAdapter
            .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
            .toLocaleUpperCase();
    }

    public selectRange(range: any): void {
        this.generalService.selectRange(range);
    }

    public getFinancialYears(): void {
        this.store.pipe(select(state => state.settings.financialYears), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let financialYears = response.financialYears;
                let currentFinancialYear;
                let allFinancialYears = [];
                this.financialYears = [];

                if (financialYears[0].financialYearStarts) {
                    let minDate = new Date(financialYears[0].financialYearStarts.split("-").reverse().join("-"));
                    this.minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                }

                if (financialYears[financialYears.length - 1].financialYearEnds) {
                    let maxDate = new Date(financialYears[financialYears.length - 1].financialYearEnds.split("-").reverse().join("-"));
                    this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
                }

                financialYears.forEach(key => {
                    let financialYearStarts = moment(key.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = moment(key.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    this.financialYears.push({ label: financialYearStarts + " - " + financialYearEnds, value: key });

                    if (this.currentFinancialYearUniqueName && this.currentFinancialYearUniqueName === key.uniqueName) {
                        currentFinancialYear = moment(moment(key.financialYearStarts.split("-").reverse().join("-")).toDate());
                    }

                    if (allFinancialYears.indexOf(moment(key.financialYearStarts, GIDDH_DATE_FORMAT).format("YYYY")) === -1) {
                        allFinancialYears.push(moment(key.financialYearStarts, GIDDH_DATE_FORMAT).format("YYYY"));
                    }

                    if (allFinancialYears.indexOf(moment(key.financialYearEnds, GIDDH_DATE_FORMAT).format("YYYY")) === -1) {
                        allFinancialYears.push(moment(key.financialYearEnds, GIDDH_DATE_FORMAT).format("YYYY"));
                    }
                });

                if (this.datePickerRanges && this.datePickerRanges.length > 0) {
                    let loop = 0;
                    let ranges = [];
                    this.datePickerRanges.forEach(key => {
                        if (key.name === DatePickerDefaultRangeEnum.AllTime) {
                            ranges[loop] = key;

                            ranges[loop].value = [
                                moment(moment(financialYears[0].financialYearStarts, GIDDH_DATE_FORMAT).toDate()),
                                moment()
                            ];
                            loop++;
                        } else if (key.name === DatePickerDefaultRangeEnum.ThisFinancialYearToDate && currentFinancialYear) {
                            ranges[loop] = key;

                            ranges[loop].value = [
                                currentFinancialYear,
                                moment()
                            ];
                            loop++;
                        } else {
                            ranges[loop] = key;
                            loop++;
                        }
                    });

                    this.datePickerRanges = ranges;
                }
            }
        });
    }

    public selectFinancialYear(financialYear: any): void {
        let startDate = moment(new Date(financialYear.value.financialYearStarts.split("-").reverse().join("-")));
        let endDate = moment(new Date(financialYear.value.financialYearEnds.split("-").reverse().join("-")));

        this.selectRange({name: 'Select Financial Year', value: [startDate, endDate]});
    }

    public uptoInputKeyUp(event): void {
        if (event.shiftKey || event.ctrlKey || (event.which >= 37 && event.which <= 40)) {
            return;
        }
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    public uptoToday(e: Event, days: number): void {
        const dates = [moment().subtract(days ? (days - 1) : days, 'days'), moment()];
        let startDate = dates[0].clone();
        let endDate = dates[1].clone();

        this.selectRange({name: 'days up to today', value: [startDate, endDate]});
    }
}