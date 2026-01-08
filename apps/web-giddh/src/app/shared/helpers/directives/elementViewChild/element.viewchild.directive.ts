import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[element-view-container-ref]',
    exportAs: 'elementviewcontainerref',
    standalone: false
})
// tslint:disable-next-line:directive-class-suffix
export class ElementViewContainerRef {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
