import { Directive, HostListener, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[textCaseChangeDirective]',
    standalone: false
})
/**
 * TextCaseChangeDirective directive
 * Implements TextCaseChangeDirective functionality
 */
export class TextCaseChangeDirective {
    @Input() public control: UntypedFormControl;

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }

    @HostListener('document:paste', ['$event'])
    /**
     * Handles Paste functionality
     */
    public Paste(event) {
        /**
         * Handles if functionality
         */
        if ('textcasechangedirective' in event.target.attributes) {
            let cl = event.clipboardData.getData('text/plain');
            cl = cl?.toLowerCase();
            event.target.value = cl;
            /**
             * Handles if functionality
             */
            if (this.control) {
                this.control.setValue(cl);
            }
            event.preventDefault();
        }
    }
}
