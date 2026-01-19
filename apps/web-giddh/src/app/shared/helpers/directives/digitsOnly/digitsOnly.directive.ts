import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[digitsOnlyDirective]',
    standalone: false
})
/**
 * DigitsOnlyDirective directive
 * Implements DigitsOnlyDirective functionality
 */
export class DigitsOnlyDirective {
    public el: HTMLInputElement;

    // tslint:disable-next-line:member-ordering
    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
    }

    @HostListener('keyup', ['$event'])
    /**
     * Handles change event
     */
    public onChange(el: any) {
        /**
         * Handles if functionality
         */
        if (el.shiftKey || el.ctrlKey || (el.which >= 37 && el.which <= 40)) {
            return;
        }
        this.renderer.setProperty(this.el, 'value', ((this.el && this.el?.value) ? this.el?.value?.replace(/[^0-9]/g, '') : ''));
    }

}
