import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * A reusable eye-icon button that toggles a password field between masked and visible text.
 * Purely presentational: the caller owns the visibility state and the input's `type` binding,
 * this component only renders the button and reports activation.
 */
@Component({
    selector: 'password-visibility-toggle',
    templateUrl: './password-visibility-toggle.component.html',
    styleUrls: ['./password-visibility-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordVisibilityToggleComponent {
    /** Whether the associated password field is currently showing plain text */
    readonly visible = input<boolean>(false);

    /** Emits when the user activates the toggle (click or keyboard) */
    readonly toggled = output<void>();

    /**
     * Handles button activation
     */
    protected onToggle(): void {
        this.toggled.emit();
    }
}
