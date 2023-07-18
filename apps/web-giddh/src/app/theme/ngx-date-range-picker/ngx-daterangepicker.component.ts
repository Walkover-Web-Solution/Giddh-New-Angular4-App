import { ChangeDetectorRef, Component, TemplateRef, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as dayjs from 'dayjs';
import * as localeData from 'dayjs/plugin/localeData' // load on demand
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(localeData) // use plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
import { Dayjs } from 'dayjs';
import { LocaleConfig } from './ngx-daterangepicker.config';
import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { SettingsFinancialYearService } from '../../services/settings.financial-year.service';
import { Router, NavigationStart } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { DatePickerDefaultRangeEnum } from '../../app.constant';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';

export enum DateType {
    start = 'start',
    end = 'end'
}

export class CalendarData {
    month?: number;
    year?: number;
    hour?: number;
    minute?: number;
    second?: number;
    daysInMonth?: number;
    firstDay?: Dayjs;
    lastDay?: Dayjs;
    lastMonth?: number;
    lastYear?: number;
    daysInLastMonth?: number;
    dayOfWeek?: number;
    // other vars
    calRows?: number[];
    calCols?: number[];
    classes?: any;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    calendar?: Calender;
    dropdowns?: MonthVariable;
}

export class Calender {
    [key: number]: Dayjs;
    firstDay: Dayjs;
    lastDay: Dayjs;
}

export class MonthVariable {
    currentMonth: number;
    currentYear: number;
    inMaxYear: boolean;
    inMinYear: boolean;
    maxYear: number;
    minYear: number;
    monthArrays: number[];
    yearArrays: number[];
}

export enum ActiveDateEnum {
    Start,
    End
}

export class CalendarVariables {
    start: CalendarData;
    end: CalendarData;
}

export interface DateRangesInterface {
    key?: string;
    name: string;
    value: any[];
    ranges: any[];
    isSelected: boolean;
}

export interface DateRangeClicked {
    name: string;
    startDate: Dayjs;
    endDate: Dayjs;
    event: string;
}

@Component({
    selector: 'ngx-daterangepicker-material',
    styleUrls: ['./ngx-daterangepicker.component.scss'],
    templateUrl: './ngx-daterangepicker.component.html',
    encapsulation: ViewEncapsulation.ShadowDom,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgxDaterangepickerComponent),
        multi: true
    }]
})

