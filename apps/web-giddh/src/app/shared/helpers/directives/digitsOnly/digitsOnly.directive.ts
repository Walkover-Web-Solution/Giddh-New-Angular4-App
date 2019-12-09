import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[digitsOnlyDirective]'
})
export class DigitsOnlyDirective {
    public el: HTMLInputElement;

    // tslint:disable-next-line:member-ordering
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
    }

    @HostListener('keyup', ['$event'])
    public onChange(el: any) {
        if (el.shiftKey || el.ctrlKey || (el.which >= 37 && el.which <= 40)) {
            return;
        }
        this.renderer.setProperty(this.el, 'value', this.el.value.replace(/[^0-9]/g, ''));
    }

}
