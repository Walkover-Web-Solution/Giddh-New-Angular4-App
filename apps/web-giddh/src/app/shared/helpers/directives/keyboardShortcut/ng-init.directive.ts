import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[ngInit]'
})
export class NgInitDirective implements OnInit {
    @Output('ngInit') public initEvent: EventEmitter<any> = new EventEmitter();

    constructor(private _el: ElementRef) {
    }

    public ngOnInit() {
        setTimeout(() => this.initEvent.emit(this._el), 10);
    }
}
