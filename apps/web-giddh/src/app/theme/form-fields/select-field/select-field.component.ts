import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
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
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
    /** Search field form control */
    public searchFormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: IOption[] = [];
    /** Selected value from option list */
    public selectedValue: any = '';
    /** This will open the dropdown if true */
    @Input() public openDropdown: boolean;
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
    ) {
    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof SelectFieldComponent
     */
    public ngOnInit(): void {
        this.searchFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterOptions(search);
        });
    }

    /**
     * Lifecycle hook which detects any changes in values
     *
     * @param {SimpleChanges} changes
     * @memberof SelectFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            this.fieldFilteredOptions = cloneDeep(this.options);
        }

        if (changes?.defaultValue) {
            this.searchFormControl.setValue({ label: changes?.defaultValue.currentValue });
        }

        if (changes?.openDropdown?.currentValue) {
            setTimeout(() => {
                this.trigger.openPanel();
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
                this.searchFormControl.setValue({ label: this.selectedValue });
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
}
