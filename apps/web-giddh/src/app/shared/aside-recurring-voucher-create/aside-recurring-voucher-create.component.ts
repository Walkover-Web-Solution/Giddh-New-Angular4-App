import {
    Component,
    input,
    output,
    OnInit,
    AfterViewInit,
    signal,
    Inject,
    Optional,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RecurrenceFormService } from '../../services/aside-recurring-voucher.service';
import { debounceTime, ReplaySubject, takeUntil, Subject } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { RecurringFrequencyUnit, RecurringMonthlyMode, RecurringEndType, RecurringRepeatOption, RecurringWeekday, RecurringRepeatType } from '../../models/enums/recurring-voucher.enum';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { KeyboardNavigationModule } from '../helpers/directives/enter-next/keyboard-navigation.module';

@Component({
    selector: 'aside-recurrence-voucher-create',
    templateUrl: './aside-recurring-voucher-create.component.html',
    styleUrls: ['./aside-recurring-voucher-create.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDividerModule,
        TranslateDirectiveModule,
        GiddhDatepickerModule,
        FormFieldsModule,
        KeyboardNavigationModule,
        MatChipsModule
    ]
})
/**
 * Component for creating and managing recurring voucher configurations.
 * Supports both dialog mode and embedded mode with form-based recurrence setup.
 */
export class AsideRecurrenceVoucherCreateComponent implements OnInit, AfterViewInit {
    /** Holds localized text for this component */
    public readonly localeData = signal<any>({});
    /** Holds common localized text used across the app */
    public readonly commonLocaleData = signal<any>({});
    /** Array of formatted preview dates for the recurring voucher pattern */
    public previewDates: string[] = [];
    /** Flag indicating if component is running in dialog mode */
    public isDialogMode = false;
    /** Subject for managing component destruction and cleanup */
    private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Subject for controlling preview generation state */
    private readonly previewEnabled$ = new Subject<boolean>();
    /** Internal flag to track if preview generation is paused */
    private isPreviewPausedFlag = false;
    /** Pending frequency unit to be set after view initialization */
    private pendingFrequencyUnit: RecurringFrequencyUnit | null = null;
    /* =======================
       INPUT / OUTPUT
    ======================= */
    /** Input signal for receiving recurrence form from parent component (embedded mode) */
    public readonly recurrenceForm = input<FormGroup>();
    /** Output signal for emitting form changes to parent component */
    public readonly recurrenceChange = output<FormGroup>();

    /** Active form group - either from input or internally created */
    public activeForm!: FormGroup;

