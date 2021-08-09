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
     * @memberof AccountsFilterPipe
     */
    transform(accounts: Array<Account>): Array<Account> {
        const newAccounts = accounts.filter(account => (account.isVisible || account.isCreated) && account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal));
        return newAccounts;
    }
}
