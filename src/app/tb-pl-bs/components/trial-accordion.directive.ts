import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[trial-accordion]'
})
export class TrialAccordionDirective {
  // @HostBinding('trial-accordion') public type = '';
  @Input('trial-accordion') data;

  constructor(private el: ElementRef) {
    //

  }

  @HostListener('click')
  public onClick() {
    if (this.data.accounts) {
      //this.data.accounts = this.data.accounts.map(p => ({ ...p, isVisible: !p.isVisible }));
      this.data.childGroups = this.data.childGroups.map(p => ({ ...p, isVisible: !p.isVisible }));
      this.data.isVisible = true;
      console.log(this.data);
    }
    if (this.el.nativeElement.nextElementSibling) {
      //this.toggleClass(this.el.nativeElement);
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
