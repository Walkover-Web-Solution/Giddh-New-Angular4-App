import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { debounceTime, ReplaySubject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import * as dayjs from 'dayjs';
import { ToasterService } from '../../services/toaster.service';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { DatePickerDefaultRangeEnum } from '../../app.constant';
import { TextFieldComponent } from '../../theme/form-fields/text-field/text-field.component';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import { get } from '../../lodash-optimized';

type compareType = 'month' | 'quarter' | 'year' | 'period' | null;
enum CompareTypeEnum {
  month = 'month',
  quarter = 'quarter',
  year = 'year',
  period = 'period',
  none = 'none'
};
interface DateCheckResult {
  isMonthSelected: boolean;
  isYearSelected: boolean;
  isQuarterSelected: boolean;
  isRandomDateSelected: boolean;
  dayCount: number;
}

@Component({
  selector: 'giddh-compare-with-date-range-picker',
  templateUrl: './compare-with-date-range-picker.component.html',
  styleUrls: ['./compare-with-date-range-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormFieldsModule,
    ReactiveFormsModule,
    TranslateDirectiveModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ]
})
export class CompareWithDateRangePickerComponent implements OnInit, OnChanges, OnDestroy {
  /** Holds trigger */
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  /** Holds custom input reference */
  @ViewChild('customInput') customInput: TextFieldComponent;
  /** Holds compare with field */
  public compareWithField: FormControl = new FormControl<string>('None');
  /** Holds compare options form */
  public compareOptionsForm: FormGroup;
  /** Holds days count */
  public daysCount: number;
  /** Holds date range info */
  public dateRangeInfo: DateCheckResult = this.resetDateRangeObject();
  /** Holds compare type enum */
  public compareTypeEnum = CompareTypeEnum;
  /** Holds show custom input */
  public showCustomInput: boolean = false;
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  /** Holds destroyed$ */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Holds start date */
  @Input() public startDate: string;
  /** Holds end date */
  @Input() public endDate: string;
  /** Holds universal date range label */
  @Input() public universalDateRangeLabel: DatePickerDefaultRangeEnum;
  /** Emits on date change event */
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {
    this.compareOptionsForm = this.formBuilder.group({
      compareValue: new FormControl<number[]>([]),
      compareType: new FormControl<compareType[]>([])
    });
  }

  /**
   * This hook will be use for component on init
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public ngOnInit(): void {
    this.compareOptionsForm.valueChanges.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((value) => {
      if (value?.compareValue?.[0] == 'undefined') {
        return;
      }

      const compareValue = value.compareValue?.[0] ?? value.compareValue;
      if (compareValue > 0) {
        this.setCompareWithField(compareValue, value.compareType?.[0]);
        // Execute if value set by list option 
        if (value.compareValue?.[0]) {
          this.showCustomInput = false;
        }
      } else {
        this.compareWithField.setValue('None');
      }

      if (compareValue > 36) {
        this.toaster.showSnackBar('warning', this.localeData?.up_to_36_periods_can_be_compared);
        this.compareOptionsForm.get('compareValue').patchValue([36]);
        return;
      }

      if (this.compareOptionsForm.valid && compareValue > 0) {
        this.onChange.emit({
          compareValue: +compareValue,
          compareType: value.compareType[0]
        });
      } else if (compareValue == 0) {
        this.onChange.emit({
          compareValue: null,
          compareType: null
        });
      }
    });
  }

  /**
   * This hook will be use for component on changes
   *
   * @param {SimpleChanges} c
   * @memberof CompareWithDateRangePickerComponent
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (('startDate' in changes) || ('endDate' in changes) || ('universalDateRangeLabel' in changes)) {
      const startDateObj = dayjs(this.startDate, GIDDH_DATE_FORMAT);
      const endDateObj = dayjs(this.endDate, GIDDH_DATE_FORMAT);
      if (startDateObj.isValid() && endDateObj.isValid()) { 
        this.setCompareValues();
      }
    }
  }

  /**
   * Callback for translation response complete
   *
   * @param {boolean} event
   * @memberof CompareWithDateRangePickerComponent
   */
  public translationComplete(event: boolean): void {
    if (event) {
      this.compareWithField.setValue(this.localeData?.none);
    }
  }

  /**
   * This method will be use for setting compare values
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  private setCompareValues(): void {
    this.dateRangeInfo = this.checkDateSelectionRange(this.startDate, this.endDate);
    if (this.dateRangeInfo.isMonthSelected && !this.isSelectedRangeThisQuarterToDate() && !this.isSelectedRangeThisFinancialYearToDate()) {
      this.compareOptionsForm.get('compareType')?.patchValue([CompareTypeEnum.month]);
    } else if (this.dateRangeInfo.isQuarterSelected && !this.isSelectedRangeThisFinancialYearToDate()) {
      this.compareOptionsForm.get('compareType')?.patchValue([CompareTypeEnum.quarter]);
    } else if (this.dateRangeInfo.isYearSelected) {
      this.compareOptionsForm.get('compareType')?.patchValue([CompareTypeEnum.year]);
    } else if (this.dateRangeInfo.isRandomDateSelected) {
      this.compareOptionsForm.get('compareType')?.patchValue([CompareTypeEnum.period]);
    }

    const compareValue = this.compareOptionsForm.get('compareValue')?.value?.[0] ?? this.compareOptionsForm.get('compareValue')?.value;
    if (compareValue > 0) {
      this.setCompareWithField(compareValue, this.compareOptionsForm.get('compareType')?.value?.[0]);
    }
  }

  /**
   * This method will be use for setting compare with field
   *
   * @param {number} compareValue
   * @param {compareType} compareType
   * @memberof CompareWithDateRangePickerComponent
   */
  private setCompareWithField(compareValue: number, compareType: compareType): void {
    this.compareWithField.setValue(`${this.localeData?.compare_with} ${compareValue} ${this.getTranslatedType(compareType)}`);
  }

  /**
   * This method will be use for getting translated type
   *
   * @param {compareType} type
   * @returns {string}
   * @memberof CompareWithDateRangePickerComponent
   */
  public getTranslatedType(type: compareType): string {
    switch (type) {
      case 'month':
        return this.localeData?.compare_types?.month;
      case 'quarter':
        return this.localeData?.compare_types?.quarter;
      case 'year':
        return this.localeData?.compare_types?.year;
      case 'period':
        return this.localeData?.compare_types?.period;
      default:
        return '';
    }
  }

  /**
   * This method will be use for toggling menu
   *
   * @param {boolean} isOpen
   * @memberof CompareWithDateRangePickerComponent
   */
  public toggleMenu(isOpen: boolean = true) {
    if (isOpen) {
      this.trigger?.openMenu();
    } else {
      this.trigger?.closeMenu();
    }
  }

  /**
   * This method will be use for emitting date change event
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public onDateChange(): void {
    this.onChange.emit(this.compareOptionsForm.value);
  }

  /**
   * This method will be use for checking if the option is disabled
   *
   * @param {string} value
   * @returns {boolean}
   * @memberof CompareWithDateRangePickerComponent
   */
  public hasDisable(value: string): boolean {
    switch (value.toLowerCase()) {
      case 'month':
        return !this.dateRangeInfo.isMonthSelected;
      case 'year':
        return !this.dateRangeInfo.isYearSelected;
      case 'quarter':
        return !this.dateRangeInfo.isQuarterSelected;
      case 'period':
        return !this.dateRangeInfo.isRandomDateSelected;
      default:
        return false;
    }
  }
  
  /**
   * This method will be use for checking if the date selection range is valid
   *
   * @param {string} startDateInput
   * @param {string} endDateInput
   * @returns {DateCheckResult}
   * @memberof CompareWithDateRangePickerComponent
   */
  public checkDateSelectionRange(startDateInput: string, endDateInput: string): DateCheckResult {
    const startDate = dayjs(startDateInput, GIDDH_DATE_FORMAT);
    const endDate = dayjs(endDateInput, GIDDH_DATE_FORMAT);

    let dayCount = 0;
    if (startDate.isValid() && endDate.isValid() && endDate.isSameOrAfter(startDate, 'day')) {
      const diffInMilliseconds = endDate.valueOf() - startDate.valueOf();
      const millisecondsInDay = 24 * 60 * 60 * 1000;
      dayCount = Math.round(diffInMilliseconds / millisecondsInDay) + 1;
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      return this.resetDateRangeObject();
    }

    const startOfMonth = startDate.startOf('month');
    const endOfMonth = endDate.endOf('month');

    const startOfQuarter = startDate.startOf('quarter');
    const endOfQuarter = endDate.endOf('quarter');

    const isSameMonth = startDate.isSame(startOfMonth, 'day') && endDate.isSame(endOfMonth, 'day') && dayCount <= 31;

    const isSameQuarter = startDate.isSame(startOfQuarter, 'day') && endDate.isSame(endOfQuarter, 'day') && startDate.isSame(endDate, 'quarter') && startDate.isSame(endDate, 'year');
    const isYearSelected = startDate.isSame(startOfMonth, 'day') && endDate.isSame(endOfMonth, 'day') && (dayCount === 365 || dayCount === 366);
    
    return {
      isMonthSelected: isSameMonth || (!isSameMonth && !isYearSelected && !isSameQuarter && dayCount <= 31),
      isQuarterSelected: isSameQuarter || (!isSameQuarter && !isYearSelected && dayCount <= 90),
      isYearSelected: isYearSelected || (!isYearSelected && dayCount <= 365),
      isRandomDateSelected: (!isSameMonth && !isYearSelected && !isSameQuarter) || this.isSelectedRangeThisQuarterToDate() || this.isSelectedRangeThisFinancialYearToDate(),
      dayCount: dayCount,
    };
  }

  /**
   * This method will be use for checking if the universal date range label is this quarter
   *
   * @returns {boolean}
   * @memberof CompareWithDateRangePickerComponent
   */
  private isSelectedRangeThisQuarterToDate(): boolean {
    return this.universalDateRangeLabel === DatePickerDefaultRangeEnum.ThisQuarterToDate;
  }

  /**
   * This method will be use for checking if the universal date range label is this financial year
   *
   * @returns {boolean}
   * @memberof CompareWithDateRangePickerComponent
   */
  private isSelectedRangeThisFinancialYearToDate(): boolean {
    return this.universalDateRangeLabel === DatePickerDefaultRangeEnum.ThisFinancialYearToDate;
  }

  /**
   * This method will be use for resetting the date range object
   *
   * @returns {DateCheckResult}
   * @memberof CompareWithDateRangePickerComponent
   */
  private resetDateRangeObject(): DateCheckResult {
    return {
      isMonthSelected: false,
      isYearSelected: false,
      isQuarterSelected: false,
      isRandomDateSelected: false,
      dayCount: 0
    };
  }

  /**
   * This method will be use for focusing the custom input
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public focusCustomInput(): void {
    setTimeout(() => {
      this.customInput?.textField?.nativeElement?.focus();
    }, 200);
  }

  /**
   * This method will be use for destroying the component
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}