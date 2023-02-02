import { Directive, ElementRef, HostListener } from '@angular/core';
import { ToasterService } from '../../../../services/toaster.service';

@Directive({
    selector: '[UniqueNameDirective]'
})
export class UniqueNameDirective {
    public el: HTMLInputElement;

    // tslint:disable-next-line:member-ordering
    constructor(private elementRef: ElementRef, private _toaster: ToasterService) {
        this.el = this.elementRef.nativeElement;
    }

    @HostListener('keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
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
        this.el.value = this.el?.value.toLowerCase();
    }

}
