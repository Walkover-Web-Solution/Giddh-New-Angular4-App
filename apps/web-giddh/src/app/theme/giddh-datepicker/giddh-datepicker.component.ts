import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MONTH_YEAR } from '../../shared/helpers/defaultDateFormat';

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
    ],
    standalone:false
})

export class GiddhDatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
    /** Instance of picker from datepicker */
    @ViewChild('picker') picker!: MatDatepicker<any>;
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
    /** Callback function to notify parent component of value changes */
    private onChangeCallback: (_: any) => void = noop;
    /** This is used to show change date */
    public inputChange: any = '';
    /** True if datepicker has to be closed on focus */
    @Input() public closeDatepickerOnFocus: boolean = false;
    /** Enable month and year selection mode */
    @Input() public monthYearMode: boolean = false;
    /** Start view for month/year picker */
    @Input() public startView: 'month' | 'year' | 'multi-year' = 'month';
    /** Start date for month/year picker */
    @Input() public startAt: Date | null = null;
    /** Emitting month and year selection */
    @Output() public monthYearSelected: EventEmitter<any> = new EventEmitter<any>();

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
            if (response?.value) {
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
        let selectedDate = (typeof (event?.value) === "object" && event?.value !== null) ? dayjs(event?.value).toDate() : dayjs(this.inputChange, GIDDH_DATE_FORMAT).toDate();
        this.onChangeCallback(selectedDate);
        this.dateSelected.emit(selectedDate);
    }

    /**
     * Handles month selection for month/year picker mode
     *
     * @param {any} normalizedMonth - Selected month from datepicker
     * @param {MatDatepicker<any>} datepicker - Datepicker instance
     * @memberof GiddhDatepickerComponent
     */
    public setMonthAndYear(normalizedMonth: any, datepicker: MatDatepicker<any>): void {
        if (this.monthYearMode) {
            const selectedDate = dayjs(normalizedMonth).toDate();
            this.calendarDate = dayjs(selectedDate).format(GIDDH_DATE_FORMAT_MONTH_YEAR);
            this.innerValue = selectedDate;
            this.onChangeCallback(selectedDate);
            this.monthYearSelected.emit(selectedDate);
            this.dateSelected.emit(selectedDate);
            datepicker.close();
        }
    }

    /**
     * Handles year selection for month/year picker mode - keeps datepicker open
     *
     * @param {any} normalizedYear - Selected year from datepicker
     * @memberof GiddhDatepickerComponent
     */
    public setYear(normalizedYear: any): void {
        if (this.monthYearMode) {
            // Don't close datepicker, just update the view to show months for selected year
            // The datepicker will automatically navigate to month view
        }
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
            this.calendarDate = (typeof (value) === "object") ? dayjs(value).toDate() : dayjs(value, GIDDH_DATE_FORMAT).toDate();
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

    /**
    * Get current value on input
    *
    * @param event
    */
    public dateInputChange(event: Event): void {
        if (event) {
            const inputElement = event.target as HTMLInputElement;
            const inputValue = inputElement.value;
            this.inputChange = inputValue;
        }
    }

    /**
     * This will be use for focus click event on input
     *
     * @memberof GiddhDatepickerComponent
     */
    public toggleDatepicker(): void {
        if (this.showToggleIcon) {
            this.emitDatepickerState(false);
            this.picker?.close();
        } else {
            this.emitDatepickerState(true);
            this.picker?.open();
        }
    }
}
