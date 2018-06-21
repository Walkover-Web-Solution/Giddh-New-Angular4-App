import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onReturn]'
})
export class OnReturnDirective {
  @Input() public onReturn: string;
  private el: ElementRef;
  constructor(private _el: ElementRef) {
    this.el = this._el;
  }
  // @HostListener('keydown', ['$event']) public onKeyDown(e) {
  //     if ((e.which === 13 || e.keyCode === 13)) {
  //         console.log('e.srcElement.nextElementSibling is :', e.srcElement.nextElementSibling);
  //         e.preventDefault();
  //         if (e.srcElement.nextElementSibling) {
  //             e.srcElement.nextElementSibling.focus();
  //         } else {
  //             console.log('close keyboard');
  //         }
  //         return;
  //     }
  // }
  @HostListener('keydown', ['$event']) public onKeyDown(e: any) {

    if ((e.which === 13 || e.keyCode === 13) || (e.which === 8 || e.keyCode === 8)) {
      const selectedEle = e.target;
      const allElements: any = window.document.querySelectorAll('input[onReturn][type="text"]');
      const nodeList = Array.from(allElements);
      const indx = nodeList.findIndex((ele) => ele === selectedEle);
      // nodeList[indx + 1].focus();
      if (e.which === 13 || e.keyCode === 13) {
        const target = allElements[indx + 1];
        // let attrArray = [];
        // for (let i = 0, atts = target.attributes, n = atts.length, arr = []; i < n; i++) {
        //   attrArray.push(atts[i].nodeName);
        // }
        // console.log('attrArray is :', attrArray);
        // if (attrArray.indexOf('onreturn') > -1) {
        //   target.focus();
        // } else {
        //   alert('ele without directive');
        // }
        target.focus();
      } else if (e.which === 8 || e.keyCode === 8) {
        const target = allElements[indx - 1];
        if (selectedEle.value === '') {
          e.preventDefault();
          target.focus();
        }
      }

      // console.log('currentEle is :', nextEle);
      // alert(indx);

      // console.log('event is :', e);
      // e.preventDefault();
      // let control: any;
      // control = e.srcElement.nextSibling;
      // while (true) {
      //   if (control) {
      //     if ((!control.hidden) &&
      //       (control.nodeName === 'INPUT' ||
      //         control.nodeName === 'SELECT' ||
      //         control.nodeName === 'BUTTON' ||
      //         control.nodeName === 'TEXTAREA')) {
      //       control.focus();
      //       return;
      //     } else {
      //       control = control.nextElementSibling;
      //     }
      //   } else {
      //     console.log('close keyboard', window.document.querySelectorAll('input'));
      //     return;
      //   }
      // }
    }
  }
}
