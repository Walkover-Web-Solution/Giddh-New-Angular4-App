import { Inject, Injectable, Optional } from '@angular/core';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flatten-accounts-result-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpWrapperService } from '../services/http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { BlankLedgerVM } from './../ledger/ledger.vm';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { VOUCHERS } from './constants/accounting.constant';
import { GeneralService } from '../services/general.service';
import { cloneDeep, each } from '../lodash-optimized';

/**
 * IPageInfo interface definition
 * Defines the structure and contract for IPageInfo objects
 */
export interface IPageInfo {
    page: string;
    uniqueName: string;
    gridType: string;
}

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * TallyModuleService class
 * Implements TallyModuleService functionality
 */
export class TallyModuleService {

    public selectedPageInfo: BehaviorSubject<IPageInfo> = new BehaviorSubject(null);

    public flattenAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public cashAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public purchaseAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public bankAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public taxAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public expenseAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);
    public salesAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);

    public filteredAccounts: BehaviorSubject<IFlattenAccountsResultItem[]> = new BehaviorSubject(null);

    public selectedFieldType: BehaviorSubject<string> = new BehaviorSubject(null);

    public mappingObj = [{
        purchase: {
            by: ['cash', 'bank', 'currentliabilities'],
            to: ['expenses']
        },
        sales: {
            by: ['currentassets', 'currentliabilities'],
            to: ['income']
        }
    }];

    public requestData: BehaviorSubject<any> = new BehaviorSubject(null);

    public transactionObj: object = {};

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
    ) {
    }

    /**
     * Sets voucher value
     */
    public setVoucher(info: IPageInfo) {
        this.selectedPageInfo.next(info);
        this.getAccounts();
    }

    /**
     * Sets flattenaccounts value
     */
    public setFlattenAccounts(accounts: IFlattenAccountsResultItem[]) {
        let cashAccounts = [];
        let purchaseAccounts = [];
        let bankAccounts = [];
        let taxAccounts = [];
        let expenseAccounts = [];
        let salesAccounts = [];
        (Array.isArray(accounts) ? accounts : []).forEach((acc) => {
            let cashAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'cash');
            /**
             * Handles if functionality
             */
            if (cashAccount) {
                cashAccounts.push(acc);
            }
            let purchaseAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses');
            /**
             * Handles if functionality
             */
            if (purchaseAccount) {
                purchaseAccounts.push(acc);
            }
            let bankAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts');
            /**
             * Handles if functionality
             */
            if (bankAccount) {
                bankAccounts.push(acc);
            }
            let taxAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'currentliabilities');
            /**
             * Handles if functionality
             */
            if (taxAccount) {
                taxAccounts.push(acc);
            }
            let expenseAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'indirectexpenses' || pg?.uniqueName === 'operatingcost');
            /**
             * Handles if functionality
             */
            if (expenseAccount) {
                expenseAccounts.push(acc);
            }
            // pg?.uniqueName === 'income'
            let salesAccount = acc?.parentGroups.find((pg) => pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities');
            /**
             * Handles if functionality
             */
            if (salesAccount) {
                salesAccounts.push(acc);
            }
        });

        this.cashAccounts.next(cashAccounts);
        this.purchaseAccounts.next(purchaseAccounts);
        this.bankAccounts.next(bankAccounts);
        this.taxAccounts.next(taxAccounts);
        this.expenseAccounts.next(expenseAccounts);
        this.salesAccounts.next(salesAccounts);
        this.flattenAccounts.next(accounts);
        this.filteredAccounts.next(this.flattenAccounts.value);
    }

    /**
     * Updates all accounts list when a new account is added by checking its
     * category
     *
     * @param {IFlattenAccountsResultItem} account Newly added account
     * @memberof TallyModuleService
     */
    public updateFlattenAccounts(account: IFlattenAccountsResultItem): void {
        let cashAccounts = [];
        let purchaseAccounts = [];
        let bankAccounts = [];
        let taxAccounts = [];
        let expenseAccounts = [];
        let salesAccounts = [];

        /**
         * Handles if functionality
         */
        if (account) {
            let cashAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'cash');
            /**
             * Handles if functionality
             */
            if (cashAccount) {
                cashAccounts.push(account);
            }
            let purchaseAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses');
            /**
             * Handles if functionality
             */
            if (purchaseAccount) {
                purchaseAccounts.push(account);
            }
            let bankAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts');
            /**
             * Handles if functionality
             */
            if (bankAccount) {
                bankAccounts.push(account);
            }
            let taxAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'currentliabilities');
            /**
             * Handles if functionality
             */
            if (taxAccount) {
                taxAccounts.push(account);
            }
            let expenseAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'indirectexpenses' || pg?.uniqueName === 'operatingcost');
            /**
             * Handles if functionality
             */
            if (expenseAccount) {
                expenseAccounts.push(account);
            }
            // pg?.uniqueName === 'income'
            let salesAccount = account.parentGroups.find((pg) => pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities');
            /**
             * Handles if functionality
             */
            if (salesAccount) {
                salesAccounts.push(account);
            }
        }

        this.cashAccounts.next([this.cashAccounts?.value, ...cashAccounts]);
        this.purchaseAccounts.next([...this.purchaseAccounts?.value, ...purchaseAccounts]);
        this.bankAccounts.next([...this.bankAccounts?.value, ...bankAccounts]);
        this.taxAccounts.next([...this.taxAccounts?.value, ...taxAccounts]);
        this.expenseAccounts.next([...this.expenseAccounts?.value, ...expenseAccounts]);
        this.salesAccounts.next([...this.salesAccounts?.value, ...salesAccounts]);
        this.flattenAccounts.next([...this.flattenAccounts?.value, account]);
        this.filteredAccounts.next(this.flattenAccounts?.value);
    }

    /**
     * Retrieves accounts data
     */
    public getAccounts() {
        let accounts = [];
        /**
         * Handles if functionality
         */
        if (this.selectedPageInfo?.value) {
            /**
             * Handles switch functionality
             */
            switch (this.selectedPageInfo?.value.page) {
                case 'journal':
                    // As discussed with Manish, Cash and Bank account should not come in Journal entry
                    /**
                     * Handles if functionality
                     */
                    if (this.purchaseAccounts?.value) {
                        accounts = this.purchaseAccounts.value.concat(this.expenseAccounts?.value).concat(this.taxAccounts?.value).concat(this.salesAccounts?.value);
                    } else if (this.expenseAccounts?.value) {
                        accounts = this.expenseAccounts.value.concat(this.taxAccounts?.value).concat(this.salesAccounts?.value);
                    } else if (this.taxAccounts?.value) {
                        accounts = this.taxAccounts.value.concat(this.salesAccounts?.value);
                    } else {
                        accounts = this.salesAccounts?.value;
                    }
                    break;
                case 'Purchase':
                    /**
                     * Handles if functionality
                     */
                    if (this.bankAccounts?.value) {
                        accounts = this.bankAccounts.value.concat(this.cashAccounts?.value).concat(this.expenseAccounts?.value).concat(this.taxAccounts?.value);
                    } else if (this.cashAccounts?.value) {
                        accounts = this.cashAccounts.value.concat(this.expenseAccounts?.value).concat(this.taxAccounts?.value);
                    } else if (this.expenseAccounts?.value) {
                        accounts = this.expenseAccounts.value.concat(this.taxAccounts?.value);
                    } else {
                        accounts = this.taxAccounts?.value;
                    }
                    break;
                case 'sales':
                    /**
                     * Handles if functionality
                     */
                    if (this.bankAccounts?.value) {
                        accounts = this.bankAccounts.value.concat(this.cashAccounts?.value).concat(this.expenseAccounts?.value).concat(this.salesAccounts?.value);
                    } else if (this.cashAccounts?.value) {
                        accounts = this.cashAccounts.value.concat(this.expenseAccounts?.value).concat(this.salesAccounts?.value);
                    } else if (this.expenseAccounts?.value) {
                        accounts = this.expenseAccounts.value.concat(this.salesAccounts?.value);
                    } else {
                        accounts = this.salesAccounts?.value;
                    }
                    break;
                case 'Credit note':
                    /**
                     * Handles if functionality
                     */
                    if (this.taxAccounts?.value) {
                        accounts = this.taxAccounts.value.concat(this.salesAccounts?.value);
                    } else {
                        accounts = this.salesAccounts?.value;
                    }
                    break;
                case 'Debit note':
                    /**
                     * Handles if functionality
                     */
                    if (this.purchaseAccounts?.value) {
                        accounts = this.purchaseAccounts.value.concat(this.taxAccounts?.value).concat(this.expenseAccounts?.value);
                    } else if (this.taxAccounts?.value) {
                        accounts = this.taxAccounts.value.concat(this.expenseAccounts?.value);
                    } else {
                        accounts = this.expenseAccounts?.value;
                    }
                    break;
                case 'payment':
                    accounts = this.flattenAccounts?.value;
                    break;
                case 'receipt':
                    accounts = this.flattenAccounts?.value;
                case 'contra':
                    /**
                     * Handles accounts functionality
                     */
                    accounts = (this.cashAccounts?.value) ? this.cashAccounts.value.concat(this.bankAccounts?.value) : this.bankAccounts?.value;
                    break;
                default:
                    accounts = this.flattenAccounts?.value;
            }
            /**
             * Handles if functionality
             */
            if (accounts && accounts.length) {
                this.filteredAccounts.next(accounts);
            }
        }
    }

    /**
     * Handles prepareRequestForAPI functionality
     */
    public prepareRequestForAPI(data: any): BlankLedgerVM {
        let requestObj = cloneDeep(data);
        let transactions = [];
        // filter transactions which have selected account
        /**
         * Handles each functionality
         */
        each(requestObj.transactions, (txn: any) => {
            /**
             * Handles if functionality
             */
            if (txn.inventory && txn.inventory.length) {
                /**
                 * Handles each functionality
                 */
                each(txn.inventory, (inv, i) => {
                    let obj = null;
                    obj = cloneDeep(txn);
                    /**
                     * Handles if functionality
                     */
                    if (inv.stock.name && inv.amount) {
                        obj.inventory = inv;
                    } else {
                        delete obj.inventory;
                    }
                    // This line is added after all stocks changes
                    obj.amount = obj.inventory ? obj.inventory.amount : obj.amount;
                    transactions.push(obj);
                });
            } else {
                delete txn.inventory;
                transactions.push(txn);
            }
        });
        /**
         * Handles if functionality
         */
        if (transactions?.length) {
            requestObj.transactions = transactions;
        }
        return requestObj;
    }

    /**
     * Validates fordata input
     */
    private validateForData(data) {
        let isValid = true;
        /**
         * Handles switch functionality
         */
        switch (data.voucherType) {
        }
        return isValid;
    }

    /**
     * Returns the current balance of selected account for a
     * particular date range
     *
     * @param {string} companyUniqueName Company unique name
     * @param {string} accountUniqueName Account unique name
     * @param {string} fromDate From date
     * @param {string} toDate To date
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof TallyModuleService
     */
    public getCurrentBalance(companyUniqueName: string, accountUniqueName: string, fromDate: string, toDate: string): Observable<any> {
        const contextPath = LEDGER_API.GET_BALANCE?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            ?.replace(':from', fromDate)?.replace(':to', toDate)
            ?.replace(':accountCurrency', 'true');
        return this.http.get(`${this.config.apiUrl}${contextPath}`);
    }

    /**
     * Returns the date in GIDDH_DATE_FORMAT format from YYYY-MM-DD format
     *
     * @param {string} date Date to be formatted
     * @returns {string} Formatted date
     * @memberof TallyModuleService
     */
    public getFormattedDate(date: string): string {
        /**
         * Handles if functionality
         */
        if (date) {
            const unformattedDate = date.split('-');
            return `${unformattedDate[2]}-${unformattedDate[1]}-${unformattedDate[0]}`;
        }
        return date;
    }

    /**
     * Gets the group by voucher type and transaction type
     *
     * @param {string} voucherType Voucher type
     * @param {string} [selectedTransactionType] Transaction type ('to'/ 'by')
     * @returns {*} Group and except group pair; the loaded accounts will be of groups -> (Groups - Except Groups)
     * @memberof TallyModuleService
     */
    public getGroupByVoucher(voucherType: string, selectedTransactionType?: string): any {
        /**
         * Handles if functionality
         */
        if (voucherType.toLowerCase() === VOUCHERS.CONTRA) {
            return {
                group: encodeURIComponent('bankaccounts, cash, loanandoverdraft'),
                exceptGroups: encodeURIComponent('sundrycreditors, dutiestaxes, sundrydebtors')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.RECEIPT) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'to' ?
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('tcspayable, sundrycreditors, sundrydebtors') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('bankaccounts, cash, loanandoverdraft, tdsreceivable'),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.PAYMENT) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'by' ? encodeURIComponent('sundrydebtors, sundrycreditors, tcspayable') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('cash, bankaccounts, loanandoverdraft,tdsreceivable'),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.JOURNAL) {
            return {
                group: encodeURIComponent('shareholdersfunds, noncurrentliabilities, currentliabilities,fixedassets,noncurrentassets,currentassets,revenuefromoperations,otherincome,operatingcost,indirectexpenses'),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.SALES) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'to' ?
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('revenuefromoperations, otherincome, fixedassets') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('bankaccounts, cash, loanandoverdraft,sundrycreditors,sundrydebtors '),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.PURCHASE) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'by' ?
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('operatingcost, indirectexpenses, fixedassets') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('bankaccounts, cash, loanandoverdraft, sundrycreditors, sundrydebtors'),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.DEBIT_NOTE) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'to' ?
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('operatingcost, indirectexpenses, fixedassets') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('bankaccounts, cash, loanandoverdraft, sundrycreditors, sundrydebtors'),
                exceptGroups: encodeURIComponent('')
            };
        } else if (voucherType.toLowerCase() === VOUCHERS.CREDIT_NOTE) {
            return {
                group: selectedTransactionType?.toLowerCase() === 'by' ?
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('revenuefromoperations, otherincome, fixedassets') :
                    /**
                     * Handles encodeURIComponent functionality
                     */
                    encodeURIComponent('bankaccounts, cash, loanandoverdraft, sundrycreditors, sundrydebtors'),
                exceptGroups: encodeURIComponent('')
            };
        }
        else {
            return {
                group: '',
                exceptGroups: ''
            };
        }
    }
}