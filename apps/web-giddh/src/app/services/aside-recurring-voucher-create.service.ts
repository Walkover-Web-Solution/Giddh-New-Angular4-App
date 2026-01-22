import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
@Injectable({ providedIn: 'root' })
export class RecurrenceFormService {

  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
     startDate: [null, Validators.required],

    frequency: this.fb.group({
        unit: ['MONTH'],
        interval: [1]
    }),

    repeatOn: this.fb.group({
        type: ['EVERY_DAY'],
        weekdays: this.fb.array([]),
        dayOfMonth: [null],
        nth: [null],
        weekday: [null],
        monthlyMode: ['DAY']
    }),

    end: this.fb.group({
        type: ['ON_DATE'],
        endDate: [null],
    })
    });
  }

  getDaysArray(form: FormGroup): FormArray {
    return form.get('repeatOn.daysOfWeek') as FormArray;
  }

  resetRepeatOn(form: FormGroup): void {
    const arr = this.getDaysArray(form);
    while (arr.length) arr.removeAt(0);

    form.get('repeatOn')?.patchValue({
      dayOfMonth: null,
      weekOfMonth: null,
      weekday: null
    });
  }

  patchFromStartDate(form: FormGroup, date: Date): void {
    const day = date.getDate();
    const weekday = date.getDay() === 0 ? 7 : date.getDay();
    const week = Math.ceil(day / 7);

    form.patchValue({
      startDate: date,
      frequency: { unit: 'MONTH', interval: 1 },
      repeatOn: {
        monthlyMode: 'DAY',
        dayOfMonth: day
      },
      end: {
        type: 'ON_DATE',
        endDate: date
      }
    });
  }

    // Add this method to the RecurrenceFormService class

    /**
     * Cleans the form values based on the repeatOn type
     * @param formValue The raw form value to clean
     * @returns Cleaned form value with only relevant fields
     */
    cleanFormValues(formValue: any): any {
        // Create a deep copy to avoid mutating the original
        const cleaned = JSON.parse(JSON.stringify(formValue));
        // Format dates if they exist
        if (cleaned.startDate) {
            cleaned.startDate = dayjs(cleaned.startDate).format(GIDDH_DATE_FORMAT);
        }
        // Handle end object based on type
        if (cleaned.end) {
            if (cleaned.end.type === 'NEVER') {
                // Remove endDate when type is NEVER
                delete cleaned.end.endDate;
            } else if (cleaned.end.type === 'ON_DATE' && cleaned.end.endDate) {
                // Format endDate when type is ON_DATE
                cleaned.end.endDate = dayjs(cleaned.end.endDate).format(GIDDH_DATE_FORMAT);
            }
        }
        if (!cleaned.repeatOn?.type) return cleaned;
        const repeatType = cleaned.repeatOn.type;
        const repeatOn = cleaned.repeatOn;

        // ... existing code ...

        switch (repeatType) {
            case 'EVERY_DAY':
                // Remove repeatOn object completely for EVERY_DAY
                delete cleaned.repeatOn;
                break;

            case 'DAY_OF_MONTH':
                // For DAY_OF_MONTH, keep type and dayOfMonth, remove weekdays
                cleaned.repeatOn = {
                    type: repeatType,
                    dayOfMonth: repeatOn.dayOfMonth
                };
                break;

            case 'WEEK_DAYS':
                // For WEEK_DAYS, keep type and weekdays
                cleaned.repeatOn = {
                    type: repeatType,
                    weekdays: repeatOn.weekdays || []
                };
                break;

            case 'NTH_WEEKDAY':
                // For NTH_WEEKDAY, keep type and nth
                cleaned.repeatOn = {
                    type: repeatType,
                    nth: repeatOn.nth
                };
                break;

            default:
                // For any other type, keep only the type
                cleaned.repeatOn = { type: repeatType };
                break;
        }

        // ... rest of the code ...

        return cleaned;
    }

    // Add this method to clean the form before submission
    getCleanFormValue(form: FormGroup): any {
        const formValue = form.getRawValue();
        return this.cleanFormValues(formValue);
    }
}
