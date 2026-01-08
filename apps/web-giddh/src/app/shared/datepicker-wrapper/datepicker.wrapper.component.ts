import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-datepicker-wrapper',
    templateUrl: './datepicker.wrapper.component.html'
})

export class DatepickerWrapperComponent implements OnInit, OnChanges {
    public dayjs = dayjs;

    @Output() onChange: EventEmitter<Object> = new EventEmitter();
    @Output() rangeClicked: EventEmitter<Object> = new EventEmitter();
    @Output() datesUpdated: EventEmitter<Object> = new EventEmitter();
    /** This will emit event when calender is closed */
    @Output() closeCalender: EventEmitter<void> = new EventEmitter();

    @Input() public inputStartDate: dayjs.Dayjs;
    @Input() public inputEndDate: dayjs.Dayjs;
    @Input() public minDate: dayjs.Dayjs;
    @Input() public maxDate: dayjs.Dayjs;
    @Input() public autoApply: boolean;
    @Input() public alwaysShowCalendars: boolean;
    @Input() public showCustomRangeLabel: boolean;
    @Input() public linkedCalendars: boolean;
    @Input() public singleDatePicker: boolean;
    @Input() public showWeekNumbers: boolean;
    @Input() public showISOWeekNumbers: boolean;
    @Input() public showDropdowns: boolean;
    @Input() public isInvalidDate: Function;
    @Input() public isCustomDate: Function;
    @Input() public showClearButton: boolean;
    @Input() public ranges: any;
    @Input() public opens: string;
    @Input() public drops: string;
    @Input() public lastMonthDayClass: string;
    @Input() public emptyWeekRowClass: string;
    @Input() public firstDayOfNextMonthClass: string;
    @Input() public lastDayOfPreviousMonthClass: string;
    @Input() public keepCalendarOpeningWithRange: boolean;
    @Input() public showRangeLabelOnInput: boolean;
    @Input() public showCancel: boolean = false;
    @Input() public locale: any;
    @Input() public selectedRangeLabel: any;
    /** True, when show confirmation on change is enabled */
    @Input() public showConfirmationOnChange: boolean = false;
    /** Confirmation message to be shown when show confirmation on change is enabled */
    @Input() public confirmationMessage: string = '';

    constructor() {}

    /**
     * Initializes the component
     *
     * @memberof DatepickerWrapperComponent
     */
    public ngOnInit(): void {

        if (!this.inputStartDate) {
            this.inputStartDate = dayjs().startOf('day');
        }

        if (!this.inputEndDate) {
            this.inputEndDate = dayjs().endOf('day');
        }

        this.minDate = _.cloneDeep(this.inputStartDate);
        this.minDate.subtract(1, 'year').startOf('month').month(0); // default min date of previous year first month
        this.maxDate = _.cloneDeep(this.inputEndDate);
        this.maxDate.add(1, 'year').endOf('month').month(11); // default max date of next year last month
    }

    /**
     * Updates the variable on change event
     *
     * @param {SimpleChanges} changes
     * @memberof DatepickerWrapperComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        for (let change in changes) {
            if (change === "inputStartDate" && changes[change].currentValue) {
                this.inputStartDate = changes[change].currentValue;
                this.minDate = _.cloneDeep(this.inputStartDate);
                this.minDate.subtract(1, 'year').startOf('month').month(0); // default min date of previous year first month
            }
            if (change === "inputEndDate" && changes[change].currentValue) {
                this.inputEndDate = changes[change].currentValue;
                this.maxDate = _.cloneDeep(this.inputEndDate);
                this.maxDate.add(1, 'year').endOf('month').month(11); // default max date of next year last month
            }
        }
    }

    /**
     * Sends output to the parent component on date selection
     *
     * @param {*} value
     * @memberof DatepickerWrapperComponent
     */
    public selectedDate(value: any): void {
        this.datesUpdated.emit(value);
    }

    /**
     * Sends output to the parent component on close calender
     *
     * @memberof DatepickerWrapperComponent
     */
    public handleCloseCalender(): void {
        this.closeCalender.emit();
    }

    /**
     * Sends output to the component on range selection
     *
     * @param {*} value
     * @memberof DatepickerWrapperComponent
     */
    public selectedRange(value: any): void {
        this.rangeClicked.emit(value);
    }
}
