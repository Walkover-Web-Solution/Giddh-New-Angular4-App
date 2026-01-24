import {
    Component,
    input,
    output,
    OnInit,
    signal,
    Inject,
    Optional
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecurrenceFormService } from '../../services/aside-recurring-voucher.service';
import { debounceTime, ReplaySubject, takeUntil, filter, switchMap, Subject } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'aside-recurrence-voucher-create',
    templateUrl: './aside-recurring-voucher-create.component.html',
    styleUrls: ['./aside-recurring-voucher-create.component.scss'],
    standalone: false
})
export class AsideRecurrenceVoucherCreateComponent implements OnInit {
    // Add this property to your component class
    previewDates: string[] = [];
    isDialogMode = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private previewEnabled$ = new Subject<boolean>();
    private isPreviewPausedFlag = false;
    /* =======================
       INPUT / OUTPUT
    ======================= */
    recurrenceForm = input<FormGroup>(); // for embedded usage
    recurrenceChange = output<FormGroup>();

    activeForm!: FormGroup; // The form actually used (input or internal)

    // Public method to pause/resume preview from parent component
    setSubmitting(value: boolean): void {
        if (value) {
            // Pause preview
            this.isPreviewPausedFlag = true;
            this.previewEnabled$.next(false);
        } else {
            // Resume after 800ms to allow debounce to complete
            setTimeout(() => {
                this.isPreviewPausedFlag = false;
                this.previewEnabled$.next(true);
            }, 800);
        }
    }
    
    private isPreviewPaused(): boolean {
        return this.isPreviewPausedFlag;
    }

    // Add this with other form controls
    monthlyModeControl = new FormControl<'DAY' | 'THE'>('DAY');

    /* =======================
       DATE CONSTRAINT
    ======================= */
    minStartDate: Date = new Date();
    dialogTitle = 'Recurring Voucher';

    constructor(private fb: FormBuilder,
        private recurrenceService: RecurrenceFormService,
        private toasterService: ToasterService,
        @Optional() private dialogRef: MatDialogRef<AsideRecurrenceVoucherCreateComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.minStartDate.setHours(0, 0, 0, 0);
        this.isDialogMode = !!dialogRef;
        console.log(this.data)
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
        // Initialize the form if not provided (CREATE mode)
        if (!this.recurrenceForm()) {
            this.initializeForm();
        } else {
            // UPDATE/EDIT mode: Use form from parent
            this.activeForm = this.recurrenceForm()!;
            
            // Build UI based on existing form data (don't reset values)
            const startDate = this.activeForm.get('startDate')?.value;
            const frequencyUnit = this.activeForm.get('frequency.unit')?.value;
            const repeatOnType = this.activeForm.get('repeatOn.type')?.value;
            const monthlyMode = this.activeForm.get('repeatOn.monthlyMode')?.value;
            
            if (startDate) {
                // Only build repeat options, don't call onStartDateChange which resets values
                this.buildRepeatOptions(startDate);
                this.ensureRepeatOnControls();
                
                // Set UI state dynamically based on existing form data
                this.showCustom.set(false);
                this.showDayThe.set(false);
                this.showWeekdayToggle.set(false);
                
                // Determine which repeat option matches the existing form configuration
                let selectedOption: 'DAY' | 'WEEKLY' | 'MONTHLY_DATE' | 'MONTHLY_WEEKDAY' | 'CUSTOM' | null = null;
                
                // Determine visibility and mode based on frequency and repeat type
                if (frequencyUnit === 'WEEK' && repeatOnType === 'WEEK_DAYS') {
                    this.showWeekdayToggle.set(true);
                    selectedOption = 'WEEKLY';
                } else if (frequencyUnit === 'MONTH') {
                    this.showDayThe.set(true);
                    if (monthlyMode === 'THE') {
                        this.monthlyModeControl.setValue('THE', { emitEvent: false });
                        selectedOption = 'MONTHLY_WEEKDAY';
                    } else {
                        this.monthlyModeControl.setValue('DAY', { emitEvent: false });
                        selectedOption = 'MONTHLY_DATE';
                    }
                } else {
                    this.monthlyModeControl.setValue('DAY', { emitEvent: false });
                }
                
                // Set the selected repeat option
                this.selectedRepeatOption.set(selectedOption);
            }
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
        this.activeForm.valueChanges.pipe(
            debounceTime(700),
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            // Check if preview is enabled before calling
            if (!this.isPreviewPaused()) {
                this.refreshPreview();
            }
        });
        
        // Initialize preview as enabled
        this.previewEnabled$.next(true);
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
        if (!this.activeForm) return;

        const payload = this.recurrenceService.getCleanFormValue(this.activeForm);
        this.recurrenceService.preview(payload).subscribe({
            next: (res) => {
                const dates = (res as any)?.body?.dates || (res as any)?.dates || [];
                this.updatePreviewDates(Array.isArray(dates) ? dates : []);
            },
            error: (err) => {
                console.error('Preview fetch failed', err);
                this.previewDates = [];
            }
        });
    }

