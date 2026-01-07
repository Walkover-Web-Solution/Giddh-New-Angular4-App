import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { EMAIL_VALIDATION_REGEX, IOption, MOBILE_REGEX_PATTERN } from "../../../app.constant";
import { cloneDeep } from "../../../lodash-optimized";

@Component({
    selector: "select-multiple-fields",
    templateUrl: "./select-multiple-fields.component.html",
    styleUrls: ["./select-multiple-fields.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectMultipleFieldsComponent),
            multi: true
        }
    ],
    standalone: false
})
export class SelectMultipleFieldsComponent implements OnInit, OnDestroy, OnChanges {
    /** Trigger instance for auto complete */
    @ViewChild('trigger', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    /** Select Field instance for auto focus */
    @ViewChild('selectField', { static: false }) public selectField: ElementRef<HTMLInputElement>;
    /** List of dropdown options */
    @Input() public options: any;
    /** List of selected values */
    @Input() public selectedValues: any[] = [];
    /** Placeholder of search field */
    @Input() public placeholder: any = "";
    /** Label of search field */
    @Input() public label: any = "";
    /** List of validations */
    @Input() public validations: any[] = [];
    /** CSS class name to add on the field */
    @Input() public showError: boolean = false;
    /** Holds prefix of chip text */
    @Input() public chipPrefix: string = '';
    /** Holds sufix of chip text */
    @Input() public chipSuffix: string = '';
    /** The parent component can dynamically control the focus of the input field by passing a boolean value. */
    @Input() public autoFocus: boolean = false;
    /** Name of search field */
    @Input() public name: any = "";
    /** Holds appearance of dropdown field */
    @Input() public appearance: string = '';
    /** True if it's purchase order multi selection field */
    @Input() public isPurchaseOrder: string = '';
    /** Holds module translation data */
    @Input() public localeData: any = {};
    /** Holds autocomplete position */
    @Input() public autoCompletePosition: string = 'auto';
    /** Holds CSS class which applied on mat options tag */
    @Input() public optionClass: string;
    /** Holds module translation data */
    @Input() public commonLocaleData: any = {};
    /** True if the component should be used as dynamic search component instead of static search */
    @Input() public enableDynamicSearch: boolean;
    /** True if field is readonly */
    @Input() public readonly: boolean;
    /** True if field is disabled */
    @Input() public disabled: boolean;
    /** Show Mat Label In with appearance outline Icon */
    @Input() public showMatLabel: boolean = false;
    /** List of selected values represented by their unique names. */
    @Input() public chipListUniqueName: string[] = [];
    /** True if field is required */
    @Input() public required: boolean = false;
    /** Hide selected options from dropdown list */
    @Input() public hideSelectedOptions: boolean = true;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** Emits dynamic searched query */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter();
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
    /** Emits the updated list of selected option unique names whenever the selection changes. */
    @Output() public selectedOptionUniqueName: EventEmitter<any> = new EventEmitter<any>();
    /** List of chips based on selected values */
    public chipList: any[] = [];
    /** Search field form control */
    public searchFormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions$: Observable<IOption[]>;
    /** Emit with seperate code for chiplist */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to allow adding of new chips */
    @Input() private allowAddChip: boolean = true;
    /** Next observable */
    public next$: Subject<void> = new Subject();
    /** Function to be called when the control value changes */
    private onChange: (value: any) => void = () => { };
    /** Function to be called when the control is touched */
    private onTouched: () => void = () => { };
    /** Holds value */
    public value: any[] = [];
    /** Holds last search value */
    public lastSearchString: string = null;
    /** Returns true if suffix or prefix is not empty string */
    private get isSuffixPrefixUsed(): boolean {
        return Boolean(this.chipPrefix || this.chipSuffix);
    }


    constructor(
        private changeDetection: ChangeDetectorRef
    ) { }

    /**
     * Initializes the component
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public ngOnInit(): void {
        this.searchFormControl.valueChanges.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe(search => {
            if (typeof search === 'string') {
                this.lastSearchString = search;
                if (this.enableDynamicSearch) {
                    this.dynamicSearchedQuery.emit(search);
                } else {
                    this.filterOptions(search);
                }
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Writes value in ng value accessor
     *
     * @param {*} value
     * @memberof SelectMultipleFieldsComponent
     */
    public writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.value = value;
        } else {
            this.value = [];
        }
        this.onChange(value);
    }

    /**
     * Detects the changed values and updates it on UI
     *
     * @param {SimpleChanges} changes
     * @memberof SelectMultipleFieldsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            // Apply filtering when options change to respect hideSelectedOptions
            if (!this.enableDynamicSearch) {
                this.filterOptions(this.lastSearchString || "");
            } else {
                // For dynamic search, filter options to hide selected ones
                this.fieldFilteredOptions$ = of(this.getFilteredOptionsForDynamicSearch(changes.options.currentValue));
            }
        }
        if (changes?.selectedValues && changes.selectedValues.currentValue) {
            if (typeof changes.selectedValues.currentValue === "string") {
                this.chipList = cloneDeep(changes.selectedValues.currentValue?.split(","));
            } else {
                this.chipList = cloneDeep(changes.selectedValues.currentValue);
            }
            // Refresh filtered options when selected values change
            if (!this.enableDynamicSearch && this.options) {
                this.filterOptions("");
            } else if (this.enableDynamicSearch && this.options) {
                // For dynamic search, refresh filtered options to hide selected items
                this.fieldFilteredOptions$ = of(this.getFilteredOptionsForDynamicSearch(this.options));
            }
        }
    }

    /**
     * Lifecycle hook which releases all memory
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function puts the focus in input
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.autoFocus && this.selectField) {
                this.selectField.nativeElement.focus();
            }
        }, 100);
    }

    /**
     * Filters the option based on search and hides selected options if enabled
     *
     * @private
     * @param {string} search
     * @memberof SelectMultipleFieldsComponent
     */
    private filterOptions(search: string): void {
        let filteredOptions: IOption[] = [];
        this.options?.forEach(option => {
            const matchesSearch = typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1;
            let value = option?.value;
            let label = option?.label;
            if (this.isSuffixPrefixUsed) {
                value = this.chipPrefix + option?.value + this.chipSuffix;
                label = this.chipPrefix + option?.label + this.chipSuffix;
            }
            const isNotSelected = !this.hideSelectedOptions || !(this.selectedValues?.includes(value) || this.selectedValues?.includes(label));

            if (matchesSearch && isNotSelected) {
                filteredOptions.push({ label: option.label, value: option?.value, additional: option });
            }
        });

        this.fieldFilteredOptions$ = of(filteredOptions);
        this.changeDetection.detectChanges();
    }

    /**
     * Callback for select option from dropdown - removes selected option from dropdown list
     *
     * @param {*} option
     * @memberof SelectMultipleFieldsComponent
     */
    public selectOption(option: any): void {
        if (this.lastSearchString?.length) {
            this.searchFormControl.setValue("");
        }
        const selectOptionValue = option?.option?.value?.label;
        this.writeValue([...this.value, option?.option?.value?.value]);
        if (selectOptionValue && !this.chipList.includes(this.chipPrefix + selectOptionValue + this.chipSuffix)) {
            this.chipListUniqueName.push(option.option.value.value);
            if (!this.isSuffixPrefixUsed) {
                 if (Array.isArray(this.selectedValues)) {
                     this.selectedValues.push(option.option.value.value);
                } else if (typeof this.selectedValues === 'string') {
                    this.selectedValues = cloneDeep((this.selectedValues as string).split(","));
                }
            }
            this.chipList.push(this.chipPrefix + selectOptionValue + this.chipSuffix);
            // This will refresh filtered options and hide the selected item from dropdown
            this.emitList();
        }
    }

    /**
     * Callback for remove option from chip - adds removed option back to dropdown list
     *
     * @param {number} index
     * @memberof SelectMultipleFieldsComponent
     */
    public removeOption(index: number): void {
        if (index >= 0) {
            this.chipListUniqueName.splice(index, 1);
            this.chipList.splice(index, 1);
            this.value.splice(index, 1);
            this.writeValue(this.value);
            // Close the autocomplete dropdown if it's open
            setTimeout(() => {
                if (this.trigger && this.trigger.panelOpen) {
                    this.closePanel();
                }
            }, 100);  // Delay slightly to allow for view update
            // This will refresh filtered options and show the removed item back in dropdown
            this.emitList();
        }
    }

    /**
     * Close dropdown menu
     *
     * @private
     * @memberof SelectMultipleFieldsComponent
     */
    public closePanel(): void {
        this.trigger.closePanel();
    }

    /**
     * Callback for add chip
     *
     * @param {*} event
     * @memberof SelectMultipleFieldsComponent
     */
    public addChip(event: any): void {
        const input = event?.input;
        if (this.allowAddChip) {
            const value = event?.value?.trim();
            if (value && (!this.validations?.length || (this.validations?.includes("email") && this.validateEmail(value)) || (this.validations?.includes("mobile") && this.validateMobile(value))) && !this.chipList.includes(value)) {
                this.chipList?.push(value);
                this.writeValue([...this.value, value]);
            }
            this.emitList();
        }
        if (input) {
            input.value = '';
            this.filterOptions("");
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Validates email
     *
     * @param {string} email
     * @returns {boolean}
     * @memberof SelectMultipleFieldsComponent
     */
    public validateEmail(email: string): boolean {
        return EMAIL_VALIDATION_REGEX.test(String(email)?.toLowerCase());
    }

    /**
     * Validates mobile
     *
     * @param {*} mobile
     * @returns {boolean}
     * @memberof SelectMultipleFieldsComponent
     */
    public validateMobile(mobile: any): boolean {
        return MOBILE_REGEX_PATTERN.test(mobile);
    }

    /**
     * Filters options for dynamic search to hide selected items
     *
     * @private
     * @param {any[]} options
     * @returns {IOption[]}
     * @memberof SelectMultipleFieldsComponent
     */
    private getFilteredOptionsForDynamicSearch(options: any[]): IOption[] {
        if (!this.hideSelectedOptions || !options) {
            return cloneDeep(options) || [];
        }

        return options.filter(option => {
            let value = option?.value;
            let label = option?.label;
            if (this.isSuffixPrefixUsed) {
                value = this.chipPrefix + option?.value + this.chipSuffix;
                label = this.chipPrefix + option?.label + this.chipSuffix;
            }
            return !(this.selectedValues?.includes(value) || this.selectedValues?.includes(label));
        });
    }

    /**
     * Emits list of selected chips and refreshes filtered options
     *
     * @private
     * @memberof SelectMultipleFieldsComponent
     */
    private emitList(): void {
        this.selectedOption.emit(this.chipList);
        this.selectedOptionUniqueName.emit(this.chipListUniqueName);
        // Refresh filtered options to hide newly selected items
        if (!this.enableDynamicSearch) {
            this.filterOptions(this.lastSearchString || "");
        } else if (this.options) {
            // For dynamic search, filter options to hide selected items
            this.fieldFilteredOptions$ = of(this.getFilteredOptionsForDynamicSearch(this.options));
        }
        this.changeDetection.detectChanges();
    }

    /**
   * This will use for close dropdown panel
   *
   * @param {*} event Pointer event
   * @memberof SelectMultipleFieldsComponent
   */
    public closeDropdownPanel(event?: any): void {
        if (event?.currentTarget?.activeElement?.className?.indexOf("select-multiple-field-input") > -1) {
            /*
                Don't close the panel if the user clicks at the corner of the input field,
                handles the edge case when user clicks the corner and the suggestions get hidden
            */
            return;
        }
        this.closePanel();
    }

    /**
     * Callback for onscroll in dropdown
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public onScroll(): void {
        this.next$.next();
        this.scrollEnd.emit();
    }

    /**
     * On change method
     *
     * @param {*} fn
     * @memberof SelectMultipleFieldsComponent
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * On touch method
     *
     * @param {*} fn
     * @memberof SelectMultipleFieldsComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Handle mat autocomplete panel closed
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public panelClosed(): void {
        this.searchFormControl.setValue(null);
    }

    /**
     * Handle mat autocomplete panel opened
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public panelOpened(): void {
        if (this.enableDynamicSearch) {
            this.dynamicSearchedQuery.emit("");
            // Also filter options to hide selected items for dynamic search
            if (this.options) {
                this.fieldFilteredOptions$ = of(this.getFilteredOptionsForDynamicSearch(this.options));
            }
        } else {
            this.filterOptions("");
        }
    }
}
