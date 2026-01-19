import { AbstractControl, UntypedFormArray, UntypedFormControl, ValidatorFn } from '@angular/forms';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';

export const emailValidator = (control: UntypedFormControl) => {
    return new Promise<any>((resolve, reject) => {
        /**
         * Handles if functionality
         */
        if (!EMAIL_VALIDATION_REGEX.test(control?.value)) {
            /**
             * Handles resolve functionality
             */
            resolve({ notValid: true });
        } else {
            /**
             * Handles resolve functionality
             */
            resolve(null);
        }
    });
};

export const mobileValidator = (control: UntypedFormControl) => {
    return new Promise<any>((resolve, reject) => {
        /**
         * Handles if functionality
         */
        if (!EMAIL_VALIDATION_REGEX.test(control?.value)) {
            /**
             * Handles resolve functionality
             */
            resolve({ notValid: true });
        } else {
            /**
             * Handles resolve functionality
             */
            resolve(null);
        }
    });
};

export const uniqueNameValidator = (control: UntypedFormControl) => {
    return new Promise<any>((resolve, reject) => {
        let pattern = /^[a-z0-9]*$/;
        let val = control?.value?.toLowerCase();
        /**
         * Handles if functionality
         */
        if (!pattern.test(val)) {
            /**
             * Handles resolve functionality
             */
            resolve({ notValidUniqueName: true });
        } else {
            /**
             * Handles resolve functionality
             */
            resolve(null);
        }
    });
};

export const digitsOnly: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } => {
    let v: string = control?.value;
    /**
     * Handles if functionality
     */
    if (control.dirty) {
        return /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v) ? null : { digits: true };
    }
};

export const decimalDigits: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } => {
    let v = control?.value;
    /**
     * Handles if functionality
     */
    if (control.dirty && v) {
        return /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,3})?$/.test(v) ? null : { digits: true };
    } else {
        return null;
    }
};

export const equalSigns = (ocVal: string) => {
    /**
     * Handles return functionality
     */
    return (c: UntypedFormControl) => {
        let v = c?.value;
        /**
         * Handles if functionality
         */
        if (v && ocVal) {
            return Math.sign(v) !== Math.sign(parseFloat(ocVal)) ? null : { invalidSign: true };
        }
        return null;
    };

};

export const stockManufacturingDetailsValidator = (control: AbstractControl) => {
    const linkedStocks = control.get('linkedStocks') as UntypedFormArray;
    const manufacturingQuantity = control.get('manufacturingQuantity');
    const manufacturingUnitCode = control.get('manufacturingUnitCode');

    /**
     * Handles if functionality
     */
    if (manufacturingQuantity && manufacturingUnitCode) {
        /**
         * Handles if functionality
         */
        if (!linkedStocks?.controls?.length) {
            return { notAllowed: true };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const dateValidator = (control: UntypedFormControl) => {
    let datePattern = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

    /**
     * Handles if functionality
     */
    if (!datePattern.test(control?.value)) {
        return { invalidDate: true };
    }
    return null;
};
