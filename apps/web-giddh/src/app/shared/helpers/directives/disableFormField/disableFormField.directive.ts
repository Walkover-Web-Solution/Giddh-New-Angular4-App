import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[disableControl]'
})
export class DisableFormFieldDirective {

    constructor(private ngControl: NgControl) {
    }

    @Input() set disableControl(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

}
