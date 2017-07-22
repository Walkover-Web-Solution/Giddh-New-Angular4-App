import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[digitsOnlyDirective]'
})
export class DigitsOnlyDirective  {
  public el: HTMLInputElement;
  @HostListener('keyup', ['$event'])
  public onChange(value: any) {
    this.el.value = this.el.value.replace(/[^0-9]/g, '');
  }

  // tslint:disable-next-line:member-ordering
  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

}
