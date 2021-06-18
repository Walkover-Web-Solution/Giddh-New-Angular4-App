import { Directive, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
    selector: '[textCaseChangeDirective]'
})
export class TextCaseChangeDirective {
    @Input() public control: FormControl;

    constructor() {
        
    }

    @HostListener('document:paste', ['$event'])
    public Paste(event) {
        if ('textcasechangedirective' in event.target.attributes) {
            let cl = event.clipboardData.getData('text/plain');
            cl = cl.toLowerCase();
            event.target.value = cl;
            if (this.control) {
                this.control.setValue(cl);
            }
            event.preventDefault();
        }
    }
}
