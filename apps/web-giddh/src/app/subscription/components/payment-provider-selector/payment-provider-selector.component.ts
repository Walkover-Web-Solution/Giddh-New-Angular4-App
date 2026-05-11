import { ChangeDetectionStrategy, Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { IOption, PaymentProvider } from '../../../app.constant';

@Component({
    selector: 'payment-provider-selector',
    templateUrl: './payment-provider-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatRadioModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PaymentProviderSelectorComponent),
            multi: true
        }
    ]
})
export class PaymentProviderSelectorComponent implements ControlValueAccessor {
    /** List of payment provider options to display */
    readonly providers = input<IOption[]>([]);
    /** Label text shown above the radio group */
    readonly label = input<string>('Payment Provider');
    /** Whether to show the required asterisk */
    readonly required = input<boolean>(true);
    /** Whether to show the validation error */
    readonly showError = input<boolean>(false);
    /** Error message text */
    readonly errorMessage = input<string>('');
    /** Holds PaymentProvider constant */
    readonly paymentProvider:any = PaymentProvider;

    /** Currently selected provider value as signal for OnPush CD */
    protected readonly value = signal<string | null>(null);
    /** Whether the control is disabled */
    protected disabled: boolean = false;
    /** Emits the selected provider value whenever it changes */
    readonly valueChange = output<string | null>();

    /** @ignore */
    private onChange: (value: string | null) => void = () => {};
    /** @ignore */
    private onTouched: () => void = () => {};

    /**
     * Handles provider radio button change
     *
     * @protected
     * @param {string} val - Selected provider value
     * @memberof PaymentProviderSelectorComponent
     */
    protected onProviderChange(val: string): void {
        this.value.set(val);
        this.onChange(val);
        this.onTouched();
        this.valueChange.emit(val);
    }

    /** @inheritdoc */
    writeValue(val: string | null): void {
        this.value.set(val);
    }

    /** @inheritdoc */
    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }

    /** @inheritdoc */
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /** @inheritdoc */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
