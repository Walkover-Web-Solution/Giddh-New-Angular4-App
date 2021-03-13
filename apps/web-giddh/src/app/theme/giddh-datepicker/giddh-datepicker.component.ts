import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import * as _moment from 'moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

const noop = () => { };
const moment = _moment;

@Component({
    selector: 'giddh-datepicker',
    styleUrls: ['./giddh-datepicker.component.scss'],
    templateUrl: './giddh-datepicker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GiddhDatepickerComponent),
            multi: true
        }
    ]
})

export class GiddhDatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
    /** Taking placeholder as input */
    @Input() public placeholder: any = "Select date";
    /** Taking ngModel as input */
    @Input() public ngModel: any;
    /** Min date */
    @Input() public minDate: Date;
    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();

    /** Internal data model */
    private innerValue: any = '';
    /** This is used to show default date */
    public calendarDate: any = '';

    //Placeholders for the callbacks which are later provided by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor() {

    }

    /**
     * Initializes the component
     *
     * @memberof GiddhDatepickerComponent
     */
    public ngOnInit(): void {

    }

    /**
     * Updates the value on value change event
     *
     * @param {SimpleChanges} changes
     * @memberof GiddhDatepickerComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('ngModel' in changes) {
            if(changes.ngModel.currentValue) {
                this.calendarDate = moment(changes.ngModel.currentValue, GIDDH_DATE_FORMAT).toDate();
            } else {
                this.calendarDate = "";
            }
        }
    }

    /**
     * Callback for date change
     *
     * @param {MatDatepickerInputEvent<Date>} event
     * @memberof GiddhDatepickerComponent
     */
    public dateChange(event: MatDatepickerInputEvent<Date>): void {
        let selectedDate = moment(event.value, GIDDH_DATE_FORMAT).toDate();
        this.onChangeCallback(selectedDate);
        this.dateSelected.emit(selectedDate);
    }

    //////// ControlValueAccessor //////////

    /**
     * This is used to get the inner value of datepicker
     *
     * @type {*}
     * @memberof GiddhDatepickerComponent
     */
    get value(): any {
        return this.innerValue;
    };

    /**
     * set accessor including call the onchange callback
     *
     * @memberof GiddhDatepickerComponent
     */
    set value(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.onChangeCallback(value);
        }
    }

    /**
     * Used to Set touched on blur
     *
     * @memberof GiddhDatepickerComponent
     */
    public onBlur(): void {
        this.onTouchedCallback();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} value
     * @memberof GiddhDatepickerComponent
     */
    public writeValue(value: any): void {
        if (value && value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof GiddhDatepickerComponent
     */
    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof GiddhDatepickerComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }
}