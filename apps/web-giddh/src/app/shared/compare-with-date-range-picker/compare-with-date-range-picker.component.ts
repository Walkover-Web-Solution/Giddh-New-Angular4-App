import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { ReplaySubject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import * as dayjs from 'dayjs';

type compareType = 'month' | 'quarter' | 'year' | 'period' | null;
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
    ReactiveFormsModule,
    FormFieldsModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ]
})
export class CompareWithDateRangePickerComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public compareWithField: FormControl = new FormControl<any>('None');
  public compareOptionsForm: FormGroup;
  public daysCount: number = 0;
  public dateRangeInfo: DateCheckResult;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Holds start date */
  @Input() public startDate: string = '01-01-2025';
  /** Holds end date */
  @Input() public endDate: string = '31-12-2025';
  /** Emits on date change event */
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private formBuilder: FormBuilder
  ) {
    this.compareOptionsForm = this.formBuilder.group({
      compareValue: [[0]],
      compareType: [['month']]
    });
  }

  /**
   *
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public ngOnInit(): void {
    this.compareOptionsForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
    this.dateRangeInfo = this.checkDateSelectionRange(this.startDate, this.endDate);
    console.log('Date Selection Info:', this.dateRangeInfo);
  }

  public toggleMenu(isOpen: boolean = true) {
    if (isOpen) {
      this.trigger?.openMenu();
    } else {
      this.trigger?.closeMenu();
    }
  }

  public onDateChange(): void {
    this.onChange.emit(this.compareOptionsForm.value);
  }

  public shouldDisableOption(value: string): boolean {
    switch (value.toLowerCase()) {
      case 'month':
        return !this.dateRangeInfo.isMonthSelected;
      case 'year':
        return !this.dateRangeInfo.isYearSelected;
      case 'quarter':
        return !this.dateRangeInfo.isQuarterSelected
      case 'period':
        return this.dateRangeInfo.isMonthSelected || this.dateRangeInfo.isYearSelected || this.dateRangeInfo.isQuarterSelected;
      case 'none':
      case '1':
      case '2':
      case '3':
      case '4':
      case '10':
        return false;
      default:
        return false;
    }
  }

  public checkDateSelectionRange(startDateInput: string, endDateInput: string): DateCheckResult {
    const startDate = dayjs(startDateInput, 'DD-MM-YYYY');
    const endDate = dayjs(endDateInput, 'DD-MM-YYYY');

    let dayCount = 0;
    if (startDate.isValid() && endDate.isValid() && endDate.isSameOrAfter(startDate, 'day')) {
      const diffInMilliseconds = endDate.valueOf() - startDate.valueOf();
      const millisecondsInDay = 24 * 60 * 60 * 1000;
      dayCount = Math.round(diffInMilliseconds / millisecondsInDay) + 1;
    }

    if (!startDate.isValid() || !endDate.isValid()) {
      return {
        isMonthSelected: false,
        isYearSelected: false,
        isQuarterSelected: false,
        isRandomDateSelected: false,
        dayCount: 0,
      };
    }

    const startOfMonth = startDate.startOf('month');
    const endOfMonth = startDate.endOf('month');

    const startOfYear = startDate.startOf('year');
    const endOfYear = startDate.endOf('year');

    const startOfQuarter = startDate.startOf('quarter');
    const endOfQuarter = startDate.endOf('quarter');

    const isSameMonth = startDate.isSame(startOfMonth, 'day') && endDate.isSame(endOfMonth, 'day');
    const isSameYear = startDate.isSame(startOfYear, 'day') && endDate.isSame(endOfYear, 'day');
    const isSameQuarter = startDate.isSame(startOfQuarter, 'day') && endDate.isSame(endOfQuarter, 'day');

    return {
      isMonthSelected: isSameMonth && startDate.isSame(endDate, 'month'),
      isYearSelected: isSameYear && startDate.isSame(endDate, 'year'),
      isQuarterSelected: isSameQuarter && startDate.isSame(endDate, 'quarter'),
      isRandomDateSelected: !isSameMonth || !startDate.isSame(startOfMonth, 'day') || !endDate.isSame(endOfMonth, 'day') ||
        !isSameYear || !startDate.isSame(startOfYear, 'day') || !endDate.isSame(endOfYear, 'day') ||
        !isSameQuarter || !startDate.isSame(startOfQuarter, 'day') || !endDate.isSame(endOfQuarter, 'day'),
      dayCount: dayCount,
    };
  }


  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}