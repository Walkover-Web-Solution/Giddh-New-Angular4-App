import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as _moment from 'moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { DateAdapter } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

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

export class GiddhDatepickerComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Taking placeholder as input */
    @Input() public placeholder: any = "";
    /** Taking ngModel as input */
    @Input() public ngModel: any;
    /** Min date */
    @Input() public minDate: Date;
    /** Taking any css class as input to be applied on date input field */
    @Input() public cssClass: string = "";
    /** Will show toggle icon if true */
    @Input() public showToggleIcon: boolean = true;
    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();
    /** Emitting the state of datepicker (open/close) */
    @Output() public datepickerState: EventEmitter<any> = new EventEmitter<any>();

    /** Internal data model */
    private innerValue: any = '';
    /** This is used to show default date */
    public calendarDate: any = '';
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Placeholders for the callbacks which are later provided by the Control Value Accessor */
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(private adapter: DateAdapter<any>, private store: Store<AppState>) {

    }

    /**
     * Initializes the component
     *
     * @memberof GiddhDatepickerComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.value) {
                this.adapter.setLocale(response?.value);
            }
        });
    }

    /**
     * Updates the value on value change event
     *
     * @param {SimpleChanges} changes
     * @memberof GiddhDatepickerComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('ngModel' in changes) {
            if (changes.ngModel.currentValue) {
                this.calendarDate = moment(changes.ngModel.currentValue, GIDDH_DATE_FORMAT).toDate();
            } else {
                this.calendarDate = "";
            }
        }
    }

    /**
     * Releases the memory
     *
     * @memberof GiddhDatepickerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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

    /**
     * Callback for datepicker state change
     *
     * @param {boolean} state
     * @memberof GiddhDatepickerComponent
     */
    public emitDatepickerState(state: boolean): void {
        this.datepickerState.emit(state);
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
