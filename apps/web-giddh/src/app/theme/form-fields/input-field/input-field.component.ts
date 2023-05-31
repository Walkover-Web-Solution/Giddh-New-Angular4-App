import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges, ViewChild } from "@angular/core";
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
export class InputFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @ViewChild('textField', { static: false }) public textField: ElementRef;
    @Input() public pattern: any = null;
    @Input() public required: boolean = false;
    @Input() public min: number = null;
    @Input() public max: number = null;
    @Input() public allowDecimalDigitsOnly: boolean = false;
    @Input() public allowDigitsOnly: boolean = false;
    @Input() public cssClass: string = "";
    @Input() public cssStyle: string = "";
    /** Taking placeholder as input */
    @Input() public placeholder: any = "";
    /** Taking name as input */
    @Input() public name: any = "";
    /** Taking id as input */
    @Input() public id: any = "";
    @Input() public maxlength: number;
    @Input() public readonly: boolean;
    @Input() public type: string = "text";
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
    @Input() public customDecimalPlaces: any;
    /** ngModel of input */
    public ngModel: any;
    /** Used for change detection */
    public stateChanges = new Subject<void>();
    /** Placeholders for the callbacks which are later provided by the Control Value Accessor */
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    /** True if field is autocomplete */
    @Input() public autocomplete: string;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private elementRef: ElementRef<HTMLElement>,
        private changeDetectionRef: ChangeDetectorRef
    ) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /**
     * On Component Init
     *
     * @memberof TextFieldComponent
     */
    public ngOnInit(): void {

    }

    /**
     * On Change of input properties
     *
     * @memberof TextFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.autoFocus) {
            setTimeout(() => {
                this.textField?.nativeElement?.focus();
            }, 20);
        }
    }

    /**
     * Releases the memory on component destroy
     *
     * @memberof TextFieldComponent
     */
    public ngOnDestroy() {
        this.stateChanges.complete();
    }

    //////// ControlValueAccessor //////////

    /**
     * This is used to get the inner value of datepicker
     *
     * @type {*}
     * @memberof TextFieldComponent
     */
    get value(): any {
        return this.ngModel;
    };

    /**
     * set accessor including call the onchange callback
     *
     * @memberof TextFieldComponent
     */
    set value(value: any) {
        this.ngModel = value;
        this.onChangeCallback(value);
        this.onTouchedCallback();
        this.stateChanges.next();
    }

    /**
     * Used to Set touched on blur
     *
     * @memberof TextFieldComponent
     */
    public onBlur(): void {
        this.onTouchedCallback();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} value
     * @memberof TextFieldComponent
     */
    public writeValue(value: any): void {
        this.value = value;
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof TextFieldComponent
     */
    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    /**
     * Form ControlValueAccessor interface
     *
     * @param {*} fn
     * @memberof TextFieldComponent
     */
    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    /**
     * This method is used by the <mat-form-field> to set element ids that should be used for the aria-describedby attribute of your control
     *
     * @param {string[]} ids
     * @memberof TextFieldComponent
     */
    public setDescribedByIds(ids: string[]): void {
        const controlElement = this.elementRef.nativeElement.querySelector(".text-field-container")!;
        controlElement.setAttribute("aria-describedby", ids.join(" "));
    }

    /**
     * Callback for handing input data
     *
     * @memberof TextFieldComponent
     */
    public handleInput(): void {
        this.onChangeCallback(this.value);
    }

    public handleChange(): void {
        this.onChangeCallback(this.value);
    }
}
