import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';

@Directive({
  selector: '[UniqueNameDirective]'
})
export class UniqueNameDirective  {
  public el: HTMLInputElement;
  @HostListener('keyup', ['$event'])
  public onChange(value: any) {
    this.el.value = value.target.value.replace(RegExp(' ', 'g'), '');
    if (value.which === 32) {
      this._toaster.warningToast('Space not allowed', 'Warning');
    }
  }

  // tslint:disable-next-line:member-ordering
  constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
    this.el = this.elementRef.nativeElement;
  }

}
