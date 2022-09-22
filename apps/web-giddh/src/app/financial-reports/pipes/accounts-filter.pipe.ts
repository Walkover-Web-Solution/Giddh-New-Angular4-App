import { Pipe, PipeTransform } from '@angular/core';

import { Account } from '../../models/api-models/Search';

@Pipe({
    name: 'accountsFilter',
    pure: true
})
export class AccountsFilterPipe implements PipeTransform {

    /**
     * Filters the array of accounts based on opening, closing balance and account name
     *
     * @param {*} accounts Array of accounts to be filtered
     * @param {boolean} showOnlyVisible True, if only visible accounts should be returned
     * @memberof AccountsFilterPipe
     */
    transform(accounts: Array<Account>, showOnlyVisible?: boolean): Array<Account> {
        if (showOnlyVisible) {
            return accounts?.filter(account => account.isVisible);
        }
        return accounts?.filter(account => (account.isVisible && account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal)));
    }
}
