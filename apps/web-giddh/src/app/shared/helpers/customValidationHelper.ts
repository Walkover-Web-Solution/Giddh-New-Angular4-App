import { AbstractControl, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';

export const emailValidator = (control: FormControl) => {
    return new Promise<any>((resolve, reject) => {
        if (!EMAIL_VALIDATION_REGEX.test(control?.value)) {
            resolve({ notValid: true });
        } else {
            resolve(null);
        }
    });
};

export const mobileValidator = (control: FormControl) => {
    return new Promise<any>((resolve, reject) => {
        if (!EMAIL_VALIDATION_REGEX.test(control?.value)) {
            resolve({ notValid: true });
        } else {
            resolve(null);
        }
    });
};

export const uniqueNameValidator = (control: FormControl) => {
    return new Promise<any>((resolve, reject) => {
        let pattern = /^[a-z0-9]*$/;
        let val = control?.value.toLowerCase();
        if (!pattern.test(val)) {
            resolve({ notValidUniqueName: true });
        } else {
            resolve(null);
        }
    });
};

export const digitsOnly: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } => {
    let v: string = control?.value;
    if (control.dirty) {
        return /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v) ? null : { digits: true };
    }
};

export const decimalDigits: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } => {
    let v = control?.value;
    if (control.dirty && v) {
        return /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,3})?$/.test(v) ? null : { digits: true };
    } else {
        return null;
    }
};

export const equalSigns = (ocVal: string) => {
    return (c: FormControl) => {
        let v = c?.value;
        if (v && ocVal) {
            return Math.sign(v) !== Math.sign(parseFloat(ocVal)) ? null : { invalidSign: true };
        }
        return null;
    };

};

export const stockManufacturingDetailsValidator = (control: AbstractControl) => {
    const linkedStocks = control.get('linkedStocks') as FormArray;
    const manufacturingQuantity = control.get('manufacturingQuantity');
    const manufacturingUnitCode = control.get('manufacturingUnitCode');

    if (manufacturingQuantity && manufacturingUnitCode) {
        if (!linkedStocks?.controls?.length) {
            return { notAllowed: true };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const dateValidator = (control: FormControl) => {
    let datePattern = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

    if (!datePattern.test(control?.value)) {
        return { invalidDate: true };
    }
    return null;
};
