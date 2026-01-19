import { Directive, ElementRef } from '@angular/core';
import { WindowRef } from '../../window.object';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[PageHeight]',
    standalone: false
})
/**
 * FullPageHeight directive
 * Implements FullPageHeight functionality
 */
export class FullPageHeight {

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(el: ElementRef, winRef: WindowRef) {
        el.nativeElement.style.maxHeight = winRef.nativeWindow.innerHeight + 'px';
        el.nativeElement.style.minHeight = winRef.nativeWindow.innerHeight + 'px';
    }

}
