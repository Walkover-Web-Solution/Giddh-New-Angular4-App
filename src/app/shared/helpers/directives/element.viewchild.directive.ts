import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[element-view-container-ref]',
})
export class ElementViewContainerRef {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
