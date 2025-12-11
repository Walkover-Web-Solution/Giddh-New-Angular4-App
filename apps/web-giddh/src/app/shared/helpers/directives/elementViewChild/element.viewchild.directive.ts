import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appElement.viewchild]',
  standalone: false,
    exportAs: 'elementviewcontainerref'
})
// tslint:disable-next-line:directive-class-suffix
export class ElementViewContainerRef {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
