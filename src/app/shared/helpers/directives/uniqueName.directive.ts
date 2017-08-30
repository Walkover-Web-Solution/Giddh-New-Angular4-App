import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';

@Directive({
  selector: '[UniqueNameDirective]'
})
export class UniqueNameDirective  {
  public el: HTMLInputElement;
  @HostListener('keypress', ['$event'])
  public onChange(event: any) {
    // this.el.value = value.target.value.replace(RegExp(' ', 'g'), '');
    if (event.which === 32) {
      event.preventDefault();
      this._toaster.clearAllToaster();
      this._toaster.warningToast('Space not allowed', 'Warning');
    }
  }

  // tslint:disable-next-line:member-ordering
  constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
    this.el = this.elementRef.nativeElement;
  }

}
