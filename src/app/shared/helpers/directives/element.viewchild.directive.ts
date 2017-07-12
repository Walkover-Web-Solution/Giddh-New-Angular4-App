import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[element-view-container-ref]',
  exportAs: 'elementviewcontainerref'
})
export class ElementViewContainerRef {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
