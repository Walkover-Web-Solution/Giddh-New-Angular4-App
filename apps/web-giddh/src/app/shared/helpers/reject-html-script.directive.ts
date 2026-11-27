import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, type ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { containsHtmlOrScript } from './html-script-validation';

@Directive({
    selector: '[rejectHtmlScript]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RejectHtmlScriptDirective),
            multi: true
        }
    ]
})
export class RejectHtmlScriptDirective implements Validator {
    public validate(control: AbstractControl): ValidationErrors | null {
        return containsHtmlOrScript(control.value) ? { htmlScript: true } : null;
    }
}

/** Shows the description error as soon as the value contains HTML or script. */
export class HtmlScriptErrorStateMatcher implements ErrorStateMatcher {
    public isErrorState(control: AbstractControl | null): boolean {
        return !!control?.hasError('htmlScript');
    }
}
