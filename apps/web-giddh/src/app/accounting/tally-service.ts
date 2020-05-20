import { distinctUntilChanged } from 'rxjs/operators';
import { ToasterService } from './../services/toaster.service';
import { BlankLedgerVM } from './../ledger/ledger.vm';
import { BehaviorSubject } from 'rxjs';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { Injectable } from '@angular/core';

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

    constructor(private _toaster: ToasterService) {
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
}