export class NgxDaterangepickerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    modalRef: BsModalRef;
    chosenLabel: string;
    calendarVariables: CalendarVariables = { start: {}, end: {} };
    calendarMonths: any[] = [];
    renderedCalendarMonths: any[] = [];
    timepickerVariables: { start: any, end: any } = { start: {}, end: {} };
    applyBtn: { disabled: boolean } = { disabled: false };
    startDate = dayjs().startOf('day');
    endDate = dayjs().endOf('day');
    @Input()
    inputStartDate: dayjs.Dayjs;
    @Input()
    inputEndDate: dayjs.Dayjs;
    ActiveDate: ActiveDateEnum = ActiveDateEnum.Start;
    @Input()
    ActiveSelectedDateClass = 'activeSelectedDate';
    dateLimit = null;
    // used in template for compile time support of enum values.
    sideEnum = DateType;
    hoveredDate: any;
    @ViewChild('startDateElement', { static: true }) startDateElement: ElementRef;
    @ViewChild('endDateElement', { static: true }) endDateElement: ElementRef;
    @Input()
    minDate: dayjs.Dayjs = dayjs().subtract(1, 'year').startOf('month').month(0); // default min date of previous year first month
    @Input()
    maxDate: dayjs.Dayjs = dayjs().add(1, 'year').endOf('month').month(11); // default max date of next year last month
    @Input()
    autoApply: boolean = false;
    @Input()
    singleDatePicker: boolean = false;
    @Input()
    showDropdowns: boolean = false;
    @Input()
    showWeekNumbers: boolean = false;
    @Input()
    showISOWeekNumbers: boolean = false;
    @Input()
    linkedCalendars: boolean = true;
    @Input()
    autoUpdateInput: boolean = true;
    @Input()
    alwaysShowCalendars: boolean = false;
    @Input()
    maxSpan: boolean = false;
    // timepicker variables
    @Input()
    timePicker: boolean = false;
    @Input()
    timePicker24Hour: boolean = false;
    @Input()
    timePickerIncrement = 1;
    @Input()
    timePickerSeconds: boolean = false;
    // end of timepicker variables
    @Input()
    showClearButton: boolean = false;
    @Input()
    firstMonthDayClass: string = null;
    @Input()
    lastMonthDayClass: string = null;
    @Input()
    emptyWeekRowClass: string = null;
    @Input()
    firstDayOfNextMonthClass: string = null;
    @Input()
    lastDayOfPreviousMonthClass: string = null;
    // custom ranges
    @Input()
    ranges: DateRangesInterface[] = [];
    @Input()
    showCancel = false;
    @Input()
    keepCalendarOpeningWithRange = false;
    @Input()
    showRangeLabelOnInput = false;
    @Input() public selectedRangeLabel: any;
    chosenRange: string;
    // some state information
    isShown: boolean = false;
    isShown$ = new Subject();
    inline = true;
    startCalendar: any = {};
    endCalendar: any = {};
    showCalInRanges: boolean = false;
    options: any = {}; // should get some opt from user
    public drops: string = 'down';
    public opens: string = 'right';
    @Output() choosedDate: EventEmitter<DateRangeClicked>;
    @Output() rangeClicked: EventEmitter<DateRangeClicked>;
    @Output() datesUpdated: EventEmitter<DateRangeClicked>;
    @ViewChild('pickerContainer', { static: true }) pickerContainer: ElementRef;
    public isMobileScreen: boolean = false;
    public dropdownShow: boolean = false;
    public rangeDropdownShow: number = -1;
    public goToPreviousMonthDisabled: boolean = false;
    public goToNextMonthDisabled: boolean = false;
    private _old: { start: any, end: any } = { start: null, end: null };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public financialYears: any[] = [];
    public itemHeight: number = 210;
    public initialCalendarMonths: boolean = true;
    public numberOfScrolls: number = 0;
    public isPreviousMonth: boolean = false;
    public allowedYears: any[] = [];
    public scrollPosition: string = 'bottom';
    public openMobileDatepickerPopup: boolean = false;
    public viewOnlyStartDate: any;
    public viewOnlyEndDate: any;
    public inlineStartDate: any;
    public inlineEndDate: any;
    public invalidInlineStartDate: string = "";
    public invalidInlineEndDate: string = "";
    public invalidInlineDate: string = "";
    public isInlineDateFieldsShowing: boolean = false;
    /* Observer for scroll to top event */
    public scrollTopSubject$: Subject<any> = new Subject();
    /* Observer for scroll to bottom event */
    public scrollBottomSubject$: Subject<any> = new Subject();
    public activeMonth: any;
    public activeMonthHover: boolean = false;
    public invalidStartDate: string = "";
    public invalidEndDate: string = "";
    public currentFinancialYearUniqueName: string = "";
    public isOnScrollActive: boolean = false;
    public imgPath: string = '';
    /* This will hold the previous scroll index of cdk scrollbar */
    public previousScrollIndex: number = 0;
    /* This will hold the current scroll index of cdk scrollbar */
    public currentScrollIndex: number = 0;
    /* This will hold the scroll direction of cdk scrollbar */
    public scrollInDirection: string = "";
    /* This will hold if financial years were updated by api */
    public financialYearUpdated: boolean = false;
    /* This will hold if mouse scroll or touch scroll is allowed or not */
    public allowMouseScroll: boolean = false;
    /* This will hold last active month side */
    public lastActiveMonthSide: string = '';
    /* This will hold if initially datepicker has rendered */
    public initialCalendarRender: boolean = true;
    /** This will hold how many days user can add in upto today field */
    public noOfDaysAllowed: number = 0;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private _ref: ChangeDetectorRef, private modalService: BsModalService, private _localeService: NgxDaterangepickerLocaleService, private _breakPointObservar: BreakpointObserver, public settingsFinancialYearService: SettingsFinancialYearService, private router: Router, private store: Store<AppState>, private settingsFinancialYearActions: SettingsFinancialYearActions) {
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.locale = { ...this._locale };

        this.store.pipe(select(state => state.settings.financialYearLimits), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.startDate && response.endDate) {
                if (dayjs(dayjs(response.startDate, GIDDH_DATE_FORMAT).toDate()) !== this.minDate || dayjs(dayjs(response.endDate, GIDDH_DATE_FORMAT).toDate()) !== this.maxDate) {
                    this.minDate = dayjs(dayjs(response.startDate, GIDDH_DATE_FORMAT).toDate());
                    this.maxDate = dayjs(dayjs(response.endDate, GIDDH_DATE_FORMAT).toDate());
                    this.financialYearUpdated = true;

                    this.noOfDaysAllowed = dayjs().diff(this.minDate, 'day') + 1;
                }
            }
        });

        this.updateMonthsInView();
    }

    _locale: LocaleConfig = {};

    get locale(): any {
        return this._locale;
    }

    @Input() set locale(value) {
        this._locale = { ...this._localeService.config, ...value };
    }

    get startDateString(): string {
        if (this.startDate) {
            if (this.ActiveDate === ActiveDateEnum.End) {
                return this.startDate.format(GIDDH_NEW_DATE_FORMAT_UI);
            } else {
                return this.startDate.format(this.locale.format);
            }
        }
        return '';
    }

    get endDateString(): string {
        if (this.endDate) {
            if (this.ActiveDate === ActiveDateEnum.Start) {
                return this.endDate.format(GIDDH_NEW_DATE_FORMAT_UI);
            } else {
                return this.endDate.format(this.locale.format);
            }
        }
        return '';
    }

    public ngOnInit(): void {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && activeCompany.activeFinancialYear) {
                this.currentFinancialYearUniqueName = activeCompany.activeFinancialYear.uniqueName;
            }
        });

        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
            this.closeCalender();
        });

        this._buildLocale();
        this.renderRanges();
        this.emptyWeekRowClass = 'hideMe';

        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = dayjs.localeData().longDateFormat('lll');
            } else {
                this.locale.format = dayjs.localeData().longDateFormat('L');
            }
        }

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.clickCancel();
            }
        });

        this.isShown$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.invalidStartDate = "";
            this.invalidEndDate = "";
            this.rangeDropdownShow = -1;
            this.dropdownShow = false;
        });

        this.modalService.onShow.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isInlineDateFieldsShowing = true;
        });

        this.modalService.onHide.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isInlineDateFieldsShowing = false;
            this.invalidInlineStartDate = "";
            this.invalidInlineEndDate = "";
            this.invalidInlineDate = "";
        });

        this.scrollTopSubject$.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((response) => {
            if (this.allowMouseScroll) {
                this.onScroll(response);
            }
        });

        this.scrollBottomSubject$.pipe(debounceTime(200), takeUntil(this.destroyed$)).subscribe((response) => {
            if (this.allowMouseScroll) {
                this.onScroll(response);
            }
        });

        if (this.inputStartDate) {
            this.startDate = this.inputStartDate;
        }

        if (this.inputEndDate) {
            this.endDate = this.inputEndDate;
        }

        this.updateMonthsInView();

        this.initCalendar();

        document.querySelector(".giddh-datepicker-modal").parentElement.classList.add("giddh-calendar");
    }

    /**
     * This will check and scroll the scrollbar on desired month
     *
     * @memberof NgxDaterangepickerComponent
     */
    public ngAfterViewInit(): void {
        document.querySelector('body').classList.remove('modal-open');
    }

    public ngOnChanges(changes: SimpleChanges) {
        for (let change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (change === "inputStartDate" && changes[change].currentValue) {
                    this.startDate = changes[change].currentValue;
                }
                if (change === "inputEndDate" && changes[change].currentValue) {
                    this.endDate = changes[change].currentValue;
                    this.updateMonthsInView();
                }
                if (change === "minDate" && changes[change].currentValue) {
                    this.minDate = changes[change].currentValue;
                }
                if (change === "maxDate" && changes[change].currentValue) {
                    this.maxDate = changes[change].currentValue;
                }
            }
        }
    }

    public closeCalender(): void {
        this.openMobileDatepickerPopup = false;
        document.querySelector('body').classList.remove('hide-scroll-body');
    }

    public closeMobileDatePicker(): void {
        this.datesUpdated.emit({ name: this.selectedRangeLabel, startDate: this.inputStartDate, endDate: this.inputEndDate, event: 'cancel' });
        this.openMobileDatepickerPopup = false;
        document.querySelector('body').classList.remove('hide-scroll-body');
        this.hide();
    }

    public openModalWithClass(template: TemplateRef<any>): void {
        this.inlineStartDate = _.cloneDeep(this.startDate);
        this.inlineEndDate = _.cloneDeep(this.endDate);


        this.viewOnlyStartDate = this.inlineStartDate.format(GIDDH_DATE_FORMAT);
        this.viewOnlyEndDate = this.inlineEndDate.format(GIDDH_DATE_FORMAT);

        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'edit-modal modal-small' }),

        );
    }

    /**
     * check whether go to previous and go to next month are allowed
     */
    private checkNavigateMonthsHolders(): void {
        // for single date picker
        if (this.singleDatePicker) {
            this.goToPreviousMonthDisabled = this.startCalendar.month.startOf('d').isBefore(this.minDate);
            this.goToNextMonthDisabled = this.startCalendar.month.startOf('d').isBefore(this.maxDate);
        } else {
            // for date range picker

            // check if start calender month start day is before or same as min date then don't allow to go to previous month
            this.goToPreviousMonthDisabled = dayjs().set("year", this.startCalendar.month.year()).set("month", this.startCalendar.month.month()).set("date", 1).startOf('M').isSameOrBefore(this.minDate, 'date');

            // check if end calender month end day is after or same as max date then don't allow to go to next month
            this.goToNextMonthDisabled = dayjs().set("year", this.endCalendar.month.year()).set("month", this.endCalendar.month.month()).set("date", 1).endOf('M').isSameOrAfter(this.maxDate);
        }
    }

    /**
     * render ranges to ui
     * check various start and end date validation in given ranges
     */
    public renderRanges(): void {
        this.ranges = this.parseRangesToVm(this.ranges);

        // if there's no ranges given, display calender in place of ranges list
        this.showCalInRanges = (!this.ranges?.length) || this.alwaysShowCalendars;

        // if no time picker is defined then,
        // set start date as start of start date
        // and end date as end of end date
        if (!this.timePicker) {
            if (this.startDate) {
                this.startDate = this.startDate.startOf('day');
            }

            if (this.endDate) {
                this.endDate = this.endDate.endOf('day');
            }
        }

        // can't be used together for now
        if (this.timePicker && this.autoApply) {
            this.autoApply = false;
        }
    }

    public renderTimePicker(side: DateType): void {
        if (side === DateType.end && !this.endDate) {
            return;
        }
        let selected, minDate;
        const maxDate = this.maxDate;
        if (side === DateType.start) {
            selected = this.startDate.clone(),
                minDate = this.minDate;
        } else if (side === DateType.end) {
            selected = this.endDate.clone(),
                minDate = this.startDate;
        }
        const start = this.timePicker24Hour ? 0 : 1;
        const end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0,
        };
        // generate hours
        for (let i = start; i <= end; i++) {
            let i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : (i === 12 ? 0 : i);
            }

            const time = selected.clone().hour(i_in_24);
            let disabled = false;
            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }

            this.timepickerVariables[side].hours.push(i);
            if (i_in_24 === selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            } else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }
        }
        // generate minutes
        for (let i = 0; i < 60; i += this.timePickerIncrement) {
            const padded = i < 10 ? '0' + i : i;
            const time = selected.clone().minute(i);

            let disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() === i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            } else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        // generate seconds
        if (this.timePickerSeconds) {
            for (let i = 0; i < 60; i++) {
                const padded = i < 10 ? '0' + i : i;
                const time = selected.clone().second(i);

                let disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }

                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() === i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                } else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }

            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            } else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    }

    public renderCalendar(side: DateType): void { // side enum
        const mainCalendar: any = (side === DateType.start) ? this.startCalendar : this.endCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = dayjs().set("year", year).set("month", month).daysInMonth();
        const firstDay = dayjs().set("year", year).set("month", month).set("date", 1);
        const lastDay = dayjs().set("year", year).set("month", month).set("date", daysInMonth);
        const lastMonth = dayjs(firstDay).subtract(1, 'month').month();
        const lastYear = dayjs(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = dayjs().set("year", lastYear).set("month", lastMonth).daysInMonth();
        const dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        const calendar: any = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;

        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }

        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }

        let curDate = dayjs().set("year", lastYear).set("month", lastMonth).set("date", startDay).set("hour", 12).set("minute", minute).set("second", second);

        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = dayjs(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);

            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'start') {
                calendar[row][col] = this.minDate.clone();
            }

            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'end') {
                calendar[row][col] = this.maxDate.clone();
            }
        }

        // make the calendar object available to hoverDate/clickDate
        if (side === DateType.start) {
            this.startCalendar.calendar = calendar;
        } else {
            this.endCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        const minDate = side === 'start' ? this.minDate : this.startDate;
        let maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            const minYear = (minDate && minDate.year()) || (currentYear - 50);
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (let y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);

        this.addMonthInCalendarMonths();

        this.checkNavigateMonthsHolders();
    }

    public setStartDate(startDate): void {
        this.invalidStartDate = "";

        if (!dayjs(startDate, this.locale.format, true).isValid()) {
            this.invalidStartDate = this.commonLocaleData?.app_datepicker?.enter_dmy;
            return;
        }

        if (typeof startDate === 'string') {
            this.startDate = dayjs(startDate, this.locale.format);
        }

        if (typeof startDate === 'object') {
            this.startDate = dayjs(startDate);
        }

        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }

        if (this.startDate.isSameOrBefore(this.endDate)) {
            this.invalidEndDate = "";
        }

        if (!this.isShown) {
            this.updateElement();
        }

        this.updateMonthsInView();
        this.updateView();
    }

    public setEndDate(endDate): void {
        this.invalidEndDate = "";

        if (!dayjs(endDate, this.locale.format, true).isValid()) {
            this.invalidEndDate = this.commonLocaleData?.app_datepicker?.enter_dmy;
            return;
        }

        if (typeof endDate === 'string') {
            this.endDate = dayjs(endDate, this.locale.format);
        }

        if (typeof endDate === 'object') {
            this.endDate = dayjs(endDate);
        }

        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'day').startOf('day').subtract(1, 'second');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }

        if (this.endDate.isSameOrAfter(this.startDate)) {
            this.inlineStartDate = "";
        }

        this.updateMonthsInView();
        if (this.autoApply) {
            this.emitSelectedDates(false);
        }
        this.updateView();
    }

    @Input()
    isInvalidDate(date) {
        return false;
    }

    isCustomDate(date) {
        return false;
    }

    public updateView(): void {
        if (this.timePicker) {
            this.renderTimePicker(DateType.start);
            this.renderTimePicker(DateType.end);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }

    public updateMonthsInView(): void {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.startCalendar.month && this.endCalendar.month &&
                ((this.startDate && this.startCalendar && this.startDate.format('YYYY-MM') === this.startCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.endCalendar && this.startDate.format('YYYY-MM') === this.endCalendar.month.format('YYYY-MM')))
                &&
                (this.endDate.format('YYYY-MM') === this.startCalendar.month.format('YYYY-MM') ||
                    this.endDate.format('YYYY-MM') === this.endCalendar.month.format('YYYY-MM'))
            ) {
                return;
            }
            if (this.startDate) {
                this.startCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.endCalendar.month = this.endDate.clone().date(2);
                } else {
                    this.endCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        } else {
            if (this.startCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.endCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.startCalendar.month = this.startDate.clone().date(2);
                this.endCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }

        if (this.financialYearUpdated && this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.endCalendar.month > this.maxDate) {
            this.endCalendar.month = this.maxDate.clone().date(2);
            this.startCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    }

    /**
     *  This is responsible for updating the calendars
     */
    public updateCalendars(): void {
        this.initCalendar();

        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }

    public updateElement(): void {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on inpu
                if (this.ranges?.length && this.showRangeLabelOnInput === true && this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                } else {
                    this.chosenLabel = this.startDate.format(this.locale.format) +
                        this.locale.separator + this.endDate.format(this.locale.format);
                }
            }
        } else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    }

    public remove(): void {
        this.setActiveDate(ActiveDateEnum.Start);
        this.isShown$.next(false);
        this.isShown = false;
    }

    /**
     * this should calculate the label
     */
    public calculateChosenLabel(): void {
        if (this.ranges?.length > 0) {
            const flattenRanges = [];
            this.flattenRanges(this.ranges, flattenRanges);

            flattenRanges.forEach(range => {
                if (this.timePicker) {
                    const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';

                    if (range && range.ranges && !range.ranges?.length) {
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === range.value[0].format(format)
                            && this.endDate.format(format) === range.value[1].format(format)) {
                            this.selectRange(this.ranges, range.name);
                        }
                    }
                } else {
                    if (range && range.ranges && !range.ranges?.length) {
                        // ignore times when comparing dates if time picker is not enabled
                        if (this.startDate.format('YYYY-MM-DD') === range.value[0].format('YYYY-MM-DD')
                            && this.endDate.format('YYYY-MM-DD') === range.value[1].format('YYYY-MM-DD')) {
                            this.selectRange(this.ranges, range.name);
                        }
                    }
                }
            });
        }

        this.updateElement();
    }

    public clickApply(e?): void {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            let d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'day');
                    this.calculateChosenLabel();
                    break;
                }
                d = d.add(1, 'day');
            }
        }

        if (this.chosenLabel) {
            this.choosedDate.emit({ name: this.chosenLabel, startDate: this.startDate, endDate: this.endDate, event: 'save' });
        }

        this.emitSelectedDates(false);
        this.hide();
    }

    public clickCancel(e?: any): void {
        if (this._old && this._old.start) {
            this.startDate = this._old.start;
        }

        if (this._old && this._old.end) {
            this.endDate = this._old.end;
        }

        if (this.inline) {
            this.updateView();
        }
        this.hide();

        if (this.isMobileScreen) {
            this.closeCalender();
        }

        this.datesUpdated.emit({ name: this.selectedRangeLabel, startDate: this.inputStartDate, endDate: this.inputEndDate, event: 'cancel' });
    }

    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side start or end
     */
    public monthChanged(monthEvent: any, side: DateType): void {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }

    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side start or end
     */
    public yearChanged(yearEvent: any, side: DateType): void {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target?.value, 10);
        this.monthOrYearChanged(month, year, side);
    }

    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side start or end
     */
    public timeChanged(timeEvent: any, side: DateType): void {

        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;

        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }

        if (side === DateType.start) {
            const start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            } else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        } else if (this.endDate) {
            const end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }

        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();

        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(DateType.start);
        this.renderTimePicker(DateType.end);
    }

    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side start or end
     */
    public monthOrYearChanged(month: number, year: number, side: DateType): void {
        const isLeft = side === DateType.start;

        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }

        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }

        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.startCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.endCalendar.month = this.startCalendar.month.clone().add(1, 'month');
            }
        } else {
            this.endCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.startCalendar.month = this.endCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }

    /**
     * Click on previous month
     */
    public goToPrevMonth(): void {
        this.isPreviousMonth = true;
        if (!this.singleDatePicker) {
            this.startCalendar.month = this.startCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.endCalendar.month = this.endCalendar.month.subtract(1, 'month');
            }
        } else {
            this.startCalendar.month = this.startCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }

    /**
     * Click on next month
     */
    public goToNextMonth(): void {
        this.isPreviousMonth = false;
        if (!this.singleDatePicker) {
            this.endCalendar.month = this.endCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.startCalendar.month = this.startCalendar.month.add(1, 'month');
            }
        } else {
            this.startCalendar.month = this.startCalendar.month.add(1, 'month');
        }
        this.updateCalendars();
    }

    public clickNextYear(side: DateType): void {
        if (side === DateType.start) {
            this.startCalendar.month = this.startCalendar.month.add(1, 'year');
        } else {
            this.endCalendar.month = this.endCalendar.month.add(1, 'year');
            if (this.linkedCalendars) {
                this.startCalendar.month = this.startCalendar.month.add(1, 'year');
            }
        }
        this.updateCalendars();
    }

    /**
     * Click on previous month
     * @param side start or end calendar
     */
    public clickPrevYear(side: DateType): void {
        if (side === DateType.start) {
            this.startCalendar.month = this.startCalendar.month.subtract(1, 'year');
            if (this.linkedCalendars) {
                this.endCalendar.month = this.endCalendar.month.subtract(1, 'year');
            }
        } else {
            this.endCalendar.month = this.endCalendar.month.subtract(1, 'year');
        }
        this.updateCalendars();
    }

    public setMonth(year: number, month: number): void {
        this.initialCalendarMonths = true;
        this.startCalendar.month = dayjs().set("year", year).set("month", month).set("date", 1);
        if (this.linkedCalendars) {
            this.endCalendar.month = dayjs().set("year", year).set("month", month).set("date", 1).add(1, 'month');
        }
        this.updateCalendars();
    }

    public mouseUp(e: WheelEvent): void {
        if (this.allowMouseScroll) {
            if (e.deltaY < 0) {
                if (!this.isOnScrollActive) {
                    this.isOnScrollActive = true;
                    this.scrollTopSubject$.next("top");
                }
            } else {
                if (!this.isOnScrollActive) {
                    this.isOnScrollActive = true;
                    this.scrollBottomSubject$.next("bottom");
                }
            }
        }
    }

    /**
     * key up event for up to input boxes
     * ensure only number are added in that tax box
     * @param event
     */
    public uptoInputKeyUp(event): void {
        if (event.shiftKey || event.ctrlKey || (event.which >= 37 && event.which <= 40)) {
            return;
        }
        event.target.value = (event && event.target && event.target.value) ? event.target.value?.replace(/[^0-9]/g, '') : 0;
        if (event.target.value > this.noOfDaysAllowed) {
            event.target.value = this.noOfDaysAllowed;
        }
    }

    public uptoToday(e: Event, days: number): void {
        if (days > this.noOfDaysAllowed) {
            days = this.noOfDaysAllowed;
        }

        const dates = [dayjs().subtract(days ? (days - 1) : days, 'day'), dayjs()];
        this.startDate = dates[0].clone();
        this.endDate = dates[1].clone();

        this.calculateChosenLabel();
        this.updateView();

        if (this.isMobileScreen) {
            this.emitSelectedDates(false);
            this.hide();
        }
    }

    public uptoYesterday(e: Event, days: number): void {
        const dates = [dayjs().subtract(days, 'day'), dayjs().subtract(days ? 1 : 0, 'day')];
        this.startDate = dates[0].clone();
        this.endDate = dates[1].clone();

        this.calculateChosenLabel();
        this.updateView();

        if (this.isMobileScreen) {
            this.emitSelectedDates(false);
            this.hide();
        }
    }

    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side start or end
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    public clickDate(e, date: Dayjs): void {
        this.invalidStartDate = "";
        this.invalidEndDate = "";

        if (this.ranges?.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }

        if (this.ActiveDate === ActiveDateEnum.Start) {
            // if start date is available
            if (this.startDate) {
                // if no end date available
                if (!this.endDate) {
                    // if selected date is greater or equal to start date, then set end date
                    if (date.isAfter(this.startDate, 'day') || date.isSame(this.startDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.Start);
                        this.setEndDate(date.clone());
                    } else { // if selected date is less to start date, then set selected date as start and end date
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                    }
                } else {
                    // if date less than or equal to end date then set start date
                    if (date.isBefore(this.endDate, 'day') || date.isSame(this.endDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                    } else if (date.isBefore(this.startDate, 'day') || date.isSame(this.startDate, 'day')) {
                        // if end date available and selected date is less or equal to start date then set selected date as start and end date
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                    } else if (date.isAfter(this.endDate, 'day')) {
                        // if date is after end date then set end date
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                    }
                }
            } else {
                this.setStartDate(date.clone());
                this.setActiveDate(ActiveDateEnum.End);
            }
        } else {
            if (this.endDate) {
                // if no start date available
                if (!this.startDate) {
                    // if selected date is less or equal to end date, then set selected date as start and end date
                    if (date.isBefore(this.endDate, 'day') || date.isSame(this.endDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                    } else if (date.isAfter(this.endDate, 'day')) { // if selected date is greater than end date, then set end date
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                    }
                } else {
                    // if end date available and selected date is less or equal to start date then set selected date as start and end date
                    if (date.isAfter(this.startDate, 'day') || date.isSame(this.startDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.Start);
                        this.setEndDate(date.clone());
                    } else if (date.isBefore(this.startDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                    } else if (date.isAfter(this.endDate, 'day')) {
                        // if date is after end date then set end date
                        this.setActiveDate(ActiveDateEnum.Start);
                        this.setEndDate(date.clone());
                    }
                }
            } else {
                this.setEndDate(date.clone());
                this.setActiveDate(ActiveDateEnum.Start);
            }
        }

        if (this.endDate || date.isBefore(this.startDate, 'day')) { // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, DateType.start);
            }
        } else if (!this.endDate && date.isBefore(this.startDate)) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
        } else { // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, DateType.end);
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }

        this.updateView();

        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    }

    public setActiveDate(selectedDate: ActiveDateEnum): void {
        this.ActiveDate = selectedDate;
    }

    /**
     *  Click on the custom range
     * @param e: Event
     * @param range
     */
    public clickRange(e, range): void | boolean {
        this.invalidStartDate = "";
        this.invalidEndDate = "";

        this.selectRange(this.ranges, range.name);

        this.chosenRange = range.name;
        const dates = this.findRange(this.ranges, range.name);
        if (!dates.value || dates.value?.length === 0) {
            return false;
        }

        this.startDate = dates?.value[0].clone();
        this.endDate = dates?.value[1].clone();
        if (this.showRangeLabelOnInput && range.name !== this.locale.customRangeLabel) {
            this.chosenLabel = range.name;
        } else {
            this.calculateChosenLabel();
        }
        this.showCalInRanges = (!this.ranges?.length) || this.alwaysShowCalendars;

        if (!this.timePicker) {
            this.startDate.startOf('day');
            this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) {
            this.setActiveDate(ActiveDateEnum.Start);
            this.isShown$.next(false); // hide calendars
            this.isShown = false;
        }
        this.rangeClicked.emit({ name: range.name, startDate: dates?.value[0], endDate: dates?.value[1], event: 'save' });
        if (!this.keepCalendarOpeningWithRange) {
            this.clickApply();
        } else {
            this.initCalendar();
        }

        this.updateView();
    }

    public setSelectedRange(i: any): void {
        if (i === this.rangeDropdownShow) {
            this.rangeDropdownShow = -1;
        } else {
            this.rangeDropdownShow = i;
        }
    }
    /**
     * double clicked on a range
     * select that range and close date picker
     * @param e
     * @param range
     */
    public dblClickRange(e, range): void {
        this.clickRange(e, range);
        this.clickApply();
    }

    public show(e?): void {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown$.next(true);
        this.isShown = true;
        if (this.ActiveDate === ActiveDateEnum.End) {
            if (this.endDateElement) {
                this.endDateElement.nativeElement.focus();
            }
        } else {
            if (this.startDateElement) {
                this.startDateElement.nativeElement.focus();
            }
        }
        this.updateView();
    }

    public hide(e?): void {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }

        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        this.setActiveDate(ActiveDateEnum.Start);

        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown$.next(false);
        this.isShown = false;

        this._ref.detectChanges();
    }

    /**
     * handle click on all element in the component, usefull for outside of click
     * @param e event
     */
    @HostListener('click', ['$event'])
    handleInternalClick(e) {
        e.stopPropagation();
    }

    /**
     * update the locale options
     * @param locale
     */
    public updateLocale(locale): void {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
            }
        }
    }

    /**
     *  clear the daterange picker
     */
    public clear(): void {
        this.startDate = dayjs().startOf('day');
        this.endDate = dayjs().endOf('day');
        this.choosedDate.emit({ name: '', startDate: null, endDate: null, event: 'cancel' });
        this.emitSelectedDates(true);
        this.hide();
    }

    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    public hasCurrentMonthDays(currentMonth, row): boolean {
        for (let day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }

    public mouseEnter(date): void {
        this.hoveredDate = date;
    }

    /**
     *
     * @param date the date to add time
     * @param side start or end
     */
    private _getDateWithTime(date, side: DateType): dayjs.Dayjs {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    }

    /**
     *  build the locale config
     */
    private _buildLocale(): void {
        this.locale = { ...this._localeService.config, ...this.locale };
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = dayjs.localeData().longDateFormat('lll');
            } else {
                this.locale.format = dayjs.localeData().longDateFormat('L');
            }
        }
    }

    private _buildCells(calendar, side: DateType): void {
        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            const rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');

                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0)
                        && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }

                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0)
                        && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month()
                    && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month()
                    && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    if ((this.calendarVariables[side].calendar[1][1].month() === this.calendarVariables[side].calendar[row][col].month())) {
                        if ((this.endDate && this.startDate && this.endDate.isSame(this.startDate, 'day'))) {
                            classes.push('start-date-reset');
                        }
                        classes.push('active', 'start-date');
                    }

                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    if ((this.calendarVariables[side].calendar[1][1].month() === this.calendarVariables[side].calendar[row][col].month())) {
                        if (!(this.endDate && this.startDate && this.endDate.isSame(this.startDate, 'day'))) {
                            classes.push('active', 'end-date');
                        }
                    }
                }
                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    } else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes?.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname?.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }

    /**
     * parse given range to view model that datepicker uses
     * @param ranges
     */
    private parseRangesToVm(ranges: DateRangesInterface[]): DateRangesInterface[] {
        ranges = ranges.map(range => {
            range.isSelected = false;
            range.ranges = range.ranges ? range.ranges : [];
            range.value = range?.value ? range?.value : [];

            if (range.ranges) {
                this.parseRangesToVm(range.ranges);
            }

            return range;
        });
        return ranges;
    }

    /**
     * select range
     * @param ranges
     * @param rangeName
     */
    private selectRange(ranges: DateRangesInterface[], rangeName: string): boolean {
        let isSelected = false;
        if (ranges && ranges.length) {
            ranges.forEach(range => {
                if (range.name === rangeName) {
                    range.isSelected = true;
                    isSelected = true;
                } else {
                    if (range.ranges && range.ranges.length) {
                        range.isSelected = this.selectRange(range.ranges, rangeName);
                    } else {
                        range.isSelected = false;
                        isSelected = false;
                    }
                }
            });
        } else {
            return false;
        }
        return isSelected;
    }

    /**
     * get range object from ranges array by range name
     * @param ranges
     * @param label
     */
    private findRange(ranges, label) {
        let range;
        if (ranges && ranges.length) {
            for (let i = 0; i < ranges.length; i++) {
                const subRange = ranges[i];

                if (subRange.name === label) {
                    range = subRange;
                    return subRange;
                } else {
                    if (subRange.ranges && subRange.ranges?.length) {
                        range = this.findRange(subRange.ranges, label);
                    }
                }
            }

        } else {
            return range;
        }

        return range;
    }

    /**
     * flatten ranges array
     */
    private flattenRanges(ranges, flattenRanges = []): void {
        if (ranges && ranges.length) {
            ranges.forEach(range => {
                if (range.ranges && range.ranges.length) {
                    this.flattenRanges(range.ranges, flattenRanges);
                    flattenRanges.push(range);
                } else {
                    flattenRanges.push(range);
                }
            });
        }
    }

    /**
     * This releases the memory
     *
     * @memberof NgxDaterangepickerComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('hide-scroll-body');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will get all the financial years of the company which will be used to show financial years in dropdown, to find out date for All Time and to find min and max date in calendar
     *
     * @memberof NgxDaterangepickerComponent
     */
    public getFinancialYears(): void {
        this.settingsFinancialYearService.GetAllFinancialYears().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res && res.body && res.body.financialYears && res.body.financialYears.length > 0) {
                let currentFinancialYear;
                let lastFinancialYear;
                let allFinancialYears = [];

                if (res.body.financialYears[0].financialYearStarts) {
                    this.minDate = dayjs(dayjs(res.body.financialYears[0].financialYearStarts, GIDDH_DATE_FORMAT).toDate());
                }

                if (res.body.financialYears[res.body.financialYears.length - 1].financialYearEnds) {
                    this.maxDate = dayjs(dayjs(res.body.financialYears[res.body.financialYears.length - 1].financialYearEnds, GIDDH_DATE_FORMAT).toDate());
                }

                const currentDate = dayjs().format(GIDDH_DATE_FORMAT);
                this.financialYears = [];
                res.body.financialYears.forEach(key => {
                    let financialYearStarts = dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    this.financialYears.push({ label: financialYearStarts + " - " + financialYearEnds, value: key });

                    if (this.currentFinancialYearUniqueName && this.currentFinancialYearUniqueName === key?.uniqueName) {
                        lastFinancialYear = { start: dayjs(dayjs(key.financialYearStarts.split("-").reverse().join("-")).subtract(1, 'year').toDate()), end: dayjs(dayjs(key.financialYearEnds.split("-").reverse().join("-")).subtract(1, 'year').toDate()) };
                    }

                    if (dayjs(currentDate, GIDDH_DATE_FORMAT) >= dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT) && dayjs(currentDate, GIDDH_DATE_FORMAT) <= dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT)) {
                        currentFinancialYear = dayjs(dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).toDate());
                    }

                    if (allFinancialYears?.indexOf(dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).format("YYYY")) === -1) {
                        allFinancialYears.push(dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).format("YYYY"));
                    }

                    if (allFinancialYears?.indexOf(dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT).format("YYYY")) === -1) {
                        allFinancialYears.push(dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT).format("YYYY"));
                    }

                });
                if (this.ranges && this.ranges.length > 0) {
                    let loop = 0;
                    let ranges = [];
                    this.ranges.forEach(key => {
                        if (key.name === DatePickerDefaultRangeEnum.AllTime) {
                            ranges[loop] = key;
                            ranges[loop].value = [
                                dayjs(dayjs(res.body.financialYears[0].financialYearStarts, GIDDH_DATE_FORMAT).toDate()),
                                dayjs()
                            ];
                            loop++;
                        } else if (key.name === DatePickerDefaultRangeEnum.ThisFinancialYearToDate && currentFinancialYear) {
                            ranges[loop] = key;
                            ranges[loop].value = [
                                currentFinancialYear,
                                dayjs()
                            ];
                            loop++;
                        } else if (key.name === DatePickerDefaultRangeEnum.LastFinancialYear) {
                            if (lastFinancialYear && lastFinancialYear.start && lastFinancialYear.end && allFinancialYears?.indexOf(lastFinancialYear.start.format("YYYY")) > -1) {
                                ranges[loop] = key;

                                ranges[loop].value = [
                                    lastFinancialYear.start,
                                    lastFinancialYear.end
                                ];
                                loop++;
                            }
                        } else {
                            ranges[loop] = key;
                            loop++;
                        }
                    });

                    this.ranges.forEach(key => {
                        key.name = this.commonLocaleData?.app_datepicker?.ranges[key.key];
                    });

                    this.ranges = ranges;
                }
            }
        });
    }

    /**
     * This will set the start and end date based on the choosen financial year
     *
     * @param {*} financialYear
     * @memberof NgxDaterangepickerComponent
     */
    public clickFinancialYear(financialYear): void {
        this.startDate = dayjs(new Date(financialYear?.value.financialYearStarts.split("-").reverse().join("-")));
        this.endDate = dayjs(new Date(financialYear?.value.financialYearEnds.split("-").reverse().join("-")));
        this.chosenLabel = this.startDate.format(GIDDH_DATE_FORMAT) + " - " + this.endDate.format(GIDDH_DATE_FORMAT);
        this.showCalInRanges = (!this.ranges?.length) || this.alwaysShowCalendars;

        if (!this.timePicker) {
            this.startDate.startOf('day');
            this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) {
            this.setActiveDate(ActiveDateEnum.Start);
            this.isShown$.next(false); // hide calendars
            this.isShown = false;
        }
        this.rangeClicked.emit({ name: financialYear.label, startDate: this.startDate, endDate: this.endDate, event: 'save' });
        if (!this.keepCalendarOpeningWithRange) {
            this.clickApply();
        } else {
            this.initCalendar();
        }

        this.updateView();
    }

    /**
     * This is used to remove duplicate datepickers from page
     *
     * @memberof NgxDaterangepickerComponent
     */
    public removeDuplicateDatepickers(): void {
        if (document.getElementsByTagName("ngx-daterangepicker-material")?.length > 1) {
            for (let loop = 0; loop < document.getElementsByTagName("ngx-daterangepicker-material")?.length; loop++) {
                document.getElementsByTagName("ngx-daterangepicker-material")[loop]?.remove();
            }
        }
    }

    /**
     * This is used to append datepicker to body
     *
     * @memberof NgxDaterangepickerComponent
     */
    public appendDatepickerToBody(): void {
        if (document.getElementsByTagName("ngx-daterangepicker-material") && document.getElementsByTagName("ngx-daterangepicker-material")[0]) {
            document.body.appendChild(document.getElementsByTagName("ngx-daterangepicker-material")[0]);
            this.isShown$.next(true);
        }
    }

    /**
     * This is used to add next/previous months in the list of months in calendar scroll
     *
     * @param {string} direction
     * @memberof NgxDaterangepickerComponent
     */
    public onScroll(direction: string): void {
        if (direction === "bottom") {
            if (this.singleDatePicker) {
                if ((this.maxDate && this.maxDate.isAfter(this.calendarVariables.start.calendar.lastDay)) && (!this.linkedCalendars || this.singleDatePicker)) {
                    this.initialCalendarMonths = false;
                    this.goToNextMonth();
                }
            } else {
                if (this.maxDate && this.maxDate.isAfter(this.calendarVariables.end.calendar.lastDay)) {
                    this.initialCalendarMonths = false;
                    this.goToNextMonth();
                }
            }
        }

        if (direction === "top") {
            if (this.singleDatePicker) {
                if ((this.minDate && this.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) && (!this.linkedCalendars || this.singleDatePicker)) {
                    this.initialCalendarMonths = false;
                    this.goToPrevMonth();
                }
            } else {
                if (this.minDate && this.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) {
                    this.initialCalendarMonths = false;
                    this.goToPrevMonth();
                }
            }
        }

        this.isOnScrollActive = false;
    }

    /**
     * This functions add the new months in the list of calendar months
     *
     * @memberof NgxDaterangepickerComponent
     */
    public addMonthInCalendarMonths(): void {
        this.calendarMonths = [];
        this.calendarMonths.push(this.calendarVariables);
        this.setActiveMonth(this.calendarMonths[0], "start");
    }

    /**
     * This renders the initial 2 months in calendar
     *
     * @memberof NgxDaterangepickerComponent
     */
    public initCalendar(): void {
        this.renderCalendar(DateType.start);
        this.renderCalendar(DateType.end);
    }

    /**
     * This is used to get all years between dates
     *
     * @memberof NgxDaterangepickerComponent
     */
    public getAllYearsBetweenDates(): void {
        let minYear = new Date(this.minDate.toDate()).getFullYear();
        let maxYear = new Date(this.maxDate.toDate()).getFullYear();

        let allowedYears = [];
        for (minYear; minYear <= maxYear; minYear++) {
            allowedYears.push(minYear);
        }
        this.allowedYears = allowedYears;
    }

    /**
     * This is used to save dates in variables from mobile device edit popup
     *
     * @param {*} event
     * @memberof NgxDaterangepickerComponent
     */
    public saveInlineDates(event): void {
        let inlineDate = dayjs(new Date(event.target?.value.split("-").reverse().join("-")));

        if (event.target.name === "inlineStartDate") {
            document.getElementsByTagName("ngx-daterangepicker-material")[0].classList.add("focus-start-date");
            this.invalidInlineStartDate = "";
            if (inlineDate.format("dddd") !== this.commonLocaleData?.app_datepicker?.invalid_date) {
                this.inlineStartDate = inlineDate;
            } else {
                this.invalidInlineStartDate = this.commonLocaleData?.app_datepicker?.invalid_date;
            }
        }
        if (event.target.name === "inlineEndDate") {
            document.getElementsByTagName("ngx-daterangepicker-material")[0].classList.add("focus-start-date");
            this.invalidInlineEndDate = "";
            if (inlineDate.format("dddd") !== this.commonLocaleData?.app_datepicker?.invalid_date) {
                this.inlineEndDate = inlineDate;
            } else {
                this.invalidInlineEndDate = this.commonLocaleData?.app_datepicker?.invalid_date;
            }
        }
    }

    /**
     * This is used to apply the selected dates
     *
     * @memberof NgxDaterangepickerComponent
     */
    public applyInlineDates(): void {
        if (this.inlineStartDate.isSameOrBefore(this.inlineEndDate, 'day')) {
            if (!this.invalidInlineStartDate && !this.invalidInlineEndDate) {
                this.startDate = this.inlineStartDate;
                this.endDate = this.inlineEndDate;
                this.modalRef.hide();
                this.clickApply();
            }
        } else {
            this.invalidInlineDate = this.commonLocaleData?.app_datepicker?.date_error;
        }
    }

    /**
     * This is used to mobile datepicker in mobile
     *
     * @memberof NgxDaterangepickerComponent
     */
    public openMobileDatepicker(): void {
        this.allowMouseScroll = true;
        this.openMobileDatepickerPopup = true;
        document.querySelector('body').classList.add('hide-scroll-body');
    }

    /**
     * This is used to emit the selected dates
     *
     * @param {boolean} sendBlankDates
     * @memberof NgxDaterangepickerComponent
     */
    public emitSelectedDates(sendBlankDates: boolean): void {
        if (sendBlankDates === true) {
            this.datesUpdated.emit({ name: '', startDate: null, endDate: null, event: 'save' });
        } else {
            this.datesUpdated.emit({ name: this.selectedRangeLabel, startDate: this.startDate, endDate: this.endDate, event: 'save' });
        }
    }

    /**
     * This is used to restrict scroll on page if focus of mouse is inside calendar
     *
     * @memberof NgxDaterangepickerComponent
     */
    public restrictBodyScroll(): void {
        document.querySelector('body').classList.add('prevent-body-scroll');
        this.allowMouseScroll = true;
    }

    /**
     * This is used to allow scroll on page if focus of mouse is outside calendar
     *
     * @memberof NgxDaterangepickerComponent
     */
    public allowBodyScroll(): void {
        document.querySelector('body').classList.remove('prevent-body-scroll');
        this.allowMouseScroll = false;
    }

    /**
     * This is used to set current hovered month as active on show on calendar as current month
     *
     * @param {*} calendar
     * @memberof NgxDaterangepickerComponent
     */
    public setActiveMonth(calendar: any, side: string): void {
        this.activeMonthHover = true;
        this.lastActiveMonthSide = side;
        if (side === 'start') {
            this.activeMonth = calendar.start;
        } else {
            this.activeMonth = calendar.end;
        }
    }

    /**
     * Once scrolling reaches to top, this will set calendar to 1st available month
     *
     * @memberof NgxDaterangepickerComponent
     */
    public setCalendarToActiveMonth(position: string): void {
        let index = 0;
        if (position === "end") {
            if (this.calendarMonths && this.calendarMonths.length > 0) {
                index = this.calendarMonths.length - 1;
            }
        }

        if (this.calendarMonths && this.calendarMonths[index]) {
            let setMonth = dayjs();
            setMonth.set('date', 1);

            if (this.calendarMonths[index].start) {
                setMonth.set('year', this.calendarMonths[index].start.year);
                setMonth.set('month', this.calendarMonths[index].start.month);
                this.startCalendar.month = setMonth;
            } else if (this.calendarMonths[index].end) {
                setMonth.set('year', this.calendarMonths[index].end.year);
                setMonth.set('month', this.calendarMonths[index].end.month);
                this.startCalendar.month = setMonth;
            }
        }
    }

    /**
     * This will work in case of mouse wheel not used and manually dragged the scrollbar in top direction
     *
     * @memberof NgxDaterangepickerComponent
     */
    public scrollUp(): void {
        if (!this.isOnScrollActive) {
            this.scrollTopSubject$.next("top");
        }
    }

    /**
     * This will work in case of mouse wheel not used and manually dragged the scrollbar in bottom direction
     *
     * @memberof NgxDaterangepickerComponent
     */
    public scrollDown(): void {
        if (!this.isOnScrollActive) {
            this.scrollBottomSubject$.next("bottom");
        }
    }

    /**
     * This will check if any sub range is selected
     *
     * @param {*} range
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkIfSubRangeSelected(range: any): boolean {
        let isSelected = false;
        if (this.selectedRangeLabel && range.ranges && range.ranges.length > 0) {
            range.ranges.forEach(subRange => {
                if (!isSelected && subRange.name === this.selectedRangeLabel) {
                    isSelected = true;
                }
            });
        }

        return isSelected;
    }

    /**
     * This will check if any financial year is selected
     *
     * @param {*} financialYears
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkIfFinancialYearSelected(financialYears: any): boolean {
        let isSelected = false;
        if (this.selectedRangeLabel && financialYears && financialYears.length > 0) {
            financialYears.forEach(year => {
                if (!isSelected && year.label === this.selectedRangeLabel) {
                    isSelected = true;
                }
            });
        }

        return isSelected;
    }

    /**
     * This function will return if going to next month is available
     *
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkIfScrollToNextMonthAvailable(): boolean {
        let isAvailable = false;

        if (this.singleDatePicker) {
            if ((!this.calendarVariables.start.maxDate || this.calendarVariables.start.maxDate.isAfter(this.calendarVariables.start.calendar.lastDay)) && (!this.linkedCalendars || this.singleDatePicker)) {
                isAvailable = true;
            }
        } else {
            if (this.maxDate && this.maxDate.isAfter(this.calendarVariables.end.calendar.lastDay)) {
                isAvailable = true;
            }
        }

        return isAvailable;
    }

    /**
     * This function will return if going to previous month is available
     *
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkIfScrollToPreviousMonthAvailable(): boolean {
        let isAvailable = false;

        if (this.singleDatePicker) {
            if (!this.calendarVariables.start.minDate || this.calendarVariables.start.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) {
                isAvailable = true;
            }
        } else {
            if (this.minDate && this.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) {
                isAvailable = true;
            }
        }

        return isAvailable;
    }

    @HostListener('window:resize', ['$event'])
    windowResize(event) {
        if (!this.isMobileScreen) {
            this.datesUpdated.emit({ name: this.selectedRangeLabel, startDate: this.inputStartDate, endDate: this.inputEndDate, event: 'cancel' });
            this.hide();
        }
    }

    @HostListener('window:orientationchange', ['$event'])
    onOrientationChange(event) {
        this.isMobileScreen = false;
        this.datesUpdated.emit({ name: this.selectedRangeLabel, startDate: this.inputStartDate, endDate: this.inputEndDate, event: 'cancel' });
        this.hide();
    }

    /**
     * This will update the index of scrolled element
     *
     * @param {*} event
     * @memberof NgxDaterangepickerComponent
     */
    public updateScrollIndex(event: number): void {
        if (this.currentScrollIndex) {
            this.previousScrollIndex = this.currentScrollIndex;
        }
        this.currentScrollIndex = event;

        if (this.scrollInDirection === "top") {
            if (this.lastActiveMonthSide === "end") {
                if (this.calendarMonths[this.currentScrollIndex] && this.calendarMonths[this.currentScrollIndex].start) {
                    this.setActiveMonth(this.calendarMonths[this.currentScrollIndex], "start");
                } else {
                    let scrollIndex = 0;
                    if (this.currentScrollIndex > 0) {
                        scrollIndex = this.currentScrollIndex;
                    }

                    if (this.calendarMonths[scrollIndex]) {
                        if (this.calendarMonths[scrollIndex].end) {
                            this.setActiveMonth(this.calendarMonths[scrollIndex], "end");
                        } else if (this.calendarMonths[scrollIndex].start) {
                            this.setActiveMonth(this.calendarMonths[scrollIndex], "start");
                        }
                    }
                }
            } else {
                let scrollIndex = 0;
                if (this.currentScrollIndex > 0) {
                    scrollIndex = this.currentScrollIndex;
                }

                if (this.calendarMonths[scrollIndex]) {
                    if (this.calendarMonths[scrollIndex].end) {
                        this.setActiveMonth(this.calendarMonths[scrollIndex], "end");
                    } else if (this.calendarMonths[scrollIndex].start) {
                        this.setActiveMonth(this.calendarMonths[scrollIndex], "start");
                    }
                }
            }
        } else {
            if (this.lastActiveMonthSide === "start") {
                if (this.calendarMonths[this.currentScrollIndex] && this.calendarMonths[this.currentScrollIndex].end) {
                    this.setActiveMonth(this.calendarMonths[this.currentScrollIndex], "end");
                } else {
                    let scrollIndex = this.currentScrollIndex + 1;

                    if (this.calendarMonths[scrollIndex]) {
                        if (this.calendarMonths[scrollIndex].start) {
                            this.setActiveMonth(this.calendarMonths[scrollIndex], "start");
                        } else if (this.calendarMonths[scrollIndex].end) {
                            this.setActiveMonth(this.calendarMonths[scrollIndex], "end");
                        }
                    }
                }
            } else {
                let scrollIndex = this.currentScrollIndex;

                if (this.calendarMonths[scrollIndex]) {
                    if (this.calendarMonths[scrollIndex].start) {
                        this.setActiveMonth(this.calendarMonths[scrollIndex], "start");
                    } else if (this.calendarMonths[scrollIndex].end) {
                        this.setActiveMonth(this.calendarMonths[scrollIndex], "end");
                    }
                }
            }
        }

        this.scrollInDirection = "";
    }

    /**
     * This will update that in which direction we need to scroll
     *
     * @param {string} direction
     * @memberof NgxDaterangepickerComponent
     */
    public initiateScrollToIndex(direction: string): void {
        this.scrollInDirection = direction;
    }

    /**
     * This will validate if the rendering month is valid or not
     *
     * @param {*} date
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkMinMaxDate(date: any): boolean {
        let isValidDate = false;

        if (dayjs().set("year", date.year).set("month", date.month).set("date", 1).startOf('M').isSameOrAfter(this.minDate) && dayjs().set("year", date.year).set("month", date.month).set("date", 1).startOf('M').isSameOrBefore(this.maxDate)) {
            isValidDate = true;
        }

        return isValidDate;
    }

    /**
     * This will validate if month/year is valid or not
     *
     * @param {*} year
     * @param {*} month
     * @returns {boolean}
     * @memberof NgxDaterangepickerComponent
     */
    public checkValidMonthYear(year: any, month: any): boolean {
        let isValidDate = false;

        if (dayjs().set("year", year).set("month", month).set("date", 1).startOf('M').isSameOrAfter(this.minDate) && dayjs().set("year", year).set("month", month).set("date", 1).startOf('M').isSameOrBefore(this.maxDate)) {
            isValidDate = true;
        }

        return isValidDate;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof NgxDaterangepickerComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.getFinancialYears();

            this.locale.monthNames = this.commonLocaleData?.app_datepicker?.months;

            const daysOfWeek = [...this.commonLocaleData?.app_datepicker?.weekdays];
            if (this.locale.firstDay !== 0) {
                let iterator = this.locale.firstDay;

                while (iterator > 0) {
                    daysOfWeek.push(daysOfWeek.shift());
                    iterator--;
                }
            }
            this.locale.daysOfWeek = daysOfWeek;
            if (this.locale.firstDay !== 0) {
                let iterator = this.locale.firstDay;
                while (iterator > 0) {
                    this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                    iterator--;
                }
            }
        }
    }
}
