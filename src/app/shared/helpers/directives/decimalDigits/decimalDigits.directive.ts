import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[decimalDigitsDirective]'
})
export class DecimalDigitsDirective {
  @Input() public decimalPoints: number = 2;
  @Input() public OnlyNumber: boolean = true;
  @Input() public DecimalPlaces: string;
  @Input() public minValue: string;
  @Input() public maxValue: string;

  public el: HTMLInputElement;

  // tslint:disable-next-line:member-ordering
  constructor(private elemRef: ElementRef) {
    this.el = this.elemRef.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event) {
    let e = event as KeyboardEvent;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event) {
    let e = event as any;

    let valInFloat: number = parseFloat(e.target.value);
    if (this.minValue) {
      // (isNaN(valInFloat) && e.key === "0") - When user enters value for first time valInFloat will be NaN, e.key condition is
      // because I didn't want user to enter anything below 1.
      // NOTE: You might want to remove it if you want to accept 0
      if (valInFloat < parseFloat(this.minValue) || (isNaN(valInFloat) && e.key === '0')) {
        e.preventDefault();
      }
    }

    if (this.maxValue) {
      if (valInFloat > parseFloat(this.maxValue)) {
        e.preventDefault();
      }
    }

    if (this.DecimalPlaces) {
      let currentCursorPos: number = -1;
      if (typeof this.elemRef.nativeElement.selectionStart === 'number') {
        currentCursorPos = this.elemRef.nativeElement.selectionStart;
      } else {
        // Probably an old IE browser
        console.log("This browser doesn't support selectionStart");
      }

      let dotLength: number = e.target.value.replace(/[^\.]/g, '').length;
      // If user has not entered a dot(.) e.target.value.split(".")[1] will be undefined
      let decimalLength = e.target.value.split('.')[1] ? e.target.value.split('.')[1].length : 0;

      // (this.DecimalPlaces - 1) because we don't get decimalLength including currently pressed character
      // currentCursorPos > e.target.value.indexOf(".") because we must allow user's to enter value before dot(.)
      // Checking Backspace etc.. keys because firefox doesn't pressing them while chrome does by default
      // tslint:disable-next-line:radix
      if (dotLength > 1 || (dotLength === 1 && e.key === '.') || (decimalLength > (parseInt(this.DecimalPlaces) - 1) &&
        currentCursorPos > e.target.value.indexOf('.')) && ['Backspace', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) === -1) {
        e.preventDefault();
      }
    }
  }

  @HostListener('document:paste', ['$event'])
  public onPress(event) {
    if ('decimaldigitsdirective' in event.target.attributes) {
      let cl = event.clipboardData.getData('text/plain');
      cl = cl.replace(/,\s?/g, '');
      let evt = new Event('input');
      event.target.dispatchEvent(evt);
      event.target.value = cl;
      event.preventDefault();
    }
    return;
  }
}
