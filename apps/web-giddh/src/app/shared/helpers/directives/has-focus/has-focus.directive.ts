import { Directive, HostBinding, HostListener } from "@angular/core";

/**
 * Directive which provides the status if the host element has focus
 *
 * @export
 * @class HasFocusDirective
 */
@Directive({
    selector: '[hasFocus]',
    exportAs: 'hasFocus',
    standalone: false
})
/**
 * HasFocusDirective directive
 * Implements HasFocusDirective functionality
 */
export class HasFocusDirective {
    /** True, if the host element has focus. Adds the class 'has-focus' on the host element */
    @HostBinding('class.has-focus') isFocused: boolean;

    @HostListener('focus')
    /**
     * Handles focus event
     */
    public onFocus(): void {
        this.isFocused = true;
    }

    @HostListener('blur')
    /**
     * Handles blur event
     */
    public onBlur(): void {
        this.isFocused = false;
    }
}
