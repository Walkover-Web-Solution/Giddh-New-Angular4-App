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
      this.toggleClass(this.el.nativeElement);
    }
  }

  private toggleClass(ele) {
    if (ele.nextElementSibling && ele.nextElementSibling.nextElementSibling) {
      ele.nextElementSibling.classList.toggle('isHidden');
      this.toggleClass(ele.nextElementSibling);
    } else {
      ele.nextElementSibling.classList.toggle('isHidden');
    }
  }
}
