import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[ngInit]',
    standalone: false
})
/**
 * NgInitDirective directive
 * Implements NgInitDirective functionality
 */
export class NgInitDirective implements OnInit {
    @Output('ngInit') public initEvent: EventEmitter<any> = new EventEmitter();

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _el: ElementRef) {
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /**
         * Sets timeout value
         */
        setTimeout(() => this.initEvent.emit(this._el), 10);
    }
}
