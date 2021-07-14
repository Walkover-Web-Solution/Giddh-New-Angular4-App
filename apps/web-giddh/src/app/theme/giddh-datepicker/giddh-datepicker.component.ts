import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import * as _moment from 'moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatCalendar, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';

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
    /** Emitting selected date object as output */
    @Output() public dateSelected: EventEmitter<any> = new EventEmitter<any>();

    /** Internal data model */
    private innerValue: any = '';
    /** This is used to show default date */
    public calendarDate: any = '';
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    //Placeholders for the callbacks which are later provided by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    public exampleHeader = ExampleHeader;

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

/** Custom header component for datepicker. */
@Component({
    selector: 'example-header',
    styles: [`
      .example-header {
        display: flex;
        align-items: center;
        padding: 0.5em;
      }
  
      .example-header-label {
        flex: 1;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }
  
      .example-double-arrow .mat-icon {
        margin: -22%;
      }
    `],
    template: `
      <div class="example-header">
        <button mat-icon-button class="example-double-arrow" (click)="previousClicked('year')">
          <<
        </button>
        <button mat-icon-button (click)="previousClicked('month')">
          <
        </button>
        <span class="example-header-label">{{periodLabel}}</span>
        <button mat-icon-button (click)="nextClicked('month')">
          >
        </button>
        <button mat-icon-button class="example-double-arrow" (click)="nextClicked('year')">
          >>
        </button>
      </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ExampleHeader<D> implements OnDestroy {
    private _destroyed = new Subject<void>();
  
    constructor(
        private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
        @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
      _calendar.stateChanges
          .pipe(takeUntil(this._destroyed))
          .subscribe(() => cdr.markForCheck());
    }
  
    ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
    }
  
    get periodLabel() {
      return this._dateAdapter
          .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
          .toLocaleUpperCase();
    }
  
    previousClicked(mode: 'month' | 'year') {
      this._calendar.activeDate = mode === 'month' ?
          this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
          this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
    }
  
    nextClicked(mode: 'month' | 'year') {
      this._calendar.activeDate = mode === 'month' ?
          this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
          this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
    }
  }