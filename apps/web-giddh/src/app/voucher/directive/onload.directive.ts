import { Directive, ElementRef, EventEmitter, OnInit, Output } from "@angular/core";

@Directive({
    selector: "[onLoad]"
})
export class OnloadDirective implements OnInit {
    /** This will emit the blank event */
    @Output('elementLoaded') public elementLoaded: EventEmitter<any> = new EventEmitter();


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