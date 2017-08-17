import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[trial-accordion]'
})
export class TrialAccordionDirective {
  // @HostBinding('trial-accordion') public type = '';

  constructor(private el: ElementRef) {
    //
  }

  @HostListener('click')
  public onClick() {
    // console.log(this.type);

    if (this.el.nativeElement.nextElementSibling) {
      this.el.nativeElement.nextElementSibling.classList.toggle('isHidden');
    }
  }
}