    /**
     * Pauses or resumes preview generation from parent component
     * @param {boolean} value - True to pause preview, false to resume
     */
    public setSubmitting(value: boolean): void {
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

    /**
     * Checks if preview generation is currently paused
     * @returns {boolean} True if preview is paused, false otherwise
     */
    private readonly isPreviewPaused = (): boolean => {
        return this.isPreviewPausedFlag;
    };

    /** Form control for toggling between day-of-month and nth-weekday monthly modes */
    public readonly monthlyModeControl = new FormControl<RecurringMonthlyMode>(RecurringMonthlyMode.DAY);

    /* =======================
       DATE CONSTRAINT
    ======================= */
    /** Minimum allowed start date (today at 00:00:00) */
    protected readonly todayDate = signal<Date>((() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    })());
    /** Minimum allowed end date (same as start date) */
    protected readonly minEndDate = signal<Date>((() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    })());
    /** Title displayed in dialog mode */
    public readonly dialogTitle = 'Recurring Voucher';

    constructor(private fb: FormBuilder,
        private recurrenceService: RecurrenceFormService,
        private generalService: GeneralService,
        private toasterService: ToasterService,
        private cdr: ChangeDetectorRef,
        @Optional() private dialogRef: MatDialogRef<AsideRecurrenceVoucherCreateComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isDialogMode = !!dialogRef;
    }

    /* =======================
       UI STATE FLAGS
    ======================= */
    /** Signal to control visibility of day/the monthly mode selector */
    public readonly showDayThe = signal(false);
    /** Signal to control visibility of weekday toggle buttons */
    public readonly showWeekdayToggle = signal(false);
    /** Signal to control visibility of custom repeat options */
    public readonly initialized = signal(false);

    /* =======================
       ENUMS FOR TEMPLATE
    ======================= */
    /** Expose RecurringFrequencyUnit enum for template usage */
    public readonly RecurringFrequencyUnit = RecurringFrequencyUnit;
    /** Expose RecurringMonthlyMode enum for template usage */
    public readonly RecurringMonthlyMode = RecurringMonthlyMode;
    /** Expose RecurringEndType enum for template usage */
    public readonly RecurringEndType = RecurringEndType;
    /** Expose RecurringRepeatOption enum for template usage */
    public readonly RecurringRepeatOption = RecurringRepeatOption;
    /** Expose RecurringRepeatType enum for template usage */
    public readonly RecurringRepeatType = RecurringRepeatType;
    /** Expose RecurringWeekday enum for template usage */
    public readonly RecurringWeekday = RecurringWeekday;

    /* =======================
       CONSTANT OPTIONS
    ======================= */
    /** Array of weekday options with short labels for toggle buttons */
    public readonly weekdays = [
        { label: 'MON', value: RecurringWeekday.MONDAY },
        { label: 'TUE', value: RecurringWeekday.TUESDAY },
        { label: 'WED', value: RecurringWeekday.WEDNESDAY },
        { label: 'THU', value: RecurringWeekday.THURSDAY },
        { label: 'FRI', value: RecurringWeekday.FRIDAY },
        { label: 'SAT', value: RecurringWeekday.SATURDAY },
        { label: 'SUN', value: RecurringWeekday.SUNDAY }
    ];

    /** Array of weekday options with full labels for select dropdowns */
    public readonly weekdayOptions = [
        { label: 'Monday', value: RecurringWeekday.MONDAY },
        { label: 'Tuesday', value: RecurringWeekday.TUESDAY },
        { label: 'Wednesday', value: RecurringWeekday.WEDNESDAY },
        { label: 'Thursday', value: RecurringWeekday.THURSDAY },
        { label: 'Friday', value: RecurringWeekday.FRIDAY },
        { label: 'Saturday', value: RecurringWeekday.SATURDAY },
        { label: 'Sunday', value: RecurringWeekday.SUNDAY }
    ];

    /** Array of week-of-month options (1st through 5th) */
    public readonly weekOfMonthOptions = [
        { label: '1st', value: 1 },
        { label: '2nd', value: 2 },
        { label: '3rd', value: 3 },
        { label: '4th', value: 4 },
        { label: '5th', value: 5 }
    ];

    /** Array of days in a month (1-31) */
    public readonly monthDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

    /** Signal containing available repeat options based on selected start date */
    public readonly repeatOptions = signal<Array<{ label: string; value: any }>>([]);
    /** Signal tracking the currently selected repeat option */
    // public readonly selectedRepeatOption = signal<RecurringRepeatOption | null>(null);
    /** Form control for tracking the selected repeat option in the dropdown */
    public readonly repeatOptionControl = new FormControl<RecurringRepeatOption | null>(null);
    /** Stores the repeat option to be set after view initialization */
    private pendingRepeatOption: RecurringRepeatOption | null = null;

    /* =======================
       INIT
    ======================= */
    /**
     * Angular lifecycle hook - initializes form and sets up subscriptions
     * Creates new form if not provided via input, or uses provided form in edit mode
     */
    public ngOnInit(): void {
        // Initialize the form if not provided (CREATE mode)
        if (!this.recurrenceForm()) {
            this.initializeForm();
        } else {
            // UPDATE/EDIT mode: Use form from parent
            this.activeForm = this.recurrenceForm()!;

            // Add repeatOption control if it doesn't exist
            if (!this.activeForm.get('repeatOption')) {
                this.activeForm.addControl('repeatOption', new FormControl(null));
            }

            // Build UI based on existing form data (don't reset values)
            const startDate = this.activeForm.get('startDate')?.value;
            const repeatOption = this.activeForm.get('repeatOption')?.value;
            const frequencyUnit = this.activeForm.get('frequency.unit')?.value;
            const repeatOnType = this.activeForm.get('repeatOn.type')?.value;
            const monthlyMode = this.activeForm.get('repeatOn.monthlyMode')?.value;

            if (startDate) {
                this.updateMinEndDate(startDate);

                // Store the selected option to be set after view initialization
                this.pendingRepeatOption = repeatOption;
                this.pendingFrequencyUnit = frequencyUnit;
                
                // Synchronize monthlyModeControl with form's monthlyMode value
                const initialMode = monthlyMode || RecurringMonthlyMode.DAY;
                this.monthlyModeControl.setValue(initialMode);
                this.monthlyModeControl.updateValueAndValidity();
                this.cdr.detectChanges();

                // Build repeat options
                this.buildRepeatOptions(startDate);
                this.ensureRepeatOnControls();

                // Set UI state dynamically based on existing form data
                if (repeatOption === RecurringRepeatOption.CUSTOM) {
                    // Set visibility flags based on frequency unit
                    if (frequencyUnit === RecurringFrequencyUnit.WEEK) {
                        this.showWeekdayToggle.set(true);
                        this.showDayThe.set(false);
                    } else if (frequencyUnit === RecurringFrequencyUnit.MONTH) {
                        this.showDayThe.set(true);
                        this.showWeekdayToggle.set(false);
                    } else {
                        this.showWeekdayToggle.set(false);
                        this.showDayThe.set(false);
                    }
                } else {
                    this.showDayThe.set(false);
                    this.showWeekdayToggle.set(false);
                    
                    // Re-apply the visibility flags for non-custom options
                    if (frequencyUnit === RecurringFrequencyUnit.WEEK && repeatOnType === RecurringRepeatType.WEEK_DAYS) {
                        this.showWeekdayToggle.set(true);
                    } else if (frequencyUnit === RecurringFrequencyUnit.MONTH) {
                        this.showDayThe.set(true);
                    }
                }
                
                this.cdr.detectChanges();
                
                this.initialized.set(true);
                if (this.initialized()) {
                    this.refreshPreview();
                    this.initialized.set(false);
                }
            }
        }
        // Subscribe to monthly mode changes
        this.monthlyModeControl.valueChanges.subscribe((value) => {
            if (value === RecurringMonthlyMode.DAY) {
                this.selectMonthlyDay();
            } else if (value === RecurringMonthlyMode.THE) {
                this.selectMonthlyThe();
            }
        });
        
        // Subscribe to startDate changes to update minEndDate
        this.activeForm.get('startDate')?.valueChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((startDate: Date) => {
            if (startDate) {
                this.updateMinEndDate(startDate);
            }
        });
        
        // Add this in ngOnInit() or where you initialize your form
        this.activeForm.valueChanges.pipe(
            debounceTime(700),
            takeUntil(this.destroyed$)
        ).subscribe((form) => {
            // Check if preview is enabled before calling
            if (form?.startDate && !this.isPreviewPaused()) {
                this.refreshPreview();
            }
        });

        // Initialize preview as enabled
        this.previewEnabled$.next(true);
    }

    /**
     * Angular lifecycle hook - called after view initialization
     * Sets the repeatOption value after mat-select is fully rendered
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.pendingRepeatOption && this.activeForm) {
                this.activeForm.get('repeatOption')?.setValue(this.pendingRepeatOption, { emitEvent: false });
                this.pendingRepeatOption = null;
            }
            if (this.pendingFrequencyUnit && this.activeForm) {
                const frequencyGroup = this.activeForm.get('frequency') as FormGroup;
                if (frequencyGroup) {
                    const unitControl = frequencyGroup.get('unit');
                    if (unitControl) {
                        const currentValue = unitControl.value;
                        unitControl.setValue(null, { emitEvent: false });
                        unitControl.setValue(this.pendingFrequencyUnit || currentValue, { emitEvent: false });
                        unitControl.updateValueAndValidity({ emitEvent: false });
                    }
                }
                this.pendingFrequencyUnit = null;
            }
            this.cdr.detectChanges();
        }, 200);
    }

    /**
     * Updates preview dates array with formatted date strings
     * Converts DD-MM-YYYY format to localized date display (e.g., "Dec 31 Wed")
     * @param {string[]} dates - Array of dates in DD-MM-YYYY format
     */
    private readonly updatePreviewDates = (dates: string[]): void => {
        this.previewDates = dates.map(dateStr => {
            // Convert "DD-MM-YYYY" to Date object
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            // Format as "MMM d EEE" (e.g., "Dec 31 Wed")
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            const dayName = date.toLocaleString('en-US', { weekday: 'short' });
            return `${monthName} ${day} ${dayName}`;
        });
        // Trigger change detection to update UI
        this.cdr.detectChanges();
    };

    /**
     * Refreshes preview dates by calling the preview API with current form values
     * Debounced to avoid excessive API calls during rapid form changes
     */
    private readonly refreshPreview = (): void => {
        if (!this.activeForm) return;

        const payload = this.recurrenceService.getCleanFormValue(this.activeForm);
        this.recurrenceService.preview(payload).subscribe({
            next: (res) => {
                const dates = (res as any)?.body?.dates || (res as any)?.dates || [];
                this.updatePreviewDates(Array.isArray(dates) ? dates : []);
            },
            error: (err) => {
                this.previewDates = [];
                this.cdr.detectChanges();
            }
        });
    };

    /**
     * Initializes a new recurrence form with default values
     * Sets up form groups for startDate, frequency, repeatOn, and end configurations
     * Builds repeat options based on today's date
     */
    private readonly initializeForm = (): void => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.generalService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);

        this.activeForm = this.fb.group({
            startDate: [today, Validators.required], // Set current date as default
            repeatOption: RecurringRepeatOption.MONTHLY_DATE,
            frequency: this.fb.group({
                interval: [1, [Validators.required, Validators.min(1)]],
                unit: [RecurringFrequencyUnit.MONTH, Validators.required]
            }),
            repeatOn: this.fb.group({
                type: [RecurringRepeatType.DAY_OF_MONTH],
                dayOfMonth: [today.getDate()], // Set current day of month
                nth: [nth],
                weekday: [weekday],
                monthlyMode: [RecurringMonthlyMode.DAY],
                weekdays: this.fb.array([])
            }),
            end: this.fb.group({
                type: [RecurringEndType.NEVER],
                endDate: [today]
            })
        });

        // Set up initial UI state
        this.showDayThe.set(false);
        this.showWeekdayToggle.set(false);
        this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY, { emitEvent: false });

        // Pre-populate repeat options and dependent controls based on today's date
        this.buildRepeatOptions(today);
        this.onStartDateChange(today);
    };


    /**
     * Ensures all required controls exist in the repeatOn form group
     * Adds missing controls: monthlyMode, dayOfMonth, nth, weekday, weekdays
     */
    private readonly ensureRepeatOnControls = (): void => {
        const group = this.repeatOnForm;

        if (!group.get('monthlyMode')) {
            group.addControl('monthlyMode', new FormControl(RecurringMonthlyMode.DAY));
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
    };


    /* =======================
       FORM FACTORY
    ======================= */
    /**
     * Factory method to create a new recurrence form structure
     * @returns {FormGroup} A new form group with recurrence configuration structure
     */
    private readonly createRecurrenceForm = (): FormGroup => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.generalService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);

        return this.fb.group({
            startDate: [today, Validators.required],

            frequency: this.fb.group({
                unit: [RecurringFrequencyUnit.MONTH, Validators.required],
                interval: [1, [Validators.required, Validators.min(1)]]
            }),

            repeatOn: this.fb.group({
                type: [RecurringRepeatType.DAY_OF_MONTH],
                weekdays: this.fb.array([]),   // ✅ ALWAYS exists
                dayOfMonth: [today.getDate()],
                nth: [nth],
                weekday: [weekday],
                monthlyMode: [RecurringMonthlyMode.DAY]
            }),

            end: this.fb.group({
                type: [RecurringEndType.NEVER],
                endDate: [today],
            })
        });
    };


    /* =======================
       FORM GETTERS
    ======================= */
    /**
     * Getter for the repeatOn form group
     * @returns {FormGroup} The repeatOn form group containing repeat configuration
     */
    public get repeatOnForm(): FormGroup {
        return this.activeForm.get('repeatOn') as FormGroup;
    }

    /**
     * Getter for the weekdays form array
     * @returns {FormArray} The weekdays array containing selected weekdays
     */
    public get weekdaysArray(): FormArray {
        return this.repeatOnForm.get('weekdays') as FormArray;
    }

    /**
     * Getter for the current frequency unit
     * @returns {'DAY' | 'WEEK' | 'MONTH' | null} The selected frequency unit
     */
    public get frequencyUnit(): 'DAY' | 'WEEK' | 'MONTH' | null {
        return this.activeForm.get('frequency.unit')?.value ?? null;
    }

    /**
     * Toggles a weekday in the weekdays array
     * Adds the weekday if not present, removes if already selected
     * @param {string} day - The weekday name to toggle (e.g., 'Monday')
     */
    public toggleWeekday(day: string): void {
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
    /**
     * Handles start date change and updates repeat options accordingly
     * Rebuilds repeat options and resets repeat configuration based on new date
     * @param {Date | null} date - The newly selected start date
     */
    public onStartDateChange(date: Date | null): void {
        if (!date || !this.activeForm) return;

        this.activeForm.get('startDate')?.setValue(date, { emitEvent: false });

        this.buildRepeatOptions(date);

        const { dayOfMonth, weekday, weekOfMonth } = this.generalService.getDateMeta(date);
        const currentFrequencyUnit = this.activeForm.get('frequency.unit')?.value || 'MONTH';

        this.ensureRepeatOnControls();

        // Clear weekdays array first
        const weekdaysCtrl = this.repeatOnForm.get('weekdays');
        if (weekdaysCtrl instanceof FormArray) {
            weekdaysCtrl.clear();
        }

        // Reset repeat values based on current frequency unit or CUSTOM mode
        if (this.activeForm.get('repeatOption')?.value === RecurringRepeatOption.CUSTOM) {
            // CUSTOM mode: Keep MONTH frequency but update day/nth/weekday values
            this.repeatOnForm.patchValue({
                type: RecurringRepeatType.DAY_OF_MONTH,
                monthlyMode: RecurringMonthlyMode.DAY,
                dayOfMonth: dayOfMonth,
                nth: weekOfMonth,
                weekday: weekday
            }, { emitEvent: false });
            this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY, { emitEvent: false });
            this.showDayThe.set(true);
            this.showWeekdayToggle.set(false);
        } else {
            // Standard modes: Reset based on frequency unit
            switch (currentFrequencyUnit) {
                case RecurringFrequencyUnit.DAY:
                    this.repeatOnForm.patchValue({
                        type: RecurringRepeatType.EVERY_DAY,
                        dayOfMonth: null,
                        nth: null,
                        weekday: null,
                        monthlyMode: RecurringMonthlyMode.DAY
                    }, { emitEvent: false });
                    this.showWeekdayToggle.set(false);
                    this.showDayThe.set(false);
                    break;

                case RecurringFrequencyUnit.WEEK:
                    this.repeatOnForm.patchValue({
                        type: RecurringRepeatType.WEEK_DAYS,
                        dayOfMonth: null,
                        nth: null,
                        monthlyMode: RecurringMonthlyMode.DAY
                    }, { emitEvent: false });
                    this.weekdaysArray.push(new FormControl(weekday));
                    this.showWeekdayToggle.set(true);
                    this.showDayThe.set(false);
                    break;

                case RecurringFrequencyUnit.MONTH:
                    this.repeatOnForm.patchValue({
                        type: RecurringRepeatType.DAY_OF_MONTH,
                        monthlyMode: RecurringMonthlyMode.DAY,
                        dayOfMonth: dayOfMonth,
                        nth: weekOfMonth,
                        weekday: weekday
                    }, { emitEvent: false });
                    this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY, { emitEvent: false });
                    this.showWeekdayToggle.set(false);
                    this.showDayThe.set(true);
                    break;
            }
        }

        this.activeForm.get('end')?.patchValue({
            type: RecurringEndType.NEVER,
            endDate: date
        }, { emitEvent: false });
    }

    /* =======================
       REPEAT OPTIONS
    ======================= */
    /**
     * Selects a repeat option and configures form accordingly
     * Handles WEEKLY, MONTHLY_DATE, MONTHLY_WEEKDAY, and CUSTOM options
     * @param {any} option - The repeat option to select
     */
    public selectRepeatOption(option: any): void {
        if (!this.activeForm || !this.repeatOnForm) return;
        this.ensureRepeatOnControls(); // ✅ ADD THIS FIRST
        
        // Update the form control
        this.activeForm.get('repeatOption')?.setValue(option, { emitEvent: false });

        const startDate: Date = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        const { dayOfMonth, weekday, weekOfMonth } = this.generalService.getDateMeta(startDate);

        this.resetRepeatOn();

        if (option === RecurringRepeatOption.CUSTOM) {
            this.activeForm.get('frequency')?.patchValue({
                unit: RecurringFrequencyUnit.MONTH,
                interval: 1
            });

            this.repeatOnForm.patchValue({
                type: RecurringRepeatType.DAY_OF_MONTH,
                monthlyMode: RecurringMonthlyMode.DAY,
                dayOfMonth,
                // Pre-fill THE values too so selects show data even if radio is DAY
                nth: weekOfMonth,
                weekday
            });

            // Keep radio on DAY but keep THE selects populated
            this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY);

            queueMicrotask(() => {
                this.showDayThe.set(true);
                this.showWeekdayToggle.set(false);
            });

            return;
        }

        if (option === RecurringRepeatOption.WEEKLY) {
            this.activeForm.get('frequency')?.patchValue({ unit: RecurringFrequencyUnit.WEEK, interval: 1 });
            this.repeatOnForm.patchValue({ type: RecurringRepeatType.WEEK_DAYS });
            this.weekdaysArray.push(new FormControl(weekday));
        }

        if (option === RecurringRepeatOption.MONTHLY_DATE) {
            this.activeForm.get('frequency')?.patchValue({ unit: RecurringFrequencyUnit.MONTH, interval: 1 });
            this.repeatOnForm.patchValue({
                type: RecurringRepeatType.DAY_OF_MONTH,
                dayOfMonth
            });
        }

        if (option === RecurringRepeatOption.MONTHLY_WEEKDAY) {
            this.activeForm.get('frequency')?.patchValue({ unit: RecurringFrequencyUnit.MONTH, interval: 1 });
            this.repeatOnForm.patchValue({
                type: RecurringRepeatType.NTH_WEEKDAY,
                nth: weekOfMonth,
                weekday
            });
        }

        this.activeForm.get('end')?.patchValue({
            type: this.activeForm.get('end')?.value?.type || RecurringEndType.NEVER,
            endDate: startDate
        });
    }


    /* =======================
       CUSTOM UNIT CHANGE
    ======================= */
    /**
     * Handles frequency unit change in custom mode
     * Updates repeat configuration based on selected unit (DAY, WEEK, or MONTH)
     * @param {'DAY' | 'WEEK' | 'MONTH'} unit - The selected frequency unit
     */
    public onRepeatUnitChange(unit: 'DAY' | 'WEEK' | 'MONTH'): void {
        const startDate: Date = this.activeForm.get('startDate')?.value;
        if (!startDate) return;
        this.ensureRepeatOnControls(); // ✅ ADD THIS FIRST
        this.activeForm
            .get('frequency.unit')
            ?.setValue(unit);

        this.resetRepeatOn();

        const { dayOfMonth, weekday, weekOfMonth } = this.generalService.getDateMeta(startDate);

        switch (unit) {
            case RecurringFrequencyUnit.DAY:
                this.repeatOnForm.patchValue({
                    type: RecurringRepeatType.EVERY_DAY
                });
                break;

            case RecurringFrequencyUnit.WEEK:
                this.repeatOnForm.patchValue({
                    type: RecurringRepeatType.WEEK_DAYS
                });
                // Default to repeat on the day of the week of the start date
                this.weekdaysArray.push(new FormControl(weekday));
                break;

            case RecurringFrequencyUnit.MONTH:
                // Default to 'Day of Month' when switching to Month
                this.repeatOnForm.patchValue({
                    type: RecurringRepeatType.DAY_OF_MONTH,
                    monthlyMode: RecurringMonthlyMode.DAY,
                    dayOfMonth,
                    nth: weekOfMonth,
                    weekday
                });
                this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY, { emitEvent: false });
                break;
        }

        this.showWeekdayToggle.set(unit === RecurringFrequencyUnit.WEEK);
        this.showDayThe.set(unit === RecurringFrequencyUnit.MONTH);
    }

    /**
     * Checks if a specific weekday is currently selected
     * @param {string} day - The weekday name to check
     * @returns {boolean} True if the weekday is selected, false otherwise
     */
    public isWeekdaySelected(day: string): boolean {
        if (!this.repeatOnForm || !this.weekdaysArray) {
            return false;
        }
        const value = this.weekdaysArray.value;
        return Array.isArray(value) && value.includes(day);
    }


    /* =======================
       MONTHLY MODE
    ======================= */
    /**
     * Configures form for monthly day-of-month mode
     * Sets repeat type to DAY_OF_MONTH with the day from start date
     */
    public selectMonthlyDay(): void {
        const startDate = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        this.repeatOnForm.patchValue({
            type: RecurringRepeatType.DAY_OF_MONTH,
            dayOfMonth: startDate.getDate(),
            nth: null,
            weekday: null,
            monthlyMode: RecurringMonthlyMode.DAY
        });
        this.cdr.detectChanges();
    }
    /**
     * Configures form for monthly nth-weekday mode
     * Sets repeat type to NTH_WEEKDAY with week and day from start date
     */
    public selectMonthlyThe(): void {
        const startDate = this.activeForm.get('startDate')?.value;
        if (!startDate) return;

        const { weekOfMonth, weekday } = this.generalService.getDateMeta(startDate);

        this.repeatOnForm.patchValue({
            type: RecurringRepeatType.NTH_WEEKDAY,
            dayOfMonth: null,
            nth: weekOfMonth,
            weekday,
            monthlyMode: RecurringMonthlyMode.THE
        });
        this.cdr.detectChanges();
    }

    /* =======================
       HELPERS
    ======================= */

    /**
     * Updates minEndDate based on start date
     * Uses start date if >= today, otherwise uses today
     * @param {Date} startDate - The start date to evaluate
     */
    private updateMinEndDate(startDate: Date): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const normalizedStartDate = new Date(startDate);
        normalizedStartDate.setHours(0, 0, 0, 0);
        
        this.minEndDate.set(normalizedStartDate >= today ? startDate : today);
    }

    /**
     * Resets repeat configuration to default values
     * Clears weekdays array and resets all repeat fields
     */
    private readonly resetRepeatOn = (): void => {
        const weekdaysCtrl = this.repeatOnForm.get('weekdays');

        if (weekdaysCtrl instanceof FormArray) {
            weekdaysCtrl.clear();
        }

        this.repeatOnForm.patchValue({
            type: RecurringRepeatType.EVERY_DAY,
            dayOfMonth: null,
            nth: null,
            weekday: null,
            monthlyMode: RecurringMonthlyMode.DAY
        }, { emitEvent: false });

        this.monthlyModeControl.setValue(RecurringMonthlyMode.DAY);

    };

    /**
     * Handles monthly mode change event
     * Delegates to selectMonthlyDay or selectMonthlyThe based on mode value
     * @param {any} event - The radio button change event
     */
    public onMonthlyModeChange(event: any): void {
        const mode = event.value;
        if (mode === RecurringMonthlyMode.DAY) {
            this.selectMonthlyDay();
        } else if (mode === RecurringMonthlyMode.THE) {
            this.selectMonthlyThe();
        }
    }


    /**
     * Builds repeat options array based on the selected start date
     * Generates labels for WEEKLY, MONTHLY_DATE, MONTHLY_WEEKDAY, and CUSTOM options
     * @param {Date} startDate - The start date to base options on
     */
    private readonly buildRepeatOptions = (startDate: Date): void => {
        const { dayOfMonth, weekday, weekOfMonth } = this.generalService.getDateMeta(startDate);
        const weekdayName = this.weekdayOptions.find(w => w.value === weekday)?.label || '';

        this.repeatOptions.set([
            { label: `Weekly on ${weekdayName}`, value: RecurringRepeatOption.WEEKLY },
            {
                label: `Monthly on ${this.generalService.getOrdinal(dayOfMonth)}`,
                value: RecurringRepeatOption.MONTHLY_DATE
            },
            {
                label: `Monthly on the ${this.generalService.getOrdinal(weekOfMonth)} ${weekdayName}`,
                value: RecurringRepeatOption.MONTHLY_WEEKDAY
            },
            { label: 'Custom', value: RecurringRepeatOption.CUSTOM }
        ]);
    };


    /**
     * Submits the recurrence form and creates/updates recurring voucher
     * Validates form, cleans data, and calls makeRecurring API
     * Shows success/error toast and closes dialog on completion
     */
    public onSubmit(): void {
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
    /**
     * Cancels the dialog without saving
     * Closes the dialog and discards any form changes
     */
    public onCancel(): void {
        this.dialogRef.close();
    }
}
