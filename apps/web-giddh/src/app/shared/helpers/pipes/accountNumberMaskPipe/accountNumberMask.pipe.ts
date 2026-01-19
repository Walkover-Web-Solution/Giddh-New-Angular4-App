import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'accountNumberMask',
    pure: true,
    standalone: false
})
/**
 * AccountNumberMaskPipe pipe
 * Implements AccountNumberMaskPipe functionality
 */
export class AccountNumberMaskPipe implements PipeTransform {
    /**
     * Handles constructor functionality
     */
    public constructor() { }
    /**
     * This will be use for convert account number to mask format.
     *
     * @param {string} accountNumber
     * @return {*}  {string}
     * @memberof AccountNumberMaskPipe
     */
    public transform(accountNumber: string, defaultAccountNumberLength:number = 4): string {
        /**
         * Handles if functionality
         */
        if (!accountNumber) {
            return '';
        }

        // Mask all characters except the last four digits
        const maskedAccount = '*'.repeat(accountNumber.length - defaultAccountNumberLength) + accountNumber.slice(-defaultAccountNumberLength);
        return maskedAccount;

    }
}
