import { Component, OnInit, Input, ElementRef, Renderer2, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as _moment from 'moment';

@Component({
    selector: 'app-datepicker-wrapper',
    templateUrl: './datepicker.wrapper.component.html'
})

export class DatepickerWrapperComponent implements OnInit, OnChanges {
    public moment = _moment;

    @Output() onChange: EventEmitter<Object> = new EventEmitter();
    @Output() rangeClicked: EventEmitter<Object> = new EventEmitter();
    @Output() datesUpdated: EventEmitter<Object> = new EventEmitter();

    @Input()
    inputStartDate: _moment.Moment;
    @Input()
    inputEndDate: _moment.Moment;
    @Input()
    minDate: _moment.Moment;
    @Input()
    maxDate: _moment.Moment;
    @Input()
    autoApply: boolean;
    @Input()
    alwaysShowCalendars: boolean;
    @Input()
    showCustomRangeLabel: boolean;
    @Input()
    linkedCalendars: boolean;
    @Input()
    singleDatePicker: boolean;
    @Input()
    showWeekNumbers: boolean;
    @Input()
    showISOWeekNumbers: boolean;
    @Input()
    showDropdowns: boolean;
    @Input()
    isInvalidDate: Function;
    @Input()
    isCustomDate: Function;
    @Input()
    showClearButton: boolean;
    @Input()
    ranges: any;
    @Input()
    opens: string;
    @Input()
    drops: string;
    firstMonthDayClass: string;
    @Input()
    lastMonthDayClass: string;
    @Input()
    emptyWeekRowClass: string;
    @Input()
    firstDayOfNextMonthClass: string;
    @Input()
    lastDayOfPreviousMonthClass: string;
    @Input()
    keepCalendarOpeningWithRange: boolean;
    @Input()
    showRangeLabelOnInput: boolean;
    @Input()
    showCancel: boolean = false;
    @Input()
    locale: any;

    constructor(private _renderer: Renderer2) {

    }

    /**
     * Initializes the component
     *
     * @memberof DatepickerWrapperComponent
     */
    public ngOnInit(): void {
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
            }
            if (change === "inputEndDate" && changes[change].currentValue) {
                this.inputEndDate = changes[change].currentValue;
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
     * This will calculate the position of element
     *
     * @param {*} element
     * @returns
     * @memberof DatepickerWrapperComponent
     */
    public getPosition(element): any {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return { x: 150, y: yPosition };
    }

    /**
     * This will set the position of datepicker
     *
     * @memberof DatepickerWrapperComponent
     */
    public setPosition(): void {
        if (document.querySelectorAll(".giddh-datepicker") && document.querySelectorAll(".giddh-datepicker")[0]) {
            let element = document.querySelectorAll(".giddh-datepicker")[0];
            const container = document.getElementsByTagName("ngx-daterangepicker-material")[0] as HTMLElement;
            if (container) {
                let position = this.getPosition(element);
                let screenWidth = window.innerWidth;
                let totalWidth = container.offsetWidth + position.x;
                let positionX = position.x;

                if (totalWidth > screenWidth) {
                    positionX = positionX - (totalWidth - screenWidth);
                }

                this._renderer.setStyle(container, 'top', position.y + 'px');
                this._renderer.setStyle(container, 'left', positionX + 'px');
                this._renderer.setStyle(container, 'right', 'auto');
            }
        }
    }
}