import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { uniqueNameInvalidStringReplace } from '../helperFunctions';

@Directive({
  selector: '[UniqueNameDirective]'
})
export class UniqueNameDirective {
  public el: HTMLInputElement;
  @HostListener('keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    // debugger;
    if (event.which === 32) {
      event.preventDefault();
      this._toaster.clearAllToaster();
      this._toaster.warningToast('Space not allowed', 'Warning');
    } else {
      if (/[\\/(){};:"<>#?%,]/g.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  @HostListener('input', ['$event'])
  public onInput(event: any) {
    this.el.value = this.el.value.toLowerCase();
  }

  // tslint:disable-next-line:member-ordering
  constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
    this.el = this.elementRef.nativeElement;
  }

}
