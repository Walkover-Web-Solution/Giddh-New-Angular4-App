import { Component, OnInit, Input, Renderer2, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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
    @Input() public dateFieldPosition: any;
    /* This will take input if datepicker position needs to be updated on window scroll or not */
    @Input() public updatePosition: boolean = true;

    /* This will hold the initial Y offset of window */
    public initialWindowOffset: number = 0;
    /* This will hold the initial Y offset of datepicker */
    public initialDatepickerYPosition: number = 0;

    constructor(private _renderer: Renderer2) {

    }

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

        this.initialWindowOffset = window.pageYOffset;
        this.initialDatepickerYPosition = this.dateFieldPosition.y;
        this.minDate = _.cloneDeep(this.inputStartDate);
        this.minDate.subtract(1, 'year').startOf('month').month(0); // default min date of previous year first month
        this.maxDate = _.cloneDeep(this.inputEndDate);
        this.maxDate.add(1, 'year').endOf('month').month(11); // default max date of next year last month
        this.setPosition();
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
     * Sends output to the component on range selection
     *
     * @param {*} value
     * @memberof DatepickerWrapperComponent
     */
    public selectedRange(value: any): void {
        this.rangeClicked.emit(value);
    }

    /**
     * This will set the position of datepicker
     *
     * @memberof DatepickerWrapperComponent
     */
    public setPosition(): void {
        if (document.querySelectorAll(".giddh-datepicker") && document.querySelectorAll(".giddh-datepicker")[0]) {
            const container = document.getElementsByTagName("ngx-daterangepicker-material")[0] as HTMLElement;
            if (container) {
                let screenWidth = window.innerWidth;
                let totalWidth = container.offsetWidth + this.dateFieldPosition.x;
                let positionX = this.dateFieldPosition.x;

                if (totalWidth > screenWidth) {
                    positionX = positionX - (totalWidth - screenWidth) - 15;
                }

                this._renderer.setStyle(container, 'top', this.dateFieldPosition.y + 'px');
                this._renderer.setStyle(container, 'left', positionX + 'px');
                this._renderer.setStyle(container, 'right', 'auto');
            }
        }
    }

    /**
     * This will readjust the datepicker position on window scroll
     *
     * @param {*} event
     * @memberof DatepickerWrapperComponent
     */
    @HostListener('window:scroll', ['$event'])
    public onWindowScroll(event: any): void {
        if (this.updatePosition) {
            if (window.pageYOffset > this.initialWindowOffset) {
                this.dateFieldPosition.y = this.initialDatepickerYPosition - (window.pageYOffset - this.initialWindowOffset);
            } else {
                this.dateFieldPosition.y = this.initialDatepickerYPosition + (this.initialWindowOffset - window.pageYOffset);
            }
            this.setPosition();
        }
    }
}
