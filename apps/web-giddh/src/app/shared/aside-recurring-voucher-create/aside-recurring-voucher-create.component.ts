import {
    Component,
    input,
    output,
    OnInit,
    signal
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
    styleUrls: ['./aside-recurring-voucher-create.component.scss'],
    standalone: false
})
export class AsideRecurrenceVoucherCreateComponent implements OnInit {
    // Add this property to your component class
    previewDates: string[] = [];
    /* =======================
       INPUT / OUTPUT
    ======================= */
    recurrenceForm = input<FormGroup>(); // for embedded usage
    recurrenceChange = output<FormGroup>();

    activeForm!: FormGroup; // The form actually used (input or internal)

    // Add this with other form controls
    monthlyModeControl = new FormControl<'DAY' | 'THE'>('DAY');

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
    showCustom = signal(false);
    showDayThe = signal(false);
    showWeekdayToggle = signal(false);
    // In the component class, add this with other signals
    monthlyMode = signal<'DAY' | 'THE'>('DAY');
    /* =======================
       CONSTANT OPTIONS
    ======================= */
    weekdays = [
        { label: 'MON', value: 'Monday' },
        { label: 'TUE', value: 'Tuesday' },
        { label: 'WED', value: 'Wednesday' },
        { label: 'THU', value: 'Thursday' },
        { label: 'FRI', value: 'Friday' },
        { label: 'SAT', value: 'Saturday' },
        { label: 'SUN', value: 'Sunday' }
    ];

    weekdayOptions = [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' }
    ];

    weekOfMonthOptions = [
        { label: '1st', value: 1 },
        { label: '2nd', value: 2 },
        { label: '3rd', value: 3 },
        { label: '4th', value: 4 },
        { label: '5th', value: 5 }
    ];

    monthDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

    repeatOptions = signal<Array<{ label: string; value: any }>>([]);
    selectedRepeatOption = signal<
        | 'DAY'
        | 'WEEKLY'
        | 'MONTHLY_DATE'
        | 'MONTHLY_WEEKDAY'
        | 'CUSTOM'
        | null
    >(null);

    /* =======================
       INIT
    ======================= */
    ngOnInit(): void {
        // Initialize the form if not provided
        if (!this.recurrenceForm()) {
            this.initializeForm();
        } else {
            this.activeForm = this.recurrenceForm()!;
        }
        // Subscribe to monthly mode changes
        this.monthlyModeControl.valueChanges.subscribe((value) => {
            if (value === 'DAY') {
                this.selectMonthlyDay();
            } else if (value === 'THE') {
                this.selectMonthlyThe();
            }
        });
        // Add this in ngOnInit() or where you initialize your form
        this.activeForm.valueChanges.subscribe(() => {
            this.refreshPreview();
        });
    }

