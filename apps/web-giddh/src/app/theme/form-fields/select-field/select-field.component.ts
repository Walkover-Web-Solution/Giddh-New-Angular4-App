import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, FormControl, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cloneDeep } from "../../../lodash-optimized";
import { IOption } from "../../ng-virtual-select/sh-options.interface";

const noop = () => {
};

@Component({
    selector: "select-field",
    styleUrls: ["./select-field.component.scss"],
    templateUrl: "./select-field.component.html",
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: SelectFieldComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @Input() public placeholder: any = "";
    @Input() public options: any;
    /** Taking name as input */
    @Input() public name: any = "";
    @Output() public optionSelected: EventEmitter<any> = new EventEmitter<any>();

    /** ngModel of input */
    public ngModel: any;
    public searchFormControl: Subject<any> = new Subject();
    public fieldOptions: IOption[] = [];
    public fieldFilteredOptions: IOption[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Used for change detection */
    public stateChanges = new Subject<void>();
    /** Placeholders for the callbacks which are later provided by the Control Value Accessor */
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private elementRef: ElementRef<HTMLElement>,
        private changeDetectionRef: ChangeDetectorRef
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    public ngOnInit(): void {
        this.searchFormControl.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterOptions(search);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.options) {
            this.fieldFilteredOptions = cloneDeep(this.options);
        }
    }

    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    private filterOptions(search: string): void {
        let filteredOptions: IOption[] = [];
        this.options.forEach(option => {
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option.value, additional: option });
            }
        });

        this.fieldFilteredOptions = filteredOptions;
    }

    public displayLabel(option: any): string {
        return option?.label;
    }

    public resetValueIfOptionNotSelected(): void {
        setTimeout(() => {

        }, 200);
    }

    private checkAndResetValue(formControl: FormControl, value: any): void {
        if (typeof formControl?.value !== "object" && formControl?.value !== value) {
            formControl.setValue({ label: value });
        }
    }

    //////// ControlValueAccessor //////////

    /**
     * This is used to get the inner value of datepicker
     *
     * @type {*}
     * @memberof SelectFieldComponent
     */
    get value(): any {
        return this.ngModel;
    };

    /**
     * set accessor including call the onchange callback
     *
     * @memberof SelectFieldComponent
     */
    set value(value: any) {
        this.ngModel = value?.value;
        this.onChangeCallback(value);
        this.onTouchedCallback();
        this.stateChanges.next();
    }

    /**
     * Used to Set touched on blur
     *
     * @memberof SelectFieldComponent
     */
    public onBlur(): void {
        this.onTouchedCallback();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} value
     * @memberof SelectFieldComponent
     */
    public writeValue(value: any): void {
        this.value = value;
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof SelectFieldComponent
     */
    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof SelectFieldComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    /**
     * This method is used by the <mat-form-field> to set element ids that should be used for the aria-describedby attribute of your control
     *
     * @param {string[]} ids
     * @memberof SelectFieldComponent
     */
    public setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector(".select-field-container")!;
        controlElement.setAttribute("aria-describedby", ids.join(" "));
    }

    public handleChange(event: any): void {
        this.optionSelected.emit(event?.option?.value);
    }
}
