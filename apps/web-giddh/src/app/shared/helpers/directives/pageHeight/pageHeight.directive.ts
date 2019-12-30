import { Directive, ElementRef } from '@angular/core';
import { WindowRef } from '../../window.object';

@Directive({
    selector: '[PageHeight]'
})
export class FullPageHeight {

    constructor(el: ElementRef, winRef: WindowRef) {
        el.nativeElement.style.maxHeight = winRef.nativeWindow.innerHeight + 'px';
        el.nativeElement.style.minHeight = winRef.nativeWindow.innerHeight + 'px';
    }

}
