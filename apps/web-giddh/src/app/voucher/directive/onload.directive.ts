import { Directive, ElementRef, EventEmitter, OnInit, Output } from "@angular/core";

/**
 * Handles Directive functionality
 */
@Directive({
    selector: "[onLoad]",
    standalone: false
})
/**
 * OnloadDirective directive
 * Implements OnloadDirective functionality
 */
export class OnloadDirective implements OnInit {
    /** This will emit the blank event */
    @Output('elementLoaded') public elementLoaded: EventEmitter<any> = new EventEmitter();


    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(private el: ElementRef) {
    }
    
    /**
     * Hook cycle for component initilization
     *
     * @memberof OnloadDirective
     */
    public ngOnInit(): void {
        this.elementLoaded.emit(this.el);
    }
}