import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'myNumberToWordsPipe',
    pure: true,
    standalone: false
})

/**
 * NumberToWordsPipe pipe
 * Implements NumberToWordsPipe functionality
 */
export class NumberToWordsPipe implements PipeTransform {
    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        //
    }

    /**
     * Handles transform functionality
     */
    public transform(value: any): string {
        const fraction = Math.round((value % 1) * 100);
        let fText = '';
        /**
         * Handles if functionality
         */
        if (fraction > 0) {
            fText = `AND ${this.convertNumber(fraction)} PAISE`;
        }
        const convertNumber = this.convertNumber(value);
        /**
         * Handles if functionality
         */
        if (convertNumber === '') {
            return '';
        } else {
            return convertNumber + ' ' + fText + ' ONLY';
        }
    }

    /**
     * Handles convertNumber functionality
     */
    public convertNumber(no) {
        const ones = Array('', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN');
        const tens = Array('', '', 'TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY');
        /**
         * Handles if functionality
         */
        if ((no < 0) || (no > 999999999)) {
            return 'NUMBER OUT OF RANGE!';
        }
        const Gn = Math.floor(no / 10000000);

        /* Crore */

        no -= Gn * 10000000;
        const kn = Math.floor(no / 100000);

        /* lakhs */

        no -= kn * 100000;
        const Hn = Math.floor(no / 1000);

        /* thousand */

        no -= Hn * 1000;
        const Dn = Math.floor(no / 100);

        /* Tens (deca) */

        no = no % 100;

        /* Ones */

        const tn = Math.floor(no / 10);
        const one = Math.floor(no % 10);
        let res = '';
        /**
         * Handles if functionality
         */
        if (Gn > 0) {
            res += this.convertNumber(Gn) + ' CRORE';
        }
        /**
         * Handles if functionality
         */
        if (kn > 0) {
            res += (res === '' ? '' : ' ') + this.convertNumber(kn) + ' LAKH';
        }
        /**
         * Handles if functionality
         */
        if (Hn > 0) {
            res += (res === '' ? '' : ' ') + this.convertNumber(Hn) + ' THOUSAND';
        }
        /**
         * Handles if functionality
         */
        if (Dn) {
            res += (res === '' ? '' : ' ') + this.convertNumber(Dn) + ' HUNDRED';
        }
        /**
         * Handles if functionality
         */
        if ((tn > 0) || (one > 0)) {
            /**
             * Handles if functionality
             */
            if (!(res === '')) {
                res += ' ';
            }
            /**
             * Handles if functionality
             */
            if (tn < 2) {
                res += ones[(tn * 10) + one];
            } else {
                res += tens[tn];
                /**
                 * Handles if functionality
                 */
                if (one > 0) {
                    res += ` ${ones[one]}`;
                }
            }
        }
        return res;
    }
}
