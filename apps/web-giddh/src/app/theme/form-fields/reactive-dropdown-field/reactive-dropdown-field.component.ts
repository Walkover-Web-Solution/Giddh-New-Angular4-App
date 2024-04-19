import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, forwardRef } from "@angular/core";
import { IOption } from "../../ng-virtual-select/sh-options.interface";
import { BehaviorSubject, Observable, ReplaySubject, Subject, debounceTime, of, skip, takeUntil } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";

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
    /** True if the compoonent should be used as dynamic search component instead of static search */
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
    @Input() public labelValue: any = '';
    /** Close autocomplete on focus out if true - Need to set closeOnFocusOut = true if parent element contains event stop propogation on click */
    @Input() public closeOnFocusOut: boolean = false;
    /** Show or Hide Label */
    @Input() public showLabel: boolean = true;
    /** Keyboard command label */
    @Input() public showKeyboardCommand: string = '';
    /** Show divider line below options */
    @Input() public showOptionDivider: boolean = false;
    /** Show Mat Label In with appearance outline Icon */
    @Input() public showMatLabelWithLabledField: boolean = true;
    /** Show Caret Icon */
    @Input() public showCaretIcon: boolean = true;
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
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Function to be called when the control value changes */
    private onChange: (value: any) => void = () => { };
    /** Function to be called when the control is touched */
    private onTouched: () => void = () => { };
    /** Next observable */
    public next$: Subject<void> = new Subject();

    constructor(

    ) {

    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngOnInit(): void {
        if (this.enableDynamicSearch) {
            this.searchFormControl.pipe(debounceTime(700), skip(1), takeUntil(this.destroyed$)).subscribe(search => {
                this.dynamicSearchedQuery.emit(search);
                if (!search) {
                    this.onClear.emit({ label: "", value: "" });
                }
            });
        } else {
            this.searchFormControl.pipe(debounceTime(700), skip(1), takeUntil(this.destroyed$)).subscribe(search => {
                if (!search) {
                    this.onClear.emit({ label: "", value: "" });
                }
                this.fieldFilteredOptions$ = this.filterOptions(String(search));
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
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option.value, additional: option.additional ?? option });
            }
        });
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
        }

        if (changes.openDropdown?.currentValue && !changes?.openDropdown?.previousValue) {
            this.openDropdownPanel();
        }
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for onscroll in dropdown
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public onScroll(): void {
        this.next$.next();
        this.scrollEnd.emit();
    }

    /**
     * Displays label after mat option selection
     *
     * @param {*} option
     * @return {*}  {string}
     * @memberof ReactiveDropdownFieldComponent
     */
    public displayLabel(option: any): string {
        return option?.label;
    }

    /**
     * Writes value in ng value accessor
     *
     * @param {*} value
     * @memberof ReactiveDropdownFieldComponent
     */
    public writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.value = value;
        } else {
            this.value = '';
        }
        this.onChange(value);
    }

    /**
     * Callback for option selection
     *
     * @param {*} event
     * @memberof ReactiveDropdownFieldComponent
     */
    public optionSelected(event: any): void {
        this.writeValue(event?.option?.value?.value);
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
        this.trigger?.closePanel();
        this.createOption.emit(true);
    }

    /**
     * This will use for open dropdown panel
     *
     * @memberof ReactiveDropdownFieldComponent
     */
    public openDropdownPanel(): void {
        this.trigger?.openPanel();
        setTimeout(() => {
            this.selectField?.nativeElement?.focus();
        }, 10);
    }
}
