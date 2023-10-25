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
    public transform(accountNumber: string, defaultAccountNumberLength:number = 4): string {
        if (!accountNumber) {
            return '';
        }

        // Mask all characters except the last four digits
        const maskedAccount = '*'.repeat(accountNumber.length - defaultAccountNumberLength) + accountNumber.slice(-defaultAccountNumberLength);
        return maskedAccount;

    }
}
