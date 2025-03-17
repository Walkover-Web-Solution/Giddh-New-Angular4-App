import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { EMAIL_VALIDATION_REGEX, MOBILE_REGEX_PATTERN } from "../../../app.constant";
import { cloneDeep } from "../../../lodash-optimized";
import { IOption } from "../../ng-virtual-select/sh-options.interface";

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
    ]
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
    /** Prevent to close dropdown menu after select */
    @Input() public keepMenuOpenAfterSelect: boolean = false;
    /** Holds autocomplete position */
    @Input() public autoCompletePosition: string = 'auto';
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** Emits dynamic searched query */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter();
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Callback for clear selected value */
    @Output() public onClear: EventEmitter<any> = new EventEmitter<any>();
    /** Holds CSS class which applied on mat options tag */
    @Input() public optionClass: string;
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
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
                    if (!search) {
                        this.onClear.emit({ label: "", value: "" });
                        this.writeValue("");
                    }
                } else {
                    if (search === "") {
                        this.onClear.emit({ label: "", value: "" });
                        this.writeValue("");
                    }
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
            this.fieldFilteredOptions$ = of(cloneDeep(changes.options.currentValue));
        }
        if (changes?.selectedValues && changes.selectedValues.currentValue) {
            if (typeof changes.selectedValues.currentValue === "string") {
                this.chipList = cloneDeep(changes.selectedValues.currentValue?.split(","));
            } else {
                this.chipList = cloneDeep(changes.selectedValues.currentValue);
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
     * Filters the option based on search
     *
     * @private
     * @param {string} search
     * @memberof SelectMultipleFieldsComponent
     */
    private filterOptions(search: string): void {
        let filteredOptions: IOption[] = [];
        this.options?.forEach(option => {
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option?.value, additional: option });
            }
        });

        this.fieldFilteredOptions$ = of(filteredOptions);
        this.changeDetection.detectChanges();
    }

    /**
     * Callback for select option from dropdown
     *
     * @param {*} option
     * @memberof SelectMultipleFieldsComponent
     */
    public selectOption(option: any): void {
        if (this.lastSearchString?.length) {
            this.searchFormControl.setValue("");
        }
        if (this.keepMenuOpenAfterSelect) {
            this.handleItemSelected();
        }
        const selectOptionValue = option?.option?.value?.label;
        this.writeValue([...this.value, option?.option?.value?.value]);
        if (selectOptionValue && !this.chipList.includes(this.chipPrefix + selectOptionValue)) {
            this.chipList.push(this.chipPrefix + selectOptionValue);
            this.emitList();
        }
    }

    /**
     * Callback for remove option from chip
     *
     * @param {number} index
     * @memberof SelectMultipleFieldsComponent
     */
    public removeOption(index: number): void {
        if (index >= 0) {
            this.chipList.splice(index, 1);
            this.value.splice(index, 1);
            this.writeValue(this.value);
            // Close the autocomplete dropdown if it's open
            setTimeout(() => {
                if (this.trigger && this.trigger.panelOpen) {
                    this.closePanel();
                }
            }, 100);  // Delay slightly to allow for view update
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
     * Emits list of selected chips
     *
     * @private
     * @memberof SelectMultipleFieldsComponent
     */
    private emitList(): void {
        this.selectedOption.emit(this.chipList);
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
        // this.trigger?.closePanel();
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
     * Reopen dropdown after option selected
     *
     * @private
     * @memberof SelectMultipleFieldsComponent
     */
    private handleItemSelected(): void {
        setTimeout(() => {
            this.trigger.openPanel();
        }, 50);
    }
}
