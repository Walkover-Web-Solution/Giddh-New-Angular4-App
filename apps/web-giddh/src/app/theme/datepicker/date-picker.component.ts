import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment/moment';

export const DATEPICKER_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => DatePickerComponent),
	multi: true
};

@Component({
	selector: 'date-picker',
	template: `
    <div class="form-group {{ containerClass }}" (clickOutside)="showToDatePicker=false;">
      <label>{{label}}</label>
      <div class="input-group" style="display:table">
        <input type="text" name="to" required
               (focus)="showToDatePicker = true;"
               [value]="value"
               (keyup)="false"
               class="form-control"/>
        <span class="input-group-btn" *ngIf="showCalenderButton">
                    <button type="button" class="btn btn-default" (click)="showToDatePicker = !showToDatePicker"><i
                      class="glyphicon glyphicon-calendar"></i></button>
                  </span>
      </div>
      <div *ngIf="showToDatePicker" style="position: absolute; z-index:10; min-height:290px;">
        <ul class="my-dropdown-menu">
          <li>
            <datepicker [showWeeks]="false" (click)="$event.stopPropagation()" [minDate]="minDate"
                        [maxDate]="maxDate" (selectionDone)="selectionDone($event)"></datepicker>
          </li>
          <li style="padding:10px 9px 2px" *ngIf="showAdditionalButton">
                <span class="btn-group pull-left">
            <button type="button" class="btn btn-sm btn-info"
                    (click)="setToday();showToDatePicker = false"
            >Today</button>
            <button type="button" class="btn btn-sm btn-danger"
                    (click)="clearDate();showToDatePicker = false"
            >Clear</button>
          </span>
            <button type="button" class="btn btn-sm btn-success pull-right" (click)="showToDatePicker = false">
              Done
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
	encapsulation: ViewEncapsulation.None,
	providers: [DATEPICKER_VALUE_ACCESSOR]
})
export class DatePickerComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit, ControlValueAccessor {

	@Input() public value: string;
	@Input() public label: string;
	@Input() public maxDate: string;
	@Input() public minDate: string;
	@Input() public showCalenderButton: boolean = true;
	@Input() public showAdditionalButton: boolean = true;
	@Input() public containerClass: string;

	@Input() public disabled: boolean = false;
	// emitter when value is changed
	@Input() public showToDatePicker: boolean;
	public onChangeCb: (_: any) => void = (e) => {
		//
	}
	public onTouchedCb: () => void = () => {
		//
	}
	private date: Date = new Date();

	constructor(private cd: ChangeDetectorRef, private _elementRef: ElementRef) {
		this.value = this.convertToString(this.date);
	}

	@HostListener('document:click', ['$event', '$event.target'])
	public onClick(event: MouseEvent, targetElement: HTMLElement): void {
		if (!targetElement) {
			return;
		}

		const clickedInside = this._elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.showToDatePicker = false;
		}
	}

	public writeValue(value: any): void {
		if (value && value !== '') {
			this.value = value;
			this.date = this.convertToDate(value);
		}
	}

	public registerOnChange(fn: any): void {
		this.onChangeCb = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouchedCb = fn;
	}

	public ngOnInit() {
		//
	}

	public ngOnChanges(changes: SimpleChanges) {
		//
	}

	public ngAfterViewInit() {
		//
	}

	public ngOnDestroy() {
		//
	}

	public setToday() {
		this.value = this.convertToString(new Date());
		this.onChangeCb(this.value);
	}

	public clearDate() {
		this.value = '';
		this.onChangeCb(this.value);
	}

	public selectionDone(event) {
		this.value = this.convertToString(event);
		this.onChangeCb(this.value);
		this.showToDatePicker = false;
	}

	public convertToDate(str: string, format: string = 'DD-MM-YYYY'): Date {
		return moment(str, format).toDate();
	}

	public convertToString(date: Date, format: string = 'DD-MM-YYYY'): string {
		return moment(date).format(format);
	}
}
