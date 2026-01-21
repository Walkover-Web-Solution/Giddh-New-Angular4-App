import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    Validators
} from '@angular/forms';

@Component({
    selector: 'aside-recurrence-voucher-create',
    templateUrl: './aside-recurring-voucher-create.component.html',
    styleUrls: ['./aside-recurring-voucher-create.component.scss']
})
export class AsideRecurrenceVoucherCreateComponent implements OnInit {

    /* =======================
       INPUT / OUTPUT
    ======================= */
    @Input() recurrenceForm?: FormGroup; // for embedded usage
    @Output() recurrenceChange = new EventEmitter<FormGroup>();

    internalForm!: FormGroup; // for standalone usage

    /* =======================
       DATE CONSTRAINT
    ======================= */
    minStartDate: Date = new Date();

    constructor(private fb: FormBuilder) {
        this.minStartDate.setHours(0, 0, 0, 0);
    }

    /* =======================
       UI STATE FLAGS
    ======================= */
    showCustom = false;
    showDayThe = false;
    showWeekdayToggle = false;

    /* =======================
       CONSTANT OPTIONS
    ======================= */
    weekdays = [
        { label: 'M', value: 1 },
        { label: 'T', value: 2 },
        { label: 'W', value: 3 },
        { label: 'T', value: 4 },
        { label: 'F', value: 5 },
        { label: 'S', value: 6 },
        { label: 'S', value: 7 }
    ];

    weekdayOptions = [
        { label: 'Monday', value: 1 },
        { label: 'Tuesday', value: 2 },
        { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 },
        { label: 'Friday', value: 5 },
        { label: 'Saturday', value: 6 },
        { label: 'Sunday', value: 7 }
    ];

    weekOfMonthOptions = [
        { label: '1st', value: 1 },
        { label: '2nd', value: 2 },
        { label: '3rd', value: 3 },
        { label: '4th', value: 4 },
        { label: 'Last', value: 'LAST' }
    ];

    monthDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

    repeatOptions: Array<{ label: string; value: any }> = [];
    selectedRepeatOption:
        | 'DAY'
        | 'WEEKLY'
        | 'MONTHLY_DATE'
        | 'MONTHLY_WEEKDAY'
        | 'CUSTOM'
        | null = null;

    /* =======================
       INIT
    ======================= */
    ngOnInit(): void {
        if (!this.recurrenceForm) {
            this.internalForm = this.createRecurrenceForm();
            this.recurrenceForm = this.internalForm;
        }

        this.recurrenceForm.valueChanges.subscribe(() => {
            this.recurrenceChange.emit(this.recurrenceForm!);
        });
    }

