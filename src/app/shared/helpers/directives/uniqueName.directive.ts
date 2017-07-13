import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';

@Directive({
  selector: '[UniqueNameDirective]'
})
export class UniqueNameDirective  {
  public el: HTMLInputElement;
  @HostListener('keyup', ['$event'])
  public onChange(value: any) {
    let pattern = /^[a-zA-Z0-9]*$/;
    debugger;
    this.el.value = value.target.value.toLowerCase();
    if (pattern.test(value.key)) {
      this.el.value = value.target.value.replace(/^\s+|\s+$/gm, '').toLowerCase();
    } else {
      if (value.key.length === 1 && value.key !== ' ') {
        this._toaster.infoToast(`${value.key} this character is not allowed here`);
      }
      this.el.value = this.el.value.replace(/^\s+|\s+$/gm, '');
    }
  }

  // tslint:disable-next-line:member-ordering
  constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
    this.el = this.elementRef.nativeElement;
  }

}