    private initializeForm(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.recurrenceService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);

        this.activeForm = this.fb.group({
            startDate: [today, Validators.required], // Set current date as default
            frequency: this.fb.group({
                interval: [1, [Validators.required, Validators.min(1)]],
                unit: ['MONTH', Validators.required]
            }),
            repeatOn: this.fb.group({
                type: ['DAY_OF_MONTH'],
                dayOfMonth: [today.getDate()], // Set current day of month
                nth: [nth],
                weekday: [weekday],
                monthlyMode: ['DAY'],
                weekdays: this.fb.array([])
            }),
            end: this.fb.group({
                type: ['ON_DATE'],
                endDate: [today]
            })
        });

        // Set up initial UI state
        this.showCustom.set(false);
        this.showDayThe.set(false);
        this.showWeekdayToggle.set(false);
        this.selectedRepeatOption.set(null);
        this.monthlyModeControl.setValue('DAY', { emitEvent: false });

        // Pre-populate repeat options and dependent controls based on today's date
        this.buildRepeatOptions(today);
        this.onStartDateChange(today);
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.recurrenceService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);

        return this.fb.group({
            startDate: [today, Validators.required],

            frequency: this.fb.group({
                unit: ['MONTH', Validators.required],
                interval: [1, [Validators.required, Validators.min(1)]]
            }),

            repeatOn: this.fb.group({
                type: ['DAY_OF_MONTH'],
                weekdays: this.fb.array([]),   // ✅ ALWAYS exists
                dayOfMonth: [today.getDate()],
                nth: [nth],
                weekday: [weekday],
                monthlyMode: ['DAY']
            }),

            end: this.fb.group({
                type: ['ON_DATE'],
                endDate: [today],
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

        this.buildRepeatOptions(date);

        const { dayOfMonth, weekday, weekOfMonth } = this.recurrenceService.getDateMeta(date);
        const currentFrequencyUnit = this.activeForm.get('frequency.unit')?.value || 'MONTH';
        const isCustomMode = this.showCustom();

        if (this.repeatOptions().length > 0 && !this.selectedRepeatOption()) {
            const firstOption = this.repeatOptions()[0].value;
            this.selectedRepeatOption.set(firstOption);
        }

        this.ensureRepeatOnControls();

        // Clear weekdays array first
        const weekdaysCtrl = this.repeatOnForm.get('weekdays');
        if (weekdaysCtrl instanceof FormArray) {
            while (weekdaysCtrl.length > 0) {
                weekdaysCtrl.removeAt(0);
            }
        }

        // Reset repeat values based on current frequency unit or CUSTOM mode
        if (isCustomMode) {
            // CUSTOM mode: Keep MONTH frequency but update day/nth/weekday values
            this.repeatOnForm.patchValue({
                type: 'DAY_OF_MONTH',
                monthlyMode: 'DAY',
                dayOfMonth: dayOfMonth,
                nth: weekOfMonth,
                weekday: weekday
            }, { emitEvent: false });
            this.monthlyModeControl.setValue('DAY', { emitEvent: false });
            this.showCustom.set(true);
            this.showDayThe.set(true);
            this.showWeekdayToggle.set(false);
        } else {
            // Standard modes: Reset based on frequency unit
            switch (currentFrequencyUnit) {
                case 'DAY':
                    this.repeatOnForm.patchValue({
                        type: 'EVERY_DAY',
                        dayOfMonth: null,
                        nth: null,
                        weekday: null,
                        monthlyMode: 'DAY'
                    }, { emitEvent: false });
                    this.showWeekdayToggle.set(false);
                    this.showDayThe.set(false);
                    break;

                case 'WEEK':
                    this.repeatOnForm.patchValue({
                        type: 'WEEK_DAYS',
                        dayOfMonth: null,
                        nth: null,
                        monthlyMode: 'DAY'
                    }, { emitEvent: false });
                    this.weekdaysArray.push(new FormControl(weekday));
                    this.showWeekdayToggle.set(true);
                    this.showDayThe.set(false);
                    break;

                case 'MONTH':
                    this.repeatOnForm.patchValue({
                        type: 'DAY_OF_MONTH',
                        monthlyMode: 'DAY',
                        dayOfMonth: dayOfMonth,
                        nth: weekOfMonth,
                        weekday: weekday
                    }, { emitEvent: false });
                    this.monthlyModeControl.setValue('DAY', { emitEvent: false });
                    this.showWeekdayToggle.set(false);
                    this.showDayThe.set(true);
                    break;
            }
        }

        this.activeForm.get('end')?.patchValue({
            type: 'ON_DATE',
            endDate: date
        }, { emitEvent: false });
    }

    /* =======================
       REPEAT OPTIONS
    ======================= */
    selectRepeatOption(option: any): void {
        if (!this.activeForm || !this.repeatOnForm) return;
        this.ensureRepeatOnControls(); // ✅ ADD THIS FIRST
        this.selectedRepeatOption.set(option);

        const startDate: Date = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        const { dayOfMonth, weekday, weekOfMonth } = this.recurrenceService.getDateMeta(startDate);

        this.resetRepeatOn();

        if (option === 'CUSTOM') {
            this.activeForm.get('frequency')?.patchValue({
                unit: 'MONTH',
                interval: 1
            });

            this.repeatOnForm.patchValue({
                type: 'DAY_OF_MONTH',
                monthlyMode: 'DAY',
                dayOfMonth,
                // Pre-fill THE values too so selects show data even if radio is DAY
                nth: weekOfMonth,
                weekday
            });

            // Keep radio on DAY but keep THE selects populated
            this.monthlyModeControl.setValue('DAY', { emitEvent: false });

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

        const { dayOfMonth, weekday, weekOfMonth } = this.recurrenceService.getDateMeta(startDate);

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
                    dayOfMonth,
                    nth: weekOfMonth,
                    weekday
                });
                this.monthlyModeControl.setValue('DAY', { emitEvent: false });
                break;
        }

        this.showWeekdayToggle.set(unit === 'WEEK');
        this.showDayThe.set(unit === 'MONTH');
    }

    isWeekdaySelected(day: string): boolean {
        if (!this.repeatOnForm || !this.weekdaysArray) {
            return false;
        }
        const value = this.weekdaysArray.value;
        console.log(this.weekdaysArray, day, value);
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

        const { weekOfMonth, weekday } = this.recurrenceService.getDateMeta(startDate);

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
        const { dayOfMonth, weekday, weekOfMonth } = this.recurrenceService.getDateMeta(startDate);
        const weekdayName = this.weekdayOptions.find(w => w.value === weekday)?.label || '';

        this.repeatOptions.set([
            { label: `Weekly on ${weekdayName}`, value: 'WEEKLY' },
            {
                label: `Monthly on ${this.recurrenceService.getOrdinal(dayOfMonth)}`,
                value: 'MONTHLY_DATE'
            },
            {
                label: `Monthly on the ${this.recurrenceService.getOrdinal(weekOfMonth)} ${weekdayName}`,
                value: 'MONTHLY_WEEKDAY'
            },
            { label: 'Custom', value: 'CUSTOM' }
        ]);
    }


    // Add a method to close the dialog with the form data
    onSubmit(): void {
        if (this.activeForm.valid) {
            const cleanData = this.recurrenceService.getCleanFormValue(this.activeForm);
            const voucherUniqueName = this.data?.voucher?.uniqueName; // Get from context/parameter
            this.recurrenceService.makeRecurring(voucherUniqueName, cleanData).subscribe({
                next: (res: any) => {
                    if (res?.status === 'success') {
                        this.toasterService.showSnackBar("success", res?.body);
                        this.dialogRef.close();
                    } else {
                        this.toasterService.showSnackBar("error", res?.message);
                    }
                },
                error: (err) => {
                    this.toasterService.showSnackBar("error", err?.message);
                }
            });
        }
    }
    // Add a method to close the dialog without saving
    onCancel(): void {
        this.dialogRef.close();
    }
}
