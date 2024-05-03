import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Optional, Output, Self, SimpleChanges, ViewChild } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

const noop = () => {
};

@Component({
    selector: "input-field",
    styleUrls: ["./input-field.component.scss"],
    templateUrl: "./input-field.component.html",
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: InputFieldComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent implements OnChanges, OnDestroy, ControlValueAccessor {
    /** Instance of input field */
    @ViewChild('textField', { static: false }) public textField: ElementRef;
    /** Regex pattern for the input field */
    @Input() public pattern: any = null;
    /** True if field is required */
    @Input() public required: boolean = false;
    /** Minimum value of field */
    @Input() public min: number = null;
    /** Maximum value of field */
    @Input() public max: number = null;
    /** True if need to allow decimal with digits */
    @Input() public allowDecimalDigitsOnly: boolean = false;
    /** True if need to allow only digits */
    @Input() public allowDigitsOnly: boolean = false;
    /** Css classes to be applied on input field */
    @Input() public cssClass: string = "";
    /** Css styles to be applied on input field */
    @Input() public cssStyle: string = "";
    /** Taking placeholder as input */
    @Input() public placeholder: any = "";
    /** Taking name as input */
    @Input() public name: any = "";
    /** Taking id as input */
    @Input() public id: any = "";
    /** Max length of input field */
    @Input() public maxlength: number;
    /** True if field is read only */
    @Input() public readonly: boolean;
    /** True if field is disabled */
    @Input() public disabled: boolean;
    /** Type of input field */
    @Input() public type: string = "text";
    /** Adds red border around field if true */
    @Input() public showError: boolean = false;
    /** It will focus in the text field */
    @Input() public autoFocus: boolean = false;
    /** It will enable mask in the text field */
    @Input() public useMask: boolean = false;
    /** It will show mask in the text field */
    @Input() public mask: any;
    /** It will show prefix in the text field */
    @Input() public prefix: any;
    /** It will show suffix in the text field */
    @Input() public suffix: any;
    /** Holds custom decimal places */
    @Input() public customDecimalPlaces: any;
    /** Holds mat suffic */
    @Input() public matSuffix: any;
    /** Holds mat prefix */
    @Input() public matPrefix: any;
    /** True if field is autocomplete */
    @Input() public autocomplete: string = 'off';
    /** Appearance of mat form field */
    @Input() public appearance: 'legacy' | 'outline' | 'fill' = 'outline';
    /** Label of mat form field */
    @Input() public floatLabel: any = 'auto';
    /** Holds Mat Input Label */
    @Input() public label: string;
    /** Holds Mat Input Value */
    @Input() public defaultValue: any;
    /** Emits on change event */
    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    /** ngModel of input */
    public ngModel: any;
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
        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /**
     * On Change of input properties
     *
     * @memberof InputFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.defaultValue) {
            this.ngModel = this.defaultValue;
        }
        
        if (this.autoFocus) {
            setTimeout(() => {
                this.textField?.nativeElement?.focus();
            }, 20);
        }
    }

    /**
     * Releases the memory on component destroy
     *
     * @memberof InputFieldComponent
     */
    public ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    //////// ControlValueAccessor //////////

    /**
     * This is used to get the inner value of field
     *
     * @type {*}
     * @memberof InputFieldComponent
     */
    get value(): any {
        return this.ngModel;
    };

    /**
     * set accessor including call the onchange callback
     *
     * @memberof InputFieldComponent
     */
    set value(value: any) {
        if (value !== undefined && value !== null) {
            this.ngModel = value;
            this.onChangeCallback(value);
            this.onTouchedCallback();
            this.stateChanges.next();
        }
    }

    /**
     * Used to Set touched on blur
     *
     * @memberof InputFieldComponent
     */
    public onBlur(): void {
        this.onTouchedCallback();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} value
     * @memberof InputFieldComponent
     */
    public writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.value = value;
            this.changeDetectionRef.detectChanges();
        } else {
            this.value = "";
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof InputFieldComponent
     */
    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof InputFieldComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    /**
     * This method is used by the <mat-form-field> to set element ids that should be used for the aria-describedby attribute of your control
     *
     * @param {string[]} ids
     * @memberof InputFieldComponent
     */
    public setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector(".text-field-container")!;
        controlElement.setAttribute("aria-describedby", ids.join(" "));
    }

    /**
     * Callback for handling input data
     *
     * @memberof InputFieldComponent
     */
    public handleInput(): void {
        this.onChangeCallback(this.value);
    }

    /**
     * Callback for handling changed data
     *
     * @memberof InputFieldComponent
     */
    public handleChange(): void {
        this.onChangeCallback(this.value);
    }

    /**
     * Emits blur event
     *
     * @memberof InputFieldComponent
     */
    public emitBlurEvent(): void {
        this.onChange.emit(this.value);
    }
}