    /* =======================
       FORM FACTORY
    ======================= */
    private createRecurrenceForm(): FormGroup {
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

    /* =======================
       FORM GETTERS
    ======================= */
    get repeatOnForm(): FormGroup {
        return this.recurrenceForm!.get('repeatOn') as FormGroup;
    }

    get daysOfWeekArray(): FormArray {
        return this.repeatOnForm.get('daysOfWeek') as FormArray;
    }

    get frequencyUnit(): 'DAY' | 'WEEK' | 'MONTH' | null {
        return this.recurrenceForm?.get('frequency.unit')?.value ?? null;
    }

    /* =======================
       START DATE CHANGE
    ======================= */
    onStartDateChange(date: Date | null): void {
        if (!date) return;

        this.recurrenceForm!.patchValue({ startDate: date });

        this.buildRepeatOptions(date);

        this.selectedRepeatOption = 'CUSTOM';
        this.selectRepeatOption('CUSTOM');
    }

    /* =======================
       REPEAT OPTIONS
    ======================= */
    selectRepeatOption(option: any): void {
        this.selectedRepeatOption = option;

        const startDate: Date = this.recurrenceForm!.get('startDate')?.value;
        if (!startDate) return;

        const { dayOfMonth, weekday, weekOfMonth } = this.getDateMeta(startDate);

        this.resetRepeatOn();

        if (option === 'CUSTOM') {
            this.recurrenceForm!.get('frequency')?.patchValue({
                unit: 'MONTH',
                interval: 1
            });

            this.repeatOnForm.patchValue({
                monthlyMode: 'DAY',
                dayOfMonth
            });

            this.recurrenceForm!.get('end')?.patchValue({
                type: 'ON_DATE',
                endDate: startDate
            });

            Promise.resolve().then(() => {
                this.showCustom = true;
                this.showDayThe = true;
                this.showWeekdayToggle = false;
            });
        }
    }

    /* =======================
       CUSTOM UNIT CHANGE
    ======================= */
    onRepeatUnitChange(unit: 'DAY' | 'WEEK' | 'MONTH'): void {
        const startDate: Date = this.recurrenceForm!.get('startDate')?.value;
        if (!startDate) return;

        this.recurrenceForm!
            .get('frequency.unit')
            ?.setValue(unit);

        this.resetRepeatOn();

        const { dayOfMonth, weekday } = this.getDateMeta(startDate);

        if (unit === 'WEEK') {
            this.daysOfWeekArray.push(new FormControl(weekday));
        }

        if (unit === 'MONTH') {
            this.repeatOnForm.patchValue({
                monthlyMode: 'DAY',
                dayOfMonth
            });
        }

        this.showWeekdayToggle = unit === 'WEEK';
        this.showDayThe = unit === 'MONTH';
    }


    /* =======================
       WEEKDAY TOGGLE
    ======================= */
    isWeekdaySelected(day: number): boolean {
        return this.daysOfWeekArray.value.includes(day);
    }

    toggleWeekday(day: number): void {
        const index = this.daysOfWeekArray.value.indexOf(day);
        index >= 0
            ? this.daysOfWeekArray.removeAt(index)
            : this.daysOfWeekArray.push(new FormControl(day));
    }

    /* =======================
       MONTHLY MODE
    ======================= */
    selectMonthlyDay(): void {
        const startDate = this.recurrenceForm!.get('startDate')?.value;
        if (!startDate) return;

        this.repeatOnForm.patchValue({
            dayOfMonth: startDate.getDate(),
            weekOfMonth: null,
            weekday: null
        });
    }

    selectMonthlyThe(): void {
        const startDate = this.recurrenceForm!.get('startDate')?.value;
        if (!startDate) return;

        const { weekOfMonth, weekday } = this.getDateMeta(startDate);

        this.repeatOnForm.patchValue({
            dayOfMonth: null,
            weekOfMonth,
            weekday
        });
    }

    /* =======================
       HELPERS
    ======================= */
    private resetRepeatOn(): void {
        while (this.daysOfWeekArray.length) {
            this.daysOfWeekArray.removeAt(0);
        }

        this.repeatOnForm.patchValue({
            dayOfMonth: null,
            weekOfMonth: null,
            weekday: null
        });
    }

    private buildRepeatOptions(startDate: Date): void {
        const { dayOfMonth, weekday, weekOfMonth } = this.getDateMeta(startDate);
        const weekdayName =
            this.weekdayOptions.find(w => w.value === weekday)?.label || '';

        this.repeatOptions = [
            { label: `Weekly on ${weekdayName}`, value: 'WEEKLY' },
            { label: `Monthly on ${this.getOrdinal(dayOfMonth)}`, value: 'MONTHLY_DATE' },
            {
                label: `Monthly on the ${this.getOrdinal(weekOfMonth)} ${weekdayName}`,
                value: 'MONTHLY_WEEKDAY'
            },
            { label: 'Custom', value: 'CUSTOM' }
        ];
    }

    private getDateMeta(date: Date) {
        const dayOfMonth = date.getDate();
        const weekday = date.getDay() === 0 ? 7 : date.getDay();
        const weekOfMonth = Math.ceil(dayOfMonth / 7);
        return { dayOfMonth, weekday, weekOfMonth };
    }

    private getOrdinal(n: number): string {
        if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    }
}
