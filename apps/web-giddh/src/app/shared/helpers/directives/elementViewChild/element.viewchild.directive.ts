import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[element-view-container-ref]',
    exportAs: 'elementviewcontainerref',
    standalone: false
})
// tslint:disable-next-line:directive-class-suffix
/**
 * ElementViewContainerRef directive
 * Implements ElementViewContainerRef functionality
 */
export class ElementViewContainerRef {
    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
