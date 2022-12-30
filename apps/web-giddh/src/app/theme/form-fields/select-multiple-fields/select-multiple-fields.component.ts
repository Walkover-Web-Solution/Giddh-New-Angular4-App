import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EMAIL_VALIDATION_REGEX, MOBILE_REGEX_PATTERN } from "../../../app.constant";
import { cloneDeep } from "../../../lodash-optimized";
import { IOption } from "../../ng-virtual-select/sh-options.interface";

@Component({
    selector: "select-multiple-fields",
    templateUrl: "./select-multiple-fields.component.html",
    styleUrls: ["./select-multiple-fields.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    /** List of validations */
    @Input() public validations: any[] = [];
    /** CSS class name to add on the field */
    @Input() public showError: boolean = false;
    /** Name of search field */
    @Input() public name: any = "";
    /** Callback for option selected */
    @Output() public selectedOption: EventEmitter<any> = new EventEmitter<any>();
    /** List of chips based on selected values */
    public chipList: any[] = [];
    /** Search field form control */
    public searchFormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: IOption[] = [];
    /** Emit with seperate code for chiplist */
    public separatorKeysCodes: number[] = [ENTER];
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to allow adding of new chips */
    private allowAddChip: boolean = true;

    constructor(
        private changeDetection: ChangeDetectorRef
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof SelectMultipleFieldsComponent
     */
    public ngOnInit(): void {
        this.searchFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterOptions(search);
        });
    }

    /**
     * Detects the changed values and updates it on UI
     *
     * @param {SimpleChanges} changes
     * @memberof SelectMultipleFieldsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            this.fieldFilteredOptions = cloneDeep(changes.options.currentValue);
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
                filteredOptions.push({ label: option.label, value: option.value, additional: option });
            }
        });

        this.fieldFilteredOptions = filteredOptions;
        this.changeDetection.detectChanges();
    }

    /**
     * Callback for select option from dropdown
     *
     * @param {*} option
     * @memberof SelectMultipleFieldsComponent
     */
    public selectOption(option: any): void {
        console.log(option);

        this.allowAddChip = false;
        const selectOptionValue = option?.option?.value?.value;
        if (selectOptionValue && !this.chipList.includes(selectOptionValue)) {
            this.chipList.push(selectOptionValue);
            this.emitList();
        }

        setTimeout(() => {
            this.allowAddChip = true;
        }, 300);
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
            this.emitList();
        }
    }

    /**
     * Callback for add chip
     *
     * @param {*} event
     * @memberof SelectMultipleFieldsComponent
     */
    public addChip(event: MatChipInputEvent): void {
        console.log(event);

        const input = event?.input;
        if (this.allowAddChip) {
            const value = (event?.value || '')?.trim();
            if (value && (!this.validations?.length || (this.validations?.includes("email") && this.validateEmail(value)) || (this.validations?.includes("mobile") && this.validateMobile(value))) && !this.chipList.includes(value)) {
                console.log(value);

                this.chipList?.push(value);
            }
            this.emitList();
        }
        if (input) {
            input.value = '';
            this.filterOptions("");
        }
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
        console.log(this.chipList);

        this.selectedOption.emit(this.chipList);
        this.changeDetection.detectChanges();
    }
}
