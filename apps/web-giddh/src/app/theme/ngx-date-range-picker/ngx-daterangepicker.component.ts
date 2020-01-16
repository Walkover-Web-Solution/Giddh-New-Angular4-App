import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { LocaleConfig } from './ngx-daterangepicker.config';

const moment = _moment;

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
    firstDay?: Moment;
    lastDay?: Moment;
    lastMonth?: number;
    lastYear?: number;
    daysInLastMonth?: number;
    dayOfWeek?: number;
    // other vars
    calRows?: number[];
    calCols?: number[];
    classes?: any;
    minDate?: Moment;
    maxDate?: Moment;
    calendar?: Calender;
    dropdowns?: MonthVariable;
}

export class Calender {
    [key: number]: Moment;

    firstDay: Moment;
    lastDay: Moment;
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
    name: string;
    value: any[];
    ranges: any[];
    isSelected: boolean;
}

export interface DateRangeClicked {
    name: string;
    startDate: Moment;
    endDate: Moment;
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
export class NgxDaterangepickerComponent implements OnInit {
    chosenLabel: string;
    calendarVariables: CalendarVariables = {start: {}, end: {}};
    timepickerVariables: { start: any, end: any } = {start: {}, end: {}};
    // daterangepicker: { start: FormControl, end: FormControl } = {start: new FormControl(), end: new FormControl()};
    applyBtn: { disabled: boolean } = {disabled: false};
    startDate = moment().startOf('day');
    endDate = moment().endOf('day');
    ActiveDate: ActiveDateEnum = ActiveDateEnum.Start;
    @Input()
    ActiveSelectedDateClass = 'activeSelectedDate';
    dateLimit = null;
    // used in template for compile time support of enum values.
    sideEnum = DateType;
    hoveredDate: any;
    @ViewChild('startDateElement') startDateElement: ElementRef;
    @ViewChild('endDateElement') endDateElement: ElementRef;
    @Input()
    minDate: _moment.Moment = moment().subtract(10, 'years');
    @Input()
    maxDate: _moment.Moment = moment().add(5, 'years');
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
    chosenRange: string;
    // some state information
    isShown: boolean = false;
    inline = true;
    startCalendar: any = {};
    endCalendar: any = {};
    showCalInRanges: boolean = false;
    options: any = {}; // should get some opt from user
    @Input() drops: string;
    @Input() opens: string;
    @Output() choosedDate: EventEmitter<DateRangeClicked>;
    @Output() rangeClicked: EventEmitter<DateRangeClicked>;
    @Output() datesUpdated: EventEmitter<DateRangeClicked>;
    @ViewChild('pickerContainer') pickerContainer: ElementRef;
    showMonthPicker = false;

    public goToPreviousMonthDisabled: boolean = false;
    public goToNextMonthDisabled: boolean = false;

    private _old: { start: any, end: any } = {start: null, end: null};

    constructor(
        private _ref: ChangeDetectorRef,
        private localeConfig: LocaleConfig
    ) {
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.locale = {...this._locale};
        this.updateMonthsInView();
    }

    _locale: LocaleConfig = {};

    get locale(): any {
        return this._locale;
    }

    @Input() set locale(value) {
        this._locale = {...this.localeConfig, ...value};
    }

    get startDateString(): string {
        if (this.startDate) {
            return this.startDate.format(this.locale.format);
        }
        return '';
    }

    get endDateString(): string {
        if (this.endDate) {
            return this.endDate.format(this.locale.format);
        }
        return '';
    }

    ngOnInit() {
        this.renderRanges();
        this.emptyWeekRowClass = 'hideMe';
        if (this.locale.firstDay !== 0) {
            let iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            } else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
        this.renderCalendar(DateType.start);
        this.renderCalendar(DateType.end);
    }

