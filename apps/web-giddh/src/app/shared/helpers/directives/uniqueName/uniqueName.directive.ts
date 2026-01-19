import { Directive, ElementRef, HostListener } from '@angular/core';
import { ToasterService } from '../../../../services/toaster.service';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[UniqueNameDirective]',
    standalone: false
})
/**
 * UniqueNameDirective directive
 * Implements UniqueNameDirective functionality
 */
export class UniqueNameDirective {
    public el: HTMLInputElement;

    // tslint:disable-next-line:member-ordering
    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
        this.el = this.elementRef.nativeElement;
    }

    @HostListener('keypress', ['$event'])
    /**
     * Handles keypress event
     */
    public onKeyPress(event: KeyboardEvent) {
        /**
         * Handles if functionality
         */
        if (event.which === 32) {
            event.preventDefault();
            this._toaster.clearAllToaster();
            this._toaster.warningToast('Space not allowed', 'Warning');
        } else {
            /**
             * Handles if functionality
             */
            if (/[\\/(){};:"<>#?%,]/g.test(event.key)) {
                event.preventDefault();
            }
        }
    }

    @HostListener('input', ['$event'])
    /**
     * Handles input event
     */
    public onInput(event: any) {
        this.el.value = this.el?.value?.toLowerCase();
    }

}
