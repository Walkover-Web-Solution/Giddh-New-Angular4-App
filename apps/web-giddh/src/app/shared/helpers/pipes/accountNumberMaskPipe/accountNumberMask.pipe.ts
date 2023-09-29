import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'accountNumberMask',
    pure: true
})
export class AccountNumberMaskPipe implements PipeTransform {
    public constructor() { }
/**
 * This will be use for convert account number to mask format.
 *
 * @param {string} accountNumber
 * @return {*}  {string}
 * @memberof AccountNumberMaskPipe
 */
public transform(accountNumber: string): string {
        if (!accountNumber) {
            return '';
        }

        // Check if the input contains at least four digits
        if (accountNumber.length < 4) {
            throw new Error('Account number should contain at least four digits');
        }

        // Mask all characters except the last four digits
        const maskedAccount = '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
        return maskedAccount;

    }
}