    /**
     * check whether go to previous and go to next month are allowed
     */
    private checkNavigateMonthsHolders() {
        // for single date picker
        if (this.singleDatePicker) {
            this.goToPreviousMonthDisabled = this.startCalendar.month.startOf('d').isBefore(this.minDate);
            this.goToNextMonthDisabled = this.startCalendar.month.startOf('d').isBefore(this.maxDate);
        } else {
            // for date range picker

            // check if start calender month start day is before or same as min date then don't allow to go to previous month
            this.goToPreviousMonthDisabled = moment([this.startCalendar.month.year(), this.startCalendar.month.month(), 1]).startOf('M')
                .isSameOrBefore(this.minDate);

            // check if end calender month end day is after or same as max date then don't allow to go to next month
            this.goToNextMonthDisabled = moment([this.endCalendar.month.year(), this.endCalendar.month.month(), 1]).endOf('M')
                .isSameOrAfter(this.maxDate);
        }
    }

    /**
     * render ranges to ui
     * check various start and end date validation in given ranges
     */
    renderRanges() {
        this.ranges = this.parseRangesToVm(this.ranges);

        // if there's no ranges given, display calender in place of ranges list
        this.showCalInRanges = (!this.ranges.length) || this.alwaysShowCalendars;

        // if no time picker is defined then,
        // set start date as start of start date
        // and end date as end of end date
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
        }

        // can't be used together for now
        if (this.timePicker && this.autoApply) {
            this.autoApply = false;
        }
    }

    private rangeValidator(ranges, range) {
        let start, end;
        // set range start date
        if (typeof ranges[range][0] === 'string') {
            start = moment(ranges[range][0], this.locale.format);
        } else {
            start = moment(ranges[range][0]);
        }

        // set range end date
        if (typeof ranges[range][1] === 'string') {
            end = moment(ranges[range][1], this.locale.format);
        } else {
            end = moment(ranges[range][1]);
        }

        // If the start or end date exceed those allowed by the minDate or maxSpan
        // options, shorten the range to the allowable period.

        // if start date is before min date, replace start date with min date
        if (this.minDate && start.isBefore(this.minDate)) {
            start = this.minDate.clone();
        }

        let maxDate = this.maxDate;
        if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
            maxDate = start.clone().add(this.maxSpan);
        }

