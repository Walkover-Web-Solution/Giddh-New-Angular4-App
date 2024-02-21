import { Directive, EventEmitter, OnInit, Output } from "@angular/core";

@Directive({
    selector: "[onLoad]"
})
export class OnloadDirective implements OnInit {
    /** This will emit the blank event */
    @Output() public elementLoaded: EventEmitter<void> = new EventEmitter();

    /**
     * Hook cycle for component initilization
     *
     * @memberof OnloadDirective
     */
    public ngOnInit(): void {
        this.elementLoaded.emit();
    }
}