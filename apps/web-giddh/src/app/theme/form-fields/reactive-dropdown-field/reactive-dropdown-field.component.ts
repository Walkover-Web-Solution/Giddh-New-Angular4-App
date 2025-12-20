import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, forwardRef } from "@angular/core";
import { BehaviorSubject, Observable, Subject, debounceTime, of, skip, Subscription, ReplaySubject, takeUntil } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { IOption } from "../../../app.constant";
import { isEqual } from "../../../lodash-optimized";

@Component({
    selector: "reactive-dropdown-field",
    templateUrl: "./reactive-dropdown-field.component.html",
    styleUrls: ["./reactive-dropdown-field.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReactiveDropdownFieldComponent),
            multi: true
        }
    ]
})
export class ReactiveDropdownFieldComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges, OnDestroy {
    /** Holds template of options on the component itself */
    @ContentChild('optionTemplate', { static: false }) public optionTemplate: TemplateRef<any>;
    /** Trigger instance for auto complete */
    @ViewChild('trigger', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    /** Select Field instance for auto focus */
    @ViewChild('selectField', { static: false }) public selectField: ElementRef;
    /** CSS class name to add on the field */
    @Input() public cssClass: string = "";
    /** CSS class name to add on the mat autocomplete panel class */
    @Input() public customPanelClass: string = "";
    /** Placeholder of search field */
    @Input() public placeholder: any = "";
    /** List of data */
    @Input() public options: any;
    /** Name of search field */
    @Input() public name: any = "";
    /** True if field is readonly */
    @Input() public readonly: boolean;
    /** True if field is disabled */
    @Input() public disabled: boolean;
    /** True if field is autocomplete */
    @Input() public autocomplete: string = 'off';
    /** True if field is required */
    @Input() public required: boolean = false;
    /** This will open the dropdown if true */
    @Input() public openDropdown: boolean = false;
    /** Holds appearance of dropdown field */
    @Input() public appearance: 'legacy' | 'outline' | 'fill' = 'outline';
    /** Holds text to show to create new data */
    @Input() public createNewText: any = "";
    /** True when pagination should be enabled */
    @Input() public isPaginationEnabled: boolean;
    /** True if the component should be used as dynamic search component instead of static search */
    @Input() public enableDynamicSearch: boolean;
    /** True if we need to show value also with label */
    @Input() public showValueInLabel: boolean = false;
    /** True if we need to show create new label */
    @Input() public showCreateNew: boolean = false;
    /** Holds Mat Input Label */
    @Input() public label: string;
    /** Adds red border around field if true */
    @Input() public showError: boolean = false;
    /** Holds label of value */
    @Input() public labelValue: string = '';
    /** Holds label of value to show in the field */
    public controlLabelValue: string = this.labelValue;
    /** Close autocomplete on focus out if true - Need to set closeOnFocusOut = true if parent element contains event stop propogation on click */
    @Input() public closeOnFocusOut: boolean = false;
    /** If we need to clear form control on force clear */
    @Input() public forceClear: boolean = false;
    /** Show or Hide Label */
    @Input() public showLabel: boolean = true;
    /** Keyboard command label */
    @Input() public showKeyboardCommand: string = '';
    /** Show divider line below options */
    @Input() public showOptionDivider: boolean = false;
    /** Show Mat Label In with appearance outline Icon */
    @Input() public showMatLabel: boolean = true;
    /** True if we need to allow custom dropdown value */
    @Input() public allowCustomDropdownValue: boolean = false;
    /** No results found message */
    @Input() public noResultsFoundMessage: string = "";
    /** Show Caret Icon */
    @Input() public showCaretIcon: boolean = true;
    /** Show Cross Icon to clear selection */
    @Input() public showClearIcon: boolean = false;
    /** Use custom label value */
    @Input() public useCustomLabelValue: boolean = false;
    /** Show dropdown list in sidebar */
    @Input() public sidebarListView: boolean = false;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** Emits dynamic searched query */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter();
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Callback for clear selected value */
    @Output() public onClear: EventEmitter<any> = new EventEmitter<any>();
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
    /** Holds value */
    public value: any = '';
    /** Holds global translations */
    public commonLocaleData: any = {};
    /** Search field form control */
    public searchFormControl = new BehaviorSubject<any>('');
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions$: Observable<IOption[]>;
    /** Flag to track if component is destroyed */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Flag to track if component is destroyed */
    private isDestroyed: boolean = false;
    /** Function to be called when the control value changes */
    private onChange: (value: any) => void = () => { };
    /** Function to be called when the control is touched */
    private onTouched: () => void = () => { };
    /** Next observable */
    private next$: Subject<any> = new Subject();

    constructor(
        private changeDetection: ChangeDetectorRef
    ) { }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngOnInit(): void {
        if (this.enableDynamicSearch) {
            this.searchFormControl.pipe(
                debounceTime(700), 
                skip(1), 
                takeUntil(this.destroyed$)
            ).subscribe((search: string) => {
                this.dynamicSearchedQuery.emit(search);
                if (!search) {
                    this.clearDropdownValue();
                    this.writeValue("", false);
                }
            });
        } else {
            this.searchFormControl.pipe(
                debounceTime(700), 
                skip(1), 
                takeUntil(this.destroyed$)
            ).subscribe((search: string) => {
                if (!search) {
                    this.clearDropdownValue();
                    this.writeValue("", false);
                }
                this.fieldFilteredOptions$ = this.filterOptions(String(search));
                this.changeDetection.detectChanges();
            });
        }
    }

    /**
     * Lifecycle hook for component after view initialization
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.openDropdown) {
                this.openDropdownPanel();
            }
        }, 500);
    }

    /**
     * Filters option values
     *
     * @private
     * @param {string} search
     * @return {*}  {*}
     * @memberof ReactiveDropdownFieldComponent
     */
    private filterOptions(search: string): any {
        let filteredOptions = [];
        this.options?.forEach(option => {
            if (typeof search !== "string" || (typeof option?.label === "string" && option.label.toLowerCase().indexOf(search.toLowerCase()) > -1)) {
                filteredOptions.push({ label: option.label, value: option.value, additional: option.additional ?? option });
            }
        });
        if (filteredOptions.length === 0) {
            this.writeValue(this.value || "", false);
        }
        return of(filteredOptions);
    }

    /**
     * Lifecycle hook for input changes
     *
     * @param {SimpleChanges} changes
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            this.fieldFilteredOptions$ = of(this.options);
            // Always try to set label value when options change, regardless of previous value
            if (changes?.options) {
                // Use setTimeout to ensure the value is properly set before trying to find the label
                setTimeout(() => {
                    this.setLabelValue(null);
                }, 0);
            }
        }
        if (changes?.forceClear && !changes.forceClear.firstChange && changes.forceClear.currentValue !== changes.forceClear.previousValue) {
           this.handleForceClear();
        }
        if (changes?.openDropdown?.currentValue && !changes?.openDropdown?.previousValue && changes.openDropdown.currentValue !== changes.openDropdown.previousValue) {
            this.openDropdownPanel();
        }

        if (changes?.labelValue) {
            this.labelValue = changes.labelValue.currentValue;
            this.controlLabelValue = this.labelValue;
        }

        if (changes?.labelValue?.currentValue === null) {
            this.labelValue = "";
            this.controlLabelValue = "";
        }
    }

    /**
     * Handle force clear and reset dropdown list
     * 
     * @private
     * @memberof ReactiveDropdownFieldComponent
     */
    private handleForceClear(): void {
         this.writeValue("", false);
        this.controlLabelValue = "";
        this.clearDropdownValue();
        this.fieldFilteredOptions$ = of([]);
        setTimeout(() => {
            this.fieldFilteredOptions$ = of(this.options);
        }, 100);
    }

    /**
     * Common method to handle dropdown panel operations with error handling
     *
     * @private
     * @param {'open' | 'close'} operation - The operation to perform on the panel
     * @memberof ReactiveDropdownFieldComponent
     */
    private handleDropdownPanelOperation(operation: 'open' | 'close'): void {
        if (!this.isDestroyed && this.trigger) {
            try {
                if (operation === 'open') {
                    this.trigger.openPanel();
                } else {
                    this.trigger.closePanel();
                }
            } catch (error) {
                console.warn(`Could not ${operation} dropdown panel:`, error);
            }
        }
    }

    /**
     * This will use for close dropdown panel
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public closeDropdownPanel(): void {
        this.handleDropdownPanelOperation('close');
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngOnDestroy(): void {
        // Set destroyed flag first
        this.isDestroyed = true;
        
        // Only complete the subject if it hasn't been completed already
        if (!this.destroyed$.closed) {
            this.destroyed$.next(true);
            this.destroyed$.complete();
        }
    }

    /**
     * Callback for onscroll in dropdown
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public onScroll(): void {
        this.next$.next(true);
        this.scrollEnd.emit();
    }

    /**
     * Displays label after mat option selection
     *
     * @param {*} option
     * @return {*}  {string}
     * @memberof ReactiveDropdownFieldComponent
     */
    public displayWith(option: any): string {
        return option?.label || '';
    }

    /**
     * Display function for mat-autocomplete displayWith
     *
     * @param {*} option
     * @return {*}  {string}
     * @memberof ReactiveDropdownFieldComponent
     */
    public displayLabel(option: any): string {
        return option?.label || '';
    }

    /**
     * Write value to the component (ControlValueAccessor implementation)
     *
     * @param {*} value
     * @param {boolean} [setLabelValue=true] - Whether to set the label value
     * @memberof ReactiveDropdownFieldComponent
     */
    public writeValue(value: any, setLabelValue: boolean = true): void {
        if (value !== undefined && value !== null) {
            this.value = value;
        } else {
            this.value = '';
        }
        if (setLabelValue) {
            this.setLabelValue(null);
        }
        this.onChange(value);
    }

    /**
     * Handles option selection from autocomplete
     *
     * @param {*} event
     * @memberof ReactiveDropdownFieldComponent
     */
    public optionSelected(event: any): void {
        this.writeValue(event?.option?.value?.value, false);
        this.setLabelValue(event?.option?.value);
        this.onTouched();
        this.selectedOption.emit(event?.option?.value);
    }

    /**
     * On change method
     *
     * @param {*} fn
     * @memberof ReactiveDropdownFieldComponent
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * On touch method
     *
     * @param {*} fn
     * @memberof ReactiveDropdownFieldComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Emits true if create new option is selected
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public createNewRecord(): void {
        this.closeDropdownPanel();
        this.createOption.emit(true);
    }

    /**
     * Handles create new option selection change event
     *
     * @param {any} event - Selection change event from mat-option
     * @memberof ReactiveDropdownFieldComponent
     */
    public handleCreateNewSelection(event: any): void {
        if (event.isUserInput && event.source.selected) {
            this.createNewRecord();
        }
    }

    /**
     * Handles Alt+N keyboard shortcut for create new functionality
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof ReactiveDropdownFieldComponent
     */
    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        // Early exit if create new is not enabled
        if (!this.showCreateNew) return;

        // Check for Alt+Shift+N combination (cross-platform)
        const isAltShiftN = event.altKey && event.shiftKey && event.code === 'KeyN';
        
        // Check if dropdown is focused or open
        const isFocused = this.selectField?.nativeElement === document.activeElement || this.trigger?.panelOpen;

        if (isAltShiftN && isFocused) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            this.createNewRecord();
        }
    }

    

    /**
     * This will use for open dropdown panel
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public openDropdownPanel(): void {
        if (this.isDestroyed) {
            return;
        }
        
        this.selectField?.nativeElement?.focus();
        setTimeout(() => {
            this.handleDropdownPanelOperation('open');
        }, 10);
    }

    /**
     * Set value of Label from options using control value
     *
     * @private
     * @memberof ReactiveDropdownFieldComponent
     */
    private setLabelValue(event: any): void {
        // Check if we have options and a current value
        if (this.options && this.options.length > 0) {
            if (event) {
                const currentValue = event?.value;
                if (currentValue !== null && currentValue !== '') {
                    this.controlLabelValue = (this.optionTemplate || this.useCustomLabelValue || this.labelValue) ? this.labelValue : (event?.label || '');
                    this.changeDetection.detectChanges();
                } else if (currentValue === "") {
                    this.controlLabelValue = "";
                }
            } else if (this.value) {
                this.controlLabelValue = (this.optionTemplate || this.useCustomLabelValue || this.labelValue) ? this.labelValue : (this.options?.find(option => isEqual(option?.value, this.value))?.label || (this.value instanceof String ? this.value : ""));
                this.changeDetection.detectChanges();
            } else {
                this.controlLabelValue = this.labelValue || "";
            }
        } else {
            this.controlLabelValue = this.labelValue || "";
        }
    }

    /**
     * Handle mat autocomplete panel opened
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public panelOpened(): void {
        if (!this.enableDynamicSearch) {
            this.fieldFilteredOptions$ = this.filterOptions("");
        }
    }

    /**
     * Emits on clear event
     *
     * @param {*} [value={ label: "", value: "" }]
     * @memberof ReactiveDropdownFieldComponent
     */
    public clearDropdownValue(value: any = { label: "", value: "" }): void {
        this.onClear.emit(value);
    }

    /**
     * Callback event on blur
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public onBlur(): void {
        setTimeout(() => {
            if (this.allowCustomDropdownValue && !this.searchFormControl?.value && !this.controlLabelValue) {
                this.selectedOption.emit({ label: '', value: '' });
            }
            
            if (this.allowCustomDropdownValue && this.searchFormControl?.value && typeof this.searchFormControl?.value !== "object") {
                this.value = this.searchFormControl?.value;
                this.selectedOption.emit({ label: this.value, value: this.value });
            }
            this.closeDropdownPanel();
        }, 200);
    }

    /**
     * Callback for translation complete
     *
     * @param event
     * @memberof ReactiveDropdownFieldComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            if (this.showCreateNew && this.createNewText === '') {
                this.createNewText = this.commonLocaleData?.app_create_new;
            }
            if (this.showCreateNew && this.showKeyboardCommand === '') {
                this.showKeyboardCommand = this.commonLocaleData?.app_alt_shift_n;
            }
        }
    }
}