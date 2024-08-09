import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as dayjs from 'dayjs';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

const noop = () => { };

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

export class GiddhDatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
    /** Taking placeholder as input */
    @Input() public placeholder: any = "";
    /** Min date */
    @Input() public minDate: Date;
    /** Taking any css class as input to be applied on date input field */
    @Input() public cssClass: string = "";
    /** Will show toggle icon if true */
    @Input() public showToggleIcon: boolean = false;
    /** Will disable the field if true */
    @Input() public disabled: boolean = false;
    /** True if we need to show error */
    @Input() public showError: boolean = false;
    /** True if field is required */
    @Input() public required: boolean = false;
    /* Datepicker fill */
    @Input() public appearance: 'legacy' | 'outline' | 'fill' = 'fill';
    /** Hold Mat Label Text*/
    @Input() public label: any;
    /** True if datepicker has to be opened by default */
    @Input() public isOpened: boolean = false;
    /** True if datepicker has to be opened by default */
    @Input() public hideLabel: boolean = false;
    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();
    /** Emitting the state of datepicker (open/close) */
    @Output() public datepickerState: EventEmitter<any> = new EventEmitter<any>();
    /** Emitting the state of datepicker */
    @Output() public focusOut: EventEmitter<any> = new EventEmitter<any>();
    /** This will hold if datepicker is open */
    public isDatepickerOpen: boolean = false;
    /** Internal data model */
    private innerValue: any = '';
    /** This is used to show default date */
    public calendarDate: any = '';
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Placeholders for the callbacks which are later provided by the Control Value Accessor */
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(
        private adapter: DateAdapter<any>,
        private store: Store<AppState>,
        private changeDetectorRef: ChangeDetectorRef
    ) {

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
        let selectedDate = (typeof(event?.value) === "object") ? dayjs(event?.value).toDate() : dayjs(event?.value, GIDDH_DATE_FORMAT).toDate();
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
        if (state) {
            this.isDatepickerOpen = true;
        }
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
        if (value) {
            this.innerValue = value;
            this.calendarDate = (typeof(value) === "object") ? dayjs(value).toDate() : dayjs(value, GIDDH_DATE_FORMAT).toDate();
            this.changeDetectorRef.detectChanges();
        } else {
            this.innerValue = "";
            this.calendarDate = "";
            this.changeDetectorRef.detectChanges();
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