        // if end date is after max date, replace max date with max date
        if (maxDate && end.isAfter(maxDate)) {
            end = maxDate.clone();
        }
        return {start, maxDate, end};
    }

    renderTimePicker(side: DateType) {
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

            const am_html = '';
            const pm_html = '';

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

    renderCalendar(side: DateType) { // side enum
        const mainCalendar: any = (side === DateType.start) ? this.startCalendar : this.endCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay).subtract(1, 'month').month();
        const lastYear = moment(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
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

        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
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
            // debugger;
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

        this.checkNavigateMonthsHolders();
    }

    setStartDate(startDate) {
        if (!moment(startDate, this.locale.format, true).isValid()) {
            return;
        }
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }

        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }

        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            console.log('formatted start date :-', this.startDate.format(this.locale.format));
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }

        }

        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }

        if (!this.isShown) {
            this.updateElement();
        }

        this.updateMonthsInView();
        this.updateView();
    }

    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }

        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }

        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }

        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }

        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }

        if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit);
        }

        if (!this.isShown) {
            // this.updateElement();
        }
        this.updateMonthsInView();
        if (this.autoApply) {
            this.datesUpdated.emit({name: '', startDate: this.startDate, endDate: this.endDate});
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

    updateView() {
        if (this.timePicker) {
            this.renderTimePicker(DateType.start);
            this.renderTimePicker(DateType.end);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }

    monthPickerClick() {
        this.showMonthPicker = !this.showMonthPicker;
    }

    updateMonthsInView() {
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
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.endCalendar.month > this.maxDate) {
            this.endCalendar.month = this.maxDate.clone().date(2);
            this.startCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    }

    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(DateType.start);
        this.renderCalendar(DateType.end);

        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }

    updateElement() {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on inpu
                if (this.ranges.length && this.showRangeLabelOnInput === true && this.chosenRange &&
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

    remove() {
        this.setActiveDate(ActiveDateEnum.Start);
        this.isShown = false;
    }

    /**
     * this should calculate the label
     */
    calculateChosenLabel() {
        if (this.ranges.length > 0) {
            const flattenRanges = [];
            this.flattenRanges(this.ranges, flattenRanges);

            flattenRanges.forEach(range => {
                if (this.timePicker) {
                    const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';

                    if (!range.ranges.length) {
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === range.value[0].format(format)
                            && this.endDate.format(format) === range.value[1].format(format)) {
                            this.selectRange(this.ranges, range.name);
                        }
                    }
                } else {
                    if (!range.ranges.length) {
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

    clickApply(e?) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            const d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({name: this.chosenLabel, startDate: this.startDate, endDate: this.endDate});
        }

        this.datesUpdated.emit({name: '', startDate: this.startDate, endDate: this.endDate});
        this.hide();
    }

    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    }

    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side start or end
     */
    monthChanged(monthEvent: any, side: DateType) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }

    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side start or end
     */
    yearChanged(yearEvent: any, side: DateType) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }

    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side start or end
     */
    timeChanged(timeEvent: any, side: DateType) {

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
    monthOrYearChanged(month: number, year: number, side: DateType) {
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
    goToPrevMonth() {
        if (!this.singleDatePicker) {
            this.startCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.endCalendar.month.subtract(1, 'month');
            }
        } else {
            this.endCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }

    /**
     * Click on next month
     */
    goToNextMonth() {
        if (!this.singleDatePicker) {
            this.endCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.startCalendar.month.add(1, 'month');
            }
        } else {
            this.startCalendar.month.add(1, 'month');
        }
        this.updateCalendars();
    }

    clickNextYear(side: DateType) {
        if (side === DateType.start) {
            this.startCalendar.month.add(1, 'year');
        } else {
            this.endCalendar.month.add(1, 'year');
            if (this.linkedCalendars) {
                this.startCalendar.month.add(1, 'year');
            }
        }
        this.updateCalendars();
    }

    /**
     * Click on previous month
     * @param side start or end calendar
     */
    clickPrevYear(side: DateType) {
        if (side === DateType.start) {
            this.startCalendar.month.subtract(1, 'year');
            if (this.linkedCalendars) {
                this.endCalendar.month.subtract(1, 'year');
            }
        } else {
            this.endCalendar.month.subtract(1, 'year');
        }
        this.updateCalendars();
    }

    setMonth(year: number, month: number) {
        this.startCalendar.month = moment({y: year, M: month, d: 1});
        if (this.linkedCalendars) {
            this.endCalendar.month = moment({y: year, M: month, d: 1}).add(1, 'month');
        }
        this.updateCalendars();
        this.showMonthPicker = false;
        // this.s
    }

    mouseUp(e: MouseWheelEvent) {
        // debugger;
        if (e.deltaY < 0) {
            if (this.singleDatePicker) {
                if ((!this.calendarVariables.start.maxDate ||
                    this.calendarVariables.start.maxDate.isAfter(this.calendarVariables.start.calendar.lastDay)) &&
                    (!this.linkedCalendars || this.singleDatePicker)) {
                    this.goToNextMonth();
                }
            } else {
                if (!this.calendarVariables.end.maxDate ||
                    this.calendarVariables.end.maxDate.isAfter(this.calendarVariables.end.calendar.lastDay)) {
                    this.goToNextMonth();
                }
            }
        }
        if (e.deltaY > 0) {
            if (this.singleDatePicker) {
                if (!this.calendarVariables.start.minDate ||
                    this.calendarVariables.start.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) {
                    this.goToPrevMonth();
                }
                // this.goToNextMonth(DateType.start);
            } else {
                if (!this.calendarVariables.start.minDate ||
                    this.calendarVariables.start.minDate.isBefore(this.calendarVariables.start.calendar.firstDay)) {
                    this.goToPrevMonth();
                }
            }
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }

    mouseUpYear(e: MouseWheelEvent) {
        if (e.deltaY < 0) {
            if (this.singleDatePicker) {
                if ((!this.calendarVariables.start.maxDate ||
                    this.calendarVariables.start.maxDate.isAfter(this.calendarVariables.start.calendar.lastDay)) &&
                    (!this.linkedCalendars || this.singleDatePicker)) {
                    this.clickNextYear(DateType.start);
                }
            } else {
                if (!this.calendarVariables.end.maxDate ||
                    this.calendarVariables.end.maxDate.isAfter(this.calendarVariables.end.calendar.lastDay)
                    && (!this.linkedCalendars || this.singleDatePicker)) {
                    this.clickNextYear(DateType.end);
                }
            }
        }
        if (e.deltaY > 0) {
            if (this.singleDatePicker) {
                if (!this.calendarVariables.start.minDate ||
                    this.calendarVariables.start.minDate.isBefore(this.calendarVariables.start.calendar.firstDay) &&
                    (!this.linkedCalendars)) {
                    this.clickPrevYear(DateType.start);
                }
                // this.goToNextMonth(DateType.start);
            } else {
                if (!this.calendarVariables.start.minDate ||
                    this.calendarVariables.start.minDate.isBefore(this.calendarVariables.start.calendar.firstDay) &&
                    (!this.linkedCalendars)) {
                    this.clickPrevYear(DateType.start);
                }
            }
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }

    /**
     * key up event for up to input boxes
     * ensure only number are added in that tax box
     * @param event
     */
    uptoInputKeyUp(event) {
        if (event.shiftKey || event.ctrlKey || (event.which >= 37 && event.which <= 40)) {
            return;
        }
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    uptoToday(e: Event, days: number) {
        const dates = [moment().subtract(days ? (days - 1) : days, 'days'), moment()];
        this.startDate = dates[0].clone();
        this.endDate = dates[1].clone();

        this.calculateChosenLabel();
        this.updateView();
    }

    uptoYesterday(e: Event, days: number) {
        const dates = [moment().subtract(days, 'days'), moment().subtract(days ? 1 : 0, 'days')];
        this.startDate = dates[0].clone();
        this.endDate = dates[1].clone();

        this.calculateChosenLabel();
        this.updateView();
    }

    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side start or end
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side: DateType, row: number, col: number) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        } else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.ranges.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        if (!(this.calendarVariables[side].calendar[1][1].month() === this.calendarVariables[side].calendar[row][col].month())) {
            return;
        }
        let date = side === DateType.start ? this.startCalendar.calendar[row][col] : this.endCalendar.calendar[row][col];

        if (this.ActiveDate === ActiveDateEnum.Start) {
            if (this.startDate) {

                if (!this.endDate) {
                    if (date.isAfter(this.startDate, 'day')) {
                        this.setActiveDate(ActiveDateEnum.End);
                        this.setEndDate(date.clone());
                    }
                } else {

                    // check if start date and end date are set
                    if (this.startDate.isSame(this.endDate, 'day')) {
                        if (date.isAfter(this.endDate, 'day')) {
                            this.setActiveDate(ActiveDateEnum.End);
                            this.setEndDate(date.clone());
                        }

                        if (date.isBefore(this.startDate, 'day')) {
                            this.setStartDate(date.clone());
                            this.setActiveDate(ActiveDateEnum.End);
                        }
                    } else {
                        if (date.isAfter(this.endDate, 'day')) {
                            this.setActiveDate(ActiveDateEnum.End);
                            this.setStartDate(date.clone());
                            this.setEndDate(date.clone());
                        }

                        if (date.isBefore(this.startDate, 'day')) {
                            this.setStartDate(date.clone());
                        }

                        if (date.isAfter(this.startDate, 'day') && date.isBefore(this.endDate, 'day')) {
                            this.setEndDate(date.clone());
                            this.setActiveDate(ActiveDateEnum.End);
                        }
                    }
                }

                if (date.isBefore(this.startDate, 'day')) {
                    this.setStartDate(date.clone());
                }

            }
        } else {
            if (this.endDate) {

                if (this.startDate) {

                    if (date.isBefore(this.startDate, 'day')) {
                        this.setStartDate(date.clone());
                        this.setEndDate(date.clone());
                        this.setActiveDate(ActiveDateEnum.End);
                        return;
                    }

                    if (date.isAfter(this.endDate, 'day')) {
                        this.setEndDate(date.clone());
                        this.setActiveDate(ActiveDateEnum.Start);
                    }
                }

                if (this.endDate.isBefore(date, 'day')) {
                    this.setEndDate(date.clone());
                }

                if (this.endDate.isAfter(date, 'day')) {
                    this.setEndDate(date.clone());
                    this.setActiveDate(ActiveDateEnum.Start);
                }

                if (date.isBefore(this.startDate, 'day')) {
                    this.endDate = null;
                    this.setActiveDate(ActiveDateEnum.Start);
                    this.setStartDate(date.clone());
                }
            } else {
                this.setEndDate(date.clone());
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

        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }

        this.updateView();

        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();

    }

    setActiveDate(selectedDate: ActiveDateEnum) {
        this.ActiveDate = selectedDate;
    }

    /**
     *  Click on the custom range
     * @param e: Event
     * @param range
     */
    clickRange(e, range) {
        this.selectRange(this.ranges, range.name);

        this.chosenRange = range.name;
        const dates = this.findRange(this.ranges, range.name);
        this.startDate = dates.value[0].clone();
        this.endDate = dates.value[1].clone();
        if (this.showRangeLabelOnInput && range.name !== this.locale.customRangeLabel) {
            this.chosenLabel = range.name;
        } else {
            this.calculateChosenLabel();
        }
        this.showCalInRanges = (!this.ranges.length) || this.alwaysShowCalendars;

        if (!this.timePicker) {
            this.startDate.startOf('day');
            this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) {
            this.setActiveDate(ActiveDateEnum.Start);
            this.isShown = false; // hide calendars
        }
        this.rangeClicked.emit({name: range.name, startDate: dates.value[0], endDate: dates.value[1]});
        if (!this.keepCalendarOpeningWithRange) {
            this.clickApply();
        } else {
            this.renderCalendar(DateType.start);
            this.renderCalendar(DateType.end);
        }

        this.updateView();
    }

    /**
     * double clicked on a range
     * select that range and close date picker
     * @param e
     * @param range
     */
    dblClickRange(e, range) {
        this.clickRange(e, range);
        this.clickApply();
    }

    show(e?) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        if (this.ActiveDate === ActiveDateEnum.End) {
            this.endDateElement.nativeElement.focus();
        } else {
            this.startDateElement.nativeElement.focus();
        }
        this.updateView();
    }

    hide(e?) {
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
    updateLocale(locale) {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
            }
        }
    }

    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({name: '', startDate: null, endDate: null});
        this.datesUpdated.emit({name: '', startDate: null, endDate: null});
        this.hide();
    }

    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(ranges, range) {
        // if range have sub-range then don't disable it
        if (range.ranges && range.ranges.length) {
            return false;
        }
        const rangeMarkers = ranges.find(r => r.name === range.name);
        const areBothBefore = rangeMarkers.value.every(date => {
            if (!this.minDate) {
                return false;
            }
            return date.isBefore(this.minDate);
        });

        const areBothAfter = rangeMarkers.value.every(date => {
            if (!this.maxDate) {
                return false;
            }
            return date.isAfter(this.maxDate);
        });
        return (areBothBefore || areBothAfter);
    }

    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }

    public mouseEnter(row, col, side) {
        if ((this.calendarVariables[side].calendar[1][1].month() === this.calendarVariables[side].calendar[row][col].month())) {
            this.hoveredDate = this.calendarVariables[side].calendar[row][col];
        }
    }

    /**
     *
     * @param date the date to add time
     * @param side start or end
     */
    private _getDateWithTime(date, side: DateType): _moment.Moment {
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

    private _buildCells(calendar, side: DateType) {
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
                        if (this.ActiveDate !== ActiveDateEnum.Start) {
                            // classes.push('activatedDate');
                        }
                        classes.push('active', 'start-date');
                    }

                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    if ((this.calendarVariables[side].calendar[1][1].month() === this.calendarVariables[side].calendar[row][col].month())) {
                        if (!(this.endDate && this.startDate && this.endDate.isSame(this.startDate, 'day'))) {
                            if (this.ActiveDate !== ActiveDateEnum.End) {
                                // classes.push('activatedDate');
                            }
                            classes.push('active', 'end-date');
                        }
                    }
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
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
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }

    /**
     * parse given range to view model that datepicker uses
     * @param ranges
     */
    private parseRangesToVm(ranges: DateRangesInterface[]) {
        ranges = ranges.map(range => {
            range.isSelected = false;
            range.ranges = range.ranges ? range.ranges : [];
            range.value = range.value ? range.value : [];

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
                    if (subRange.ranges && subRange.ranges.length) {
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
    private flattenRanges(ranges, flattenRanges = []) {
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
}
