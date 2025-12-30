import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../../models/api-models/Search';
import { filter } from '../../lodash-optimized';

@Pipe({
    name: 'accountsFilter',
    pure: true,
    standalone: false
})
export class AccountsFilterPipe implements PipeTransform {

    /**
     * Filters the array of accounts based on opening, closing balance and account name
     *
     * @param {Array<Account>} accounts Array of accounts to be filtered
     * @param {boolean} showOnlyVisible True, if only visible accounts should be returned
     * @memberof AccountsFilterPipe
     */
    public transform(accounts: Array<Account>, showOnlyVisible?: boolean): Array<Account> {
        if (!accounts) {
            return [];
        }
        if (showOnlyVisible) {
            return accounts.filter(account => account.isVisible);
        }

        return accounts.filter(account => {
            if (!account.isVisible || !account.name) {
                return false;
            }
            const closingAmount = account.closingBalance?.amount ?? 0;
            const openingAmount = account.openingBalance?.amount ?? 0;
            const debitTotal = account.debitTotal ?? 0;
            const creditTotal = account.creditTotal ?? 0;
            return closingAmount !== 0 || openingAmount !== 0 || debitTotal !== 0 || creditTotal !== 0;
        });
    }
}