    // Add this method to your component
    private updatePreviewDates(dates: string[]): void {
        this.previewDates = dates.map(dateStr => {
            // Convert "DD-MM-YYYY" to Date object
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            // Format as "MMM d EEE" (e.g., "Dec 31 Wed")
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                weekday: 'short'
            });
        });
    }
    // Call this method when you receive dates from your API
    // Example:
    // this.yourApiService.getDates().subscribe(response => {
    //     this.updatePreviewDates(response.dates);
    // });
    // You can also add a method to refresh preview based on form values
    private refreshPreview(): void {
        // This is where you would call your API with the current form values
        // For now, we'll just show a mock response
        const mockResponse = {
            dates: ['22-01-2026'] // Example date in DD-MM-YYYY format
        };
        this.updatePreviewDates(mockResponse.dates);
    }

    private initializeForm(): void {
        this.activeForm = this.fb.group({
            startDate: [new Date(), Validators.required], // Set current date as default
            frequency: this.fb.group({
                interval: [1, [Validators.required, Validators.min(1)]],
                unit: ['DAY', Validators.required]
            }),
            repeatOn: this.fb.group({
                type: 'DAY_OF_MONTH',
                dayOfMonth: [new Date().getDate()], // Set current day of month
                nth: null,
                weekday: null
            }),
            end: this.fb.group({
                type: 'NEVER',
                endDate: null
            })
        });

        // Set up initial UI state
        this.showCustom.set(true);
        this.showDayThe.set(false);
        this.showWeekdayToggle.set(false);
        this.selectedRepeatOption.set('CUSTOM');
        this.monthlyModeControl.setValue('DAY');
    }


    private ensureRepeatOnControls(): void {
        const group = this.repeatOnForm;

        if (!group.get('monthlyMode')) {
            group.addControl('monthlyMode', new FormControl('DAY'));
        }

        if (!group.get('dayOfMonth')) {
            group.addControl('dayOfMonth', new FormControl(null));
        }

        if (!group.get('nth')) {
            group.addControl('nth', new FormControl(null));
        }

        if (!group.get('weekday')) {
            group.addControl('weekday', new FormControl(null));
        }

        if (!group.get('weekdays')) {
            group.addControl('weekdays', this.fb.array([]));
        }
    }


    /* =======================
       FORM FACTORY
    ======================= */
    private createRecurrenceForm(): FormGroup {
        return this.fb.group({
            startDate: [null, Validators.required],

            frequency: this.fb.group({
                unit: ['MONTH'],
                interval: [1, [Validators.required, Validators.min(1)]]
            }),

            repeatOn: this.fb.group({
                type: ['EVERY_DAY'],
                weekdays: this.fb.array([]),   // ✅ ALWAYS exists
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


    /* =======================
       FORM GETTERS
    ======================= */
    get repeatOnForm(): FormGroup {
        return this.activeForm.get('repeatOn') as FormGroup;
    }

    get weekdaysArray(): FormArray {
        return this.repeatOnForm.get('weekdays') as FormArray;
    }

    get frequencyUnit(): 'DAY' | 'WEEK' | 'MONTH' | null {
        return this.activeForm.get('frequency.unit')?.value ?? null;
    }

    toggleWeekday(day: string): void {
        if (!this.weekdaysArray) return;

        const values: string[] = this.weekdaysArray.value || [];
        const index = values.indexOf(day);

        if (index >= 0) {
            this.weekdaysArray.removeAt(index);
        } else {
            this.weekdaysArray.push(new FormControl(day));
        }
    }


    /* =======================
       START DATE CHANGE
    ======================= */
    onStartDateChange(date: Date | null): void {
        if (!date || !this.activeForm) return;

        this.activeForm.get('startDate')?.setValue(date, { emitEvent: false });

        // Update the form values based on the current monthly mode
        if (this.monthlyModeControl.value === 'THE') {
            this.selectMonthlyThe();
        } else {
            this.selectMonthlyDay();
        }

        this.buildRepeatOptions(date);
    }

    /* =======================
       REPEAT OPTIONS
    ======================= */
    /* =======================
       REPEAT OPTIONS
    ======================= */
    selectRepeatOption(option: any): void {
        if (!this.activeForm || !this.repeatOnForm) return;
        this.ensureRepeatOnControls(); // ✅ ADD THIS FIRST
        this.selectedRepeatOption.set(option);

        const startDate: Date = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        const { dayOfMonth, weekday, weekOfMonth } = this.getDateMeta(startDate);

        this.resetRepeatOn();

        if (option === 'CUSTOM') {
            this.activeForm.get('frequency')?.patchValue({
                unit: 'MONTH',
                interval: 1
            });

            this.repeatOnForm.patchValue({
                type: 'DAY_OF_MONTH',
                monthlyMode: 'DAY',
                dayOfMonth
            });

            queueMicrotask(() => {
                this.showCustom.set(true);
                this.showDayThe.set(true);
                this.showWeekdayToggle.set(false);
            });

            return;
        }

        this.showCustom.set(false);

        if (option === 'WEEKLY') {
            this.activeForm.get('frequency')?.patchValue({ unit: 'WEEK', interval: 1 });
            this.repeatOnForm.patchValue({ type: 'WEEK_DAYS' });
            this.weekdaysArray.push(new FormControl(weekday));
        }

        if (option === 'MONTHLY_DATE') {
            this.activeForm.get('frequency')?.patchValue({ unit: 'MONTH', interval: 1 });
            this.repeatOnForm.patchValue({
                type: 'DAY_OF_MONTH',
                dayOfMonth
            });
        }

        if (option === 'MONTHLY_WEEKDAY') {
            this.activeForm.get('frequency')?.patchValue({ unit: 'MONTH', interval: 1 });
            this.repeatOnForm.patchValue({
                type: 'NTH_WEEKDAY',
                nth: weekOfMonth,
                weekday
            });
        }

            this.activeForm.get('end')?.patchValue({
                type: 'ON_DATE',
                endDate: startDate
            });
    }


    /* =======================
       CUSTOM UNIT CHANGE
    ======================= */
    /* =======================
       CUSTOM UNIT CHANGE
    ======================= */
    onRepeatUnitChange(unit: 'DAY' | 'WEEK' | 'MONTH'): void {
        const startDate: Date = this.activeForm.get('startDate')?.value;
        if (!startDate) return;
        this.ensureRepeatOnControls(); // ✅ ADD THIS FIRST
        this.activeForm
            .get('frequency.unit')
            ?.setValue(unit);

        this.resetRepeatOn();

        const { dayOfMonth, weekday } = this.getDateMeta(startDate);

        switch (unit) {
            case 'DAY':
                this.repeatOnForm.patchValue({
                    type: 'EVERY_DAY'
                });
                break;

            case 'WEEK':
                this.repeatOnForm.patchValue({
                    type: 'WEEK_DAYS'
                });
                // Default to repeat on the day of the week of the start date
                this.weekdaysArray.push(new FormControl(weekday));
                break;

            case 'MONTH':
                // Default to 'Day of Month' when switching to Month
                this.repeatOnForm.patchValue({
                    type: 'DAY_OF_MONTH',
                    monthlyMode: 'DAY',
                    dayOfMonth
                });
                break;
        }

        this.showWeekdayToggle.set(unit === 'WEEK');
        this.showDayThe.set(unit === 'MONTH');
        console.log(this.showWeekdayToggle, this.showDayThe);
    }

    isWeekdaySelected(day: string): boolean {
        if (!this.repeatOnForm || !this.weekdaysArray) {
            return false;
        }
        const value = this.weekdaysArray.value;
        return Array.isArray(value) && value.includes(day);
    }


    /* =======================
       MONTHLY MODE
    ======================= */
    selectMonthlyDay(): void {
        const startDate = this.activeForm.get('startDate')?.value;
        if (!startDate) return;


        this.repeatOnForm.patchValue({
            type: 'DAY_OF_MONTH',
            dayOfMonth: startDate.getDate(),
            nth: null,
            weekday: null,
            monthlyMode: 'DAY'
        });
    }
    selectMonthlyThe(): void {
        const startDate = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        const { weekOfMonth, weekday } = this.getDateMeta(startDate);

        this.repeatOnForm.patchValue({
            type: 'NTH_WEEKDAY',
            dayOfMonth: null,
            nth: weekOfMonth,
            weekday,
            monthlyMode: 'THE'
        });
    }

    /* =======================
       HELPERS
    ======================= */

    // Then update the resetRepeatOn method to remove monthlyMode from patchValue
    private resetRepeatOn(): void {
        const weekdaysCtrl = this.repeatOnForm.get('weekdays');

        if (weekdaysCtrl instanceof FormArray) {
            while (weekdaysCtrl.length > 0) {
                weekdaysCtrl.removeAt(0);
            }
        }

        this.repeatOnForm.patchValue({
            type: 'EVERY_DAY',
            dayOfMonth: null,
            nth: null,
            weekday: null,
            monthlyMode: 'DAY'   // ✅ ADD THIS
        }, { emitEvent: false });

        // Reset the UI state
        this.monthlyModeControl.setValue('DAY');

    }

    onMonthlyModeChange(event: any): void {
        const mode = event.value;
        if (mode === 'DAY') {
            this.selectMonthlyDay();
        } else if (mode === 'THE') {
            this.selectMonthlyThe();
        }
    }


    private buildRepeatOptions(startDate: Date): void {
        const { dayOfMonth, weekday, weekOfMonth } = this.getDateMeta(startDate);
        const weekdayName = this.weekdayOptions.find(w => w.value === weekday)?.label || '';

        this.repeatOptions.set([
            { label: `Weekly on ${weekdayName}`, value: 'WEEKLY' },
            {
                label: `Monthly on ${ this.getOrdinal(dayOfMonth) }`,
                value: 'MONTHLY_DATE' },
                    {
                        label: `Monthly on the ${ this.getOrdinal(weekOfMonth) } ${ weekdayName }`,
                            value: 'MONTHLY_WEEKDAY'
        },
                    { label: 'Custom', value: 'CUSTOM' }
    ]);
    }

    private getDateMeta(date: Date) {
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
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
