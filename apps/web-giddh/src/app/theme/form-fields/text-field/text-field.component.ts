import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

const noop = () => { };

@Component({
    selector: 'text-field',
    styleUrls: ['./text-field.component.scss'],
    templateUrl: './text-field.component.html',
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: TextFieldComponent,
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFieldComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    @Input() public cssClass: string = "";
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
        const controlElement = this.elementRef.nativeElement.querySelector('.text-field-container')!;
        controlElement.setAttribute('aria-describedby', ids.join(' '));
    }

    /**
     * Callback for handing input data
     *
     * @memberof TextFieldComponent
     */
    public handleInput(): void {
        this.onChangeCallback(this.value);
    }
}