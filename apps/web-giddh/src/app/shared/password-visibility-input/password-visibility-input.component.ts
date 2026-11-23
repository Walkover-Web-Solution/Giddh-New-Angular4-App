import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    signal,
    type InputSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'password-visibility-input',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        '[attr.placeholder]': 'null',
        '[attr.autocomplete]': 'null',
        '[attr.name]': 'null',
        '[attr.minlength]': 'null',
        '[attr.maxlength]': 'null',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PasswordVisibilityInputComponent),
            multi: true,
        },
    ],
    templateUrl: './password-visibility-input.component.html',
    styleUrl: './password-visibility-input.component.scss',
})
export class PasswordVisibilityInputComponent implements ControlValueAccessor {
    readonly placeholder: InputSignal<string> = input('');
    readonly autocomplete: InputSignal<string | undefined> = input<string | undefined>(undefined);
    readonly inputClass: InputSignal<string> = input('form-control');
    readonly name: InputSignal<string | undefined> = input<string | undefined>(undefined);
    readonly minLength: InputSignal<number | undefined> = input<number | undefined>(undefined);
    readonly maxLength: InputSignal<number | undefined> = input<number | undefined>(undefined);
    readonly inputId: InputSignal<string | undefined> = input<string | undefined>(undefined);

    protected readonly masked = signal(true);
    protected readonly disabled = signal(false);
    protected readonly value = signal('');

    private onChange: (value: string) => void = () => undefined;
    private onTouched: () => void = () => undefined;

    writeValue(value: string | null): void {
        this.value.set(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    protected onInput(event: Event): void {
        const next = (event.target as HTMLInputElement).value;
        this.value.set(next);
        this.onChange(next);
    }

    protected handleBlur(): void {
        this.onTouched();
    }

    protected toggleVisibility(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.masked.update((current) => !current);
    }

    protected visibilityLabel(): string {
        return this.masked() ? 'Show password' : 'Hide password';
    }
}