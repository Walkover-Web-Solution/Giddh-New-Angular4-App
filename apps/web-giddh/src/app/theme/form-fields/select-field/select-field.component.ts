import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { cloneDeep } from "../../../lodash-optimized";
import { IOption } from "../../ng-virtual-select/sh-options.interface";

@Component({
    selector: "select-field",
    styleUrls: ["./select-field.component.scss"],
    templateUrl: "./select-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    /** Holds template of options on the component itself */
    @ContentChild('optionTemplate', { static: false }) public optionTemplate: TemplateRef<any>;
    /** Trigger instance for auto complete */
    @ViewChild('trigger', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    /** Select Field instance for auto focus */
    @ViewChild('selectField', { static: true }) public selectField: ElementRef;
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
    @Input() public autocomplete: boolean;
    /** Default value to prefill */
    @Input() public defaultValue: any = "";
    /** True if field is required */
    @Input() public required: boolean = false;
    /** This will open the dropdown if true */
    @Input() public openDropdown: boolean;
    /** Holds text to show to create new data */
    @Input() public createNewText: any = "";
    /** True when pagination should be enabled */
    @Input() public isPaginationEnabled: boolean;
    /** True if the compoonent should be used as dynamic search component instead of static search */
    @Input() public enableDynamicSearch: boolean;
    /** True if selected value can be reset */
    @Input() public allowValueReset: boolean = false;
    /** True if we need to show value also with label */
    @Input() public showValueInLabel: boolean = false;
    /** True if we need to show create new label */
    @Input() public showCreateNew: boolean = false;
    /** True if we need to show create new label */
    @Input() public tagMultipleSelect: boolean = false;
    /** Holds text to show to create new data */
    @Input() public createNewOptionsText: any = "";
    /** True if we need to show more value also with label */
    @Input() public hasMoreValue: boolean = false;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** Emits dynamic searched query */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter();
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Callback for clear selected value */
    @Output() public onClear: EventEmitter<any> = new EventEmitter<any>();
    /** Search field form control */
    public searchFormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: IOption[] = [];
    /** Selected value from option list */
    public selectedValue: any = '';
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public chipSelectedRecords: IOption[] = [];

    constructor(private cdr: ChangeDetectorRef
    ) {
    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof SelectFieldComponent
     */
    public ngOnInit(): void {
        if (this.enableDynamicSearch) {
            this.searchFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
                if (search) {
                    if (typeof search === "string") {
                        this.dynamicSearchedQuery.emit(search);
                    } else {
                        this.dynamicSearchedQuery.emit(search?.label || "");
                    }
                } else {
                    if (this.allowValueReset) {
                        this.selectedValue = "";
                        this.searchFormControl.setValue({ label: "" });
                        this.onClear.emit({ label: "", value: "" });
                    } else {
                        this.dynamicSearchedQuery.emit(search);
                    }
                }
            });
        } else {
            this.searchFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
                if (search) {
                    this.filterOptions(search);
                } else {
                    if (this.allowValueReset) {
                        this.selectedValue = "";
                        this.searchFormControl.setValue({ label: "" });
                        this.onClear.emit({ label: "", value: "" });
                    } else {
                        this.filterOptions(search);
                    }
                }
            });
        }

    }

    /**
     * Lifecycle hook which detects any changes in values
     *
     * @param {SimpleChanges} changes
     * @memberof SelectFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            if (this.selectedValue && !changes.options.currentValue?.length && changes.options.previousValue?.length) {
                this.fieldFilteredOptions = cloneDeep(changes.options.previousValue);
            } else {
                this.fieldFilteredOptions = cloneDeep(changes.options.currentValue);
            }
        }
        if (changes?.defaultValue) {
            this.searchFormControl.setValue({ label: changes?.defaultValue.currentValue });
        }
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.openDropdown) {
                this.openDropdownPanel();
            }
        }, 500);
    }

    /**
     * Lifecycle hook which releases all memory
     *
     * @memberof SelectFieldComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Filters the option based on search
     *
     * @private
     * @param {string} search
     * @memberof SelectFieldComponent
     */
    private filterOptions(search: string): void {
        let filteredOptions: IOption[] = [];
        this.options?.forEach(option => {
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option.value, additional: option });
            }
        });

        this.fieldFilteredOptions = filteredOptions;
    }

    /**
     * Displays the label on selection
     *
     * @param {*} option
     * @returns {string}
     * @memberof SelectFieldComponent
     */
    public displayLabel(option: any): string {
        return option?.label;
    }


    /**
     * Emits the selected option data
     *
     * @param {*} event
     * @memberof SelectFieldComponent
     */
    public optionSelected(event: any): void {
        console.log(event);

        if (this.tagMultipleSelect) {
            this.fieldFilteredOptions.push(event?.option?.value);
            this.searchFormControl.setValue(null);
        }
        this.selectedValue = event?.option?.value?.label;
        this.selectedOption.emit(event?.option?.value);
    }

    /**
     * Emits true if create new option is selected
     *
     * @memberof SelectFieldComponent
     */
    public createNewRecord(): void {
        this.trigger?.closePanel();
        this.createOption.emit(true);
    }

    public addNewRecord(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            // this.fieldFilteredOptions = [...this.fieldFilteredOptions, { label: value, value: value, additional: event }]
            this.fieldFilteredOptions.push({ label: value, value: value, additional: event });
            this.cdr.detectChanges();
        }

        // this.fieldFilteredOptions = this.chipSelectedRecords;
        console.log(value, this.chipSelectedRecords, this.fieldFilteredOptions);
        event.chipInput!.clear();
        this.searchFormControl.setValue(null);
    }

    public removeRecord(option: string): void {
        console.log(option);

        //   const index = this.chipSelectedRecords.indexOf(option);

        // if (index >= 0) {
        //     this.chipSelectedRecords.splice(index, 1);
        // }
    }
    /**
     * This will use for open dropdown panel
     *
     * @memberof SelectFieldComponent
     */
    public openDropdownPanel(): void {
        this.trigger?.openPanel();
        this.selectField?.nativeElement?.focus();
        this.cdr.detectChanges();
    }

    /**
     * Callback event on blur
     *
     * @memberof SelectFieldComponent
     */
    public onBlur(): void {
        setTimeout(() => {
            if (!this.searchFormControl?.value) {
                this.selectedValue = "";
                this.selectedOption.emit({ label: '', value: '' });
            }
        }, 200);
    }

    /**
    * This will use for close dropdown panel
    *
    * @memberof SelectFieldComponent
    */
    public closeDropdownPanel(): void {
        this.trigger?.closePanel();
    }

    /**
     * This will use for add listner for wrapper
     *
     * @param {Function} fun
     * @param {string} event
     * @param {*} [options]
     * @memberof SelectFieldComponent
     */
    public addEventListenerWrapper(fun: Function, event: string, options?: any) {
        document?.addEventListener(event, fun.bind(this), options || {});
    }
    /**
     *This will use for remove listner for wrapper
     *
     * @param {Function} fun
     * @param {string} event
     * @param {*} [options]
     * @memberof SelectFieldComponent
     */
    public removeEventListenerWrapper(fun: Function, event: string, options?: any) {
        document?.removeEventListener(event, fun.bind(this), options || {});
    }

}
