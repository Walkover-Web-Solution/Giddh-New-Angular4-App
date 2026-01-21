import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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
        daysOfWeek: this.fb.array([]),
        dayOfMonth: [null],
        weekOfMonth: [null],
        weekday: [null],
        monthlyMode: ['DAY']
      }),

      end: this.fb.group({
        type: ['ON_DATE'],
        endDate: [null]
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
}
