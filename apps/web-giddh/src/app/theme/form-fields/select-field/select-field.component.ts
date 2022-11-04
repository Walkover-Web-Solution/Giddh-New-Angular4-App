import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
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
export class SelectFieldComponent implements OnInit, OnChanges, OnDestroy {
    /** Trigger instance for auto complete */
    @ViewChild('trigger', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    /** CSS class name to add on the field */
    @Input() public cssClass: string = "";
    /** Placeholder of search field */
    @Input() public placeholder: any = "";
    /** List of data */
    @Input() public options: any;
    /** Name of search field */
    @Input() public name: any = "";
    /** True if field is readonly */
    @Input() public readonly: boolean;
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

    constructor(
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

        if (changes?.openDropdown) {
            setTimeout(() => {
                if (changes?.openDropdown?.currentValue) {
                    this.trigger.openPanel();
                } else {
                    this.trigger.closePanel();
                }
            }, 20);
        }
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
        this.options.forEach(option => {
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
     * Resets the selected value if option not selected after new search
     *
     * @memberof SelectFieldComponent
     */
    public resetValueIfOptionNotSelected(): void {
        setTimeout(() => {
            if (typeof this.searchFormControl?.value !== "object" && this.searchFormControl?.value !== this.selectedValue) {
                if (this.allowValueReset) {
                    this.selectedValue = "";
                    this.searchFormControl.setValue({ label: "" });
                    this.onClear.emit({ label: "", value: "" });
                } else {
                    this.searchFormControl.setValue({ label: this.selectedValue });
                }
            }
        }, 200);
    }

    /**
     * Emits the selected option data
     *
     * @param {*} event
     * @memberof SelectFieldComponent
     */
    public optionSelected(event: any): void {
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
}
