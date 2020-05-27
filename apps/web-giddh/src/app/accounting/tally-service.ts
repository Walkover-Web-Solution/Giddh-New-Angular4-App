import { Inject, Injectable, Optional } from '@angular/core';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { HttpWrapperService } from '../services/httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { BlankLedgerVM } from './../ledger/ledger.vm';
import { CURRENT_DATE_API } from './constants/accounting.constant';
import { LEDGER_API } from '../services/apiurls/ledger.api';

export interface IPageInfo {
    page: string;
    uniqueName: string;
    gridType: string;
}

@Injectable()
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

    // public requestData: BehaviorSubject<any> = new BehaviorSubject(new BlankLedgerVM());
    public requestData: BehaviorSubject<any> = new BehaviorSubject(null);

    public transactionObj: object = {};

    constructor(
        private http: HttpWrapperService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
    ) {
        this.selectedFieldType.pipe(distinctUntilChanged((p, q) => p === q)).subscribe((type: string) => {
            if (type && this.selectedPageInfo.value) {
                let filteredAccounts;
                if (this.selectedPageInfo.value.page === 'Journal') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.flattenAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.flattenAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Purchase') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.cashAccounts.value.concat(this.bankAccounts.value).concat(this.taxAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.expenseAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Sales') { // Here 1 thing is pending
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Payment') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.flattenAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value.concat(this.bankAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Contra') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value.concat(this.bankAccounts.value).concat(this.taxAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value.concat(this.bankAccounts.value).concat(this.taxAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Receipt') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.cashAccounts.value.concat(this.bankAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.flattenAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Debit note') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.cashAccounts.value.concat(this.bankAccounts.value).concat(this.taxAccounts.value));
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.expenseAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (this.selectedPageInfo.value.page === 'Credit note') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    } else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(this.salesAccounts.value);
                        this.filteredAccounts.next(filteredAccounts);
                    }
                }
            } else {
                this.filteredAccounts.next(this.flattenAccounts.value);
            }
        });
    }

    public setVoucher(info: IPageInfo) {
        this.selectedPageInfo.next(info);
        this.getAccounts();
    }

    public setFlattenAccounts(accounts: IFlattenAccountsResultItem[]) {
        let cashAccounts = [];
        let purchaseAccounts = [];
        let bankAccounts = [];
        let taxAccounts = [];
        let expenseAccounts = [];
        let salesAccounts = [];
        accounts.forEach((acc) => {
            let cashAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'cash');
            if (cashAccount) {
                cashAccounts.push(acc);
            }
            let purchaseAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses');
            if (purchaseAccount) {
                purchaseAccounts.push(acc);
            }
            let bankAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'bankaccounts');
            if (bankAccount) {
                bankAccounts.push(acc);
            }
            let taxAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'currentliabilities');
            if (taxAccount) {
                taxAccounts.push(acc);
            }
            let expenseAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'indirectexpenses' || pg.uniqueName === 'operatingcost');
            if (expenseAccount) {
                expenseAccounts.push(acc);
            }
            // pg.uniqueName === 'income'
            let salesAccount = acc.parentGroups.find((pg) => pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities');
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
        let cashAccount = account.parentGroups.find((pg) => pg.uniqueName === 'cash');
        if (cashAccount) {
            cashAccounts.push(account);
        }
        let purchaseAccount = account.parentGroups.find((pg) => pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses');
        if (purchaseAccount) {
            purchaseAccounts.push(account);
        }
        let bankAccount = account.parentGroups.find((pg) => pg.uniqueName === 'bankaccounts');
        if (bankAccount) {
            bankAccounts.push(account);
        }
        let taxAccount = account.parentGroups.find((pg) => pg.uniqueName === 'currentliabilities');
        if (taxAccount) {
            taxAccounts.push(account);
        }
        let expenseAccount = account.parentGroups.find((pg) => pg.uniqueName === 'indirectexpenses' || pg.uniqueName === 'operatingcost');
        if (expenseAccount) {
            expenseAccounts.push(account);
        }
        // pg.uniqueName === 'income'
        let salesAccount = account.parentGroups.find((pg) => pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities');
        if (salesAccount) {
            salesAccounts.push(account);
        }
        this.cashAccounts.next([this.cashAccounts.value, ...cashAccounts]);
        this.purchaseAccounts.next([...this.purchaseAccounts.value, ...purchaseAccounts]);
        this.bankAccounts.next([...this.bankAccounts.value, ...bankAccounts]);
        this.taxAccounts.next([...this.taxAccounts.value, ...taxAccounts]);
        this.expenseAccounts.next([...this.expenseAccounts.value, ...expenseAccounts]);
        this.salesAccounts.next([...this.salesAccounts.value, ...salesAccounts]);
        this.flattenAccounts.next([...this.flattenAccounts.value, account]);
        this.filteredAccounts.next(this.flattenAccounts.value);
    }

    public getAccounts() {
        let accounts = [];
        if (this.selectedPageInfo.value) {
            // console.log('this.selectedPageInfo.value inside service is :', this.selectedPageInfo.value);
            switch (this.selectedPageInfo.value.page) {
                case 'Journal':
                    // accounts = this.flattenAccounts.value;
                    // As discussed with Manish, Cash and Bank account should not come in Journal entry
                    accounts = this.purchaseAccounts.value.concat(this.expenseAccounts.value).concat(this.taxAccounts.value).concat(this.salesAccounts.value);
                    break;
                case 'Purchase':
                    accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.taxAccounts.value);
                    break;
                case 'Sales':
                    accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.salesAccounts.value);
                    break;
                case 'Credit note':
                    accounts = this.taxAccounts.value.concat(this.salesAccounts.value);
                    break;
                case 'Debit note':
                    accounts = this.purchaseAccounts.value.concat(this.taxAccounts.value).concat(this.expenseAccounts.value);
                    break;
                case 'Payment':
                    accounts = this.flattenAccounts.value;
                    break;
                case 'Receipt':
                    accounts = this.flattenAccounts.value;
                case 'Contra':
                    accounts = (this.cashAccounts.value) ? this.cashAccounts.value.concat(this.bankAccounts.value) : this.bankAccounts.value;
                    break;
                default:
                    accounts = this.flattenAccounts.value;
            }
            if (accounts && accounts.length) {
                // const endOfLine = {
                //   uniqueName: '_endoflist',
                //   name: 'End Of List',
                //   parentGroups: []
                // };
                // accounts.unshift(endOfLine);
                this.filteredAccounts.next(accounts);
            }
        }
    }

    public prepareRequestForAPI(data: any): BlankLedgerVM {
        let requestObj = _.cloneDeep(data);
        let transactions = [];
        // filter transactions which have selected account
        _.each(requestObj.transactions, (txn: any) => {
            if (txn.inventory && txn.inventory.length) {
                _.each(txn.inventory, (inv, i) => {
                    let obj = null;
                    obj = _.cloneDeep(txn);
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
        if (transactions.length) {
            requestObj.transactions = transactions;
        }
        return requestObj;
    }

    private validateForData(data) {
        // console.log('the data in validation fn is :', data);
        let isValid = true;
        switch (data.voucherType) {
            // case 'Purchase':
            //   let debitAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank' || pg.uniqueName === 'currentliabilities');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (debitAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Purchase (debit side).');
            //   }
            //   break;
            // case 'Sales':
            //   let creditAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'income');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (creditAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one income account is required in Sales (credit side).');
            //   }
            //   break;
            //   case 'Debit note':
            //   let debitNoteAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank' || pg.uniqueName === 'currentliabilities');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (debitNoteAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one credit account is required in Debit note (credit side).');
            //   }
            //   break;
            //   case 'Credit note':
            //   let creditNoteAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'income');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (creditNoteAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Credit note (debit side).');
            //   }
            //   break;
            //   case 'Payment':
            //   let paymentAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (paymentAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one credit account is required in Payment (credit side).');
            //   }
            //   break;
            //   case 'Receipt':
            //   let receiptAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (receiptAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Receipt (debit side).');
            //   }
            //   break;
        }
        return isValid;
    }

    /**
     * Fetches the current server date
     *
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof TallyModuleService
     */
    public fetchCurrentDate(): Observable<any> {
        return this.http.get(`${this.config.apiUrl}${CURRENT_DATE_API}`);
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
        const contextPath = LEDGER_API.GET_BALANCE.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
        .replace(':from', fromDate).replace(':to', toDate)
        .replace(':accountCurrency', 'true');
        return this.http.get(`${this.config.apiUrl}${contextPath}`);
    }

    /**
     * Returns the date in DD-MM-YYYY format from YYYY-MM-DD format
     *
     * @param {string} date Date to be formatted
     * @returns {string} Formatted date
     * @memberof TallyModuleService
     */
    public getFormattedDate(date: string): string {
        if (date) {
            const unformattedDate = date.split('-');
            return `${unformattedDate[2]}-${unformattedDate[1]}-${unformattedDate[0]}`;
        }
        return date;
    }
}
