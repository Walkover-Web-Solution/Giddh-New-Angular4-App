import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { digitsOnly } from '../customValidationHelper';

const DIGITS_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DigitsValidatorDirective),
  multi: true
};

@Directive({
  selector: '[digits][formControlName],[digits][formControl],[digits][ngModel]',
  providers: [DIGITS_VALIDATOR]
})
export class DigitsValidatorDirective implements Validator {
  public validate(c: AbstractControl): {[key: string]: any} {
    return digitsOnly(c);
  }
}
