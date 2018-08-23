import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onReturn]'
})
export class OnReturnDirective {
  @Input() public onReturn: string;
  private el: ElementRef;
  private clickCount: number = 0;
  private activeIndx: number = null;
  private fieldToActivate: any = null;
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

    if ((e.which === 13 || e.keyCode === 13) || (e.which === 8 || e.keyCode === 8) || (e.which === 32 || e.keyCode === 32)) {
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

        if (target) {
          // if (this.activeIndx === indx) {
          //   this.clickCount++;
          //   if (this.clickCount > 1) {
          //     const activatedRow: any = window.document.querySelectorAll('tr.activeRow');
          //     const rowEntryType =  activatedRow[0].children[0].children[0].value;
          //     let fieldToActivate;
          //     if (rowEntryType === 'by') {
          //       fieldToActivate = activatedRow[0].children[2].children[0];
          //     } else {
          //       fieldToActivate = activatedRow[0].children[3].children[0];
          //     }
          //     if (this.fieldToActivate === fieldToActivate) {
          //       target.focus();
          //     } else {
          //       if (fieldToActivate.disabled) {
          //         const disabledFieldIndx = nodeList.findIndex((ele) => ele === fieldToActivate);
          //         allElements[disabledFieldIndx + 1].focus();
          //       }
          //       fieldToActivate.focus();
          //       this.clickCount = 0;
          //       this.fieldToActivate = fieldToActivate;
          //     }
          //     // console.log('lastChild is :', activatedRow[0].lastChild());
          //   }
          // } else {
          //   this.activeIndx = indx;
          //   this.clickCount = 0;
          // }

          if (target.value === 'NaN') {
            target.value = '';
          }
          // if (target.disabled) {
          //   const disabledFieldIndx = nodeList.findIndex((ele) => ele === target);
          //   allElements[disabledFieldIndx + 1].focus();
          // }
          target.focus();
        }

      } else if (e.which === 8 || e.keyCode === 8) {
        const target = allElements[indx - 1];

        if (target && e.target.value.length === e.target.selectionEnd) {
          e.preventDefault();
          target.focus();
        }

        // if (selectedEle.value === '') {
          // e.preventDefault();
          // if (target) {
          //   target.focus();
          // }
        // }
      } else if (e.which === 32 || e.keyCode === 32) {
        const target = allElements[indx];
        if (target) {
          target.value = '';
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
