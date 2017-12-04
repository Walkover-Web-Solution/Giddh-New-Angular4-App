import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ChildGroup, Account } from '../../models/api-models/Search';

@Directive({
  selector: '[trial-accordion]'
})
export class TrialAccordionDirective {
  // @HostBinding('trial-accordion') public type = '';
  // tslint:disable-next-line:no-input-rename
  @Input('trial-accordion') public data: ChildGroup;
  // tslint:disable-next-line:no-input-rename
  constructor(private el: ElementRef) {
    //

  }

  @HostListener('click')
  public onClick() {
    if (this.data.accounts) {
      this.data.accounts.forEach((p: Account) => {
        if (p.isIncludedInSearch) {
          p.isVisible = !p.isVisible;
        }
      });
    }
    if (this.data.childGroups) {
      this.data.childGroups.forEach((p: ChildGroup) => {
        if (p.isIncludedInSearch) {
          p.isVisible = !p.isVisible;
        }
      });
    }
    this.data.isVisible = true;
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
