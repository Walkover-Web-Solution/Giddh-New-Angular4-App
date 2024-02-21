import { Directive, EventEmitter, OnInit, Output } from "@angular/core";

@Directive({
    selector: "[onLoad]"
})
export class OnloadDirective implements OnInit {
    @Output() public elementLoaded: EventEmitter<void> = new EventEmitter();

    public ngOnInit(): void {
        this.elementLoaded.emit();
    }
}