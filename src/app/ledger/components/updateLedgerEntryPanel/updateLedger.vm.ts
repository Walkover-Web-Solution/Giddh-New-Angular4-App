import { Observable } from 'rxjs/Observable';
import { ITransactionItem, ILedgerDiscount, ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { sumBy, find, filter, findIndex } from 'lodash';
import { IOption } from '../../../shared/theme';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ToasterService } from '../../../services/toaster.service';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountData, UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { LedgerService } from '../../../services/ledger.service';

export class UpdateLedgerVm {
  public flatternAccountList: IFlattenAccountsResultItem[] = [];
  public flatternAccountList4Select: Observable<IOption[]>;
  public selectedLedger: LedgerResponse;
  public selectedLedgerBackup: LedgerResponse;
  public entryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
  public grandTotal: number = 0;
  public totalAmount: number = 0;
  public voucherTypeList: IOption[];
  public isDisabledTaxesAndDiscounts: boolean = false;
  public discountArray: ILedgerDiscount[] = [];
  public isInvoiceGeneratedAlready: boolean = false;
  public showNewEntryPanel: boolean = true;
  public showStockDetails: boolean = false;
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private _toasty: ToasterService, private discountComponent: UpdateLedgerDiscountComponent) {
    this.voucherTypeList = [{
      label: 'Sales',
      value: 'sal'
    }, {
      label: 'Purchases',
      value: 'pur'
    }, {
      label: 'Receipt',
      value: 'rcpt'
    }, {
      label: 'Payment',
      value: 'pay'
    }, {
      label: 'Journal',
      value: 'jr'
    }, {
      label: 'Contra',
      value: 'cntr'
    }, {
      label: 'Debit Note',
      value: 'debit note'
    }, {
      label: 'Credit Note',
      value: 'credit note'
    }];
  }

  public blankTransactionItem(type: string = 'DEBIT'): ILedgerTransactionItem {
    return {
      amount: 0,
      type,
      particular: {
        name: '',
        uniqueName: ''
      }
    } as ILedgerTransactionItem;
  }

  public addDiscountEntry(discounts: UpdateLedgerDiscountData[]) {
    if (this.selectedLedger.transactions) {
      discounts.forEach(dx => {
        if (this.isValidEntry(dx.particular.uniqueName)) {
          let checkTrxEntryIndex = findIndex(this.selectedLedger.transactions, t => t.particular.uniqueName === dx.particular.uniqueName);
          if (checkTrxEntryIndex > -1) {
            if (dx.amount > 0) {
              this.selectedLedger.transactions[checkTrxEntryIndex].amount = dx.amount;
            } else {
              this.selectedLedger.transactions.splice(checkTrxEntryIndex, 1);
            }
          } else {
            if (dx.amount > 0) {
              let trx: ILedgerTransactionItem = this.blankTransactionItem('DEBIT');
              let filterdDebitTrx = this.selectedLedger.transactions.filter(p => p.type === 'DEBIT');
              let filterdCrditTrx = this.selectedLedger.transactions.filter(p => p.type === 'CREDIT');
              let index = filterdDebitTrx.findIndex(p => p.particular.uniqueName === '' || undefined || null);

              trx.amount = dx.amount;
              trx.particular = dx.particular;

              if (index > -1) {
                filterdDebitTrx[index] = trx;
                this.selectedLedger.transactions = [...filterdDebitTrx, ...filterdCrditTrx];
              } else {
                this.selectedLedger.transactions.push(trx);
              }
            }
          }
        } else {
          this.discountArray.map(d => {
            if (d.particular === dx.particular.uniqueName) {
              d.amount = 0;
            }
          });
          if (this.discountComponent) {
            this.discountComponent.genTotal();
          }
        }
      });
    }
    this.generatePanelAmount();
    return;
  }

  public addTaxEntry(taxes: UpdateLedgerTaxData[]) {
    if (this.selectedLedger.transactions) {
      taxes.forEach(tx => {
        let checkTrxEntryIndex = findIndex(this.selectedLedger.transactions, t => t.particular.uniqueName === tx.particular.uniqueName);
        if (checkTrxEntryIndex > -1) {
          this.selectedLedger.transactions[checkTrxEntryIndex].amount = tx.amount;
        } else {
          let trx: ILedgerTransactionItem = this.blankTransactionItem('DEBIT');
          let filterdDebitTrx = this.selectedLedger.transactions.filter(p => p.type === 'DEBIT');
          let filterdCrditTrx = this.selectedLedger.transactions.filter(p => p.type === 'CREDIT');
          let blankIndex = filterdDebitTrx.findIndex(p => p.particular.uniqueName === '');
          trx.amount = tx.amount;
          trx.particular = tx.particular;

          if (blankIndex > -1) {
            filterdDebitTrx[blankIndex] = trx;
            this.selectedLedger.transactions = [...filterdDebitTrx, ...filterdCrditTrx];
          } else {
            this.selectedLedger.transactions.push(trx);
          }
        }
      });
    }
  }

  public getCategoryNameFromAccount(accountName: string): string {
    let account = find(this.flatternAccountList, (fla) => fla.uniqueName === accountName);
    if (account && account.parentGroups[0]) {
      let parent = account.parentGroups[0];
      if (find(['shareholdersfunds', 'noncurrentliabilities', 'currentliabilities'], p => p === parent.uniqueName)) {
        return 'liabilities';
      } else if (find(['fixedassets', 'noncurrentassets', 'currentassets'], p => p === parent.uniqueName)) {
        return 'assets';
      } else if (find(['revenuefromoperations', 'otherincome'], p => p === parent.uniqueName)) {
        return 'income';
      } else if (find(['operatingcost', 'indirectexpenses'], p => p === parent.uniqueName)) {
        if (accountName === 'roundoff') {
          return 'roundoff';
        }
        let subParent = account.parentGroups[1];
        if (subParent && subParent.uniqueName === 'discount') {
          return 'discount';
        }
        return 'expenses';
      } else {
        return '';
      }
    }
    return '';
  }

  public isValidEntry(accountName: string): boolean {
    return filter(this.selectedLedger.transactions, (trx) => {
      let category = this.getCategoryNameFromAccount(trx.particular.uniqueName);
      return category === 'income' || category === 'expenses';
    }).length <= 1;
  }

  public isItDuplicate(accountUniqueName: string): boolean {
    return filter(this.selectedLedger.transactions, (f => f.particular.uniqueName === accountUniqueName)).length > 1;
  }

  public isThereStockEntry(): boolean {
    return find(this.selectedLedger.transactions,
      (f: ILedgerTransactionItem) => {
        if (f.particular.uniqueName) {
          return (f.selectedAccount && f.selectedAccount.stock) ? true : false;
        }
      }
    ) !== undefined;
  }

  public isThereMoreIncomeOrExpenseEntry(): boolean {
    return filter(this.selectedLedger.transactions, (trx) => {
      if (trx.particular.uniqueName) {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(trx));
        return category === 'income' || category === 'expenses';
      }
    }).length > 1;
  }

  public isThereAssestOrLiabilitiesEntry(): boolean {
    for (let trx of this.selectedLedger.transactions) {
      let category = this.getCategoryNameFromAccount(trx.particular.uniqueName);
      if (category === 'liabilities' || category === 'assets') {
        return true;
      }
    }
    return false;
  }

  public getEntryTotal() {
    this.entryTotal.drTotal = Number(sumBy(this.selectedLedger.transactions, (tr) => {
      if (tr.type === 'DEBIT') {
        return Number(tr.amount);
      }
      return 0;
    }).toFixed(2));
    this.entryTotal.crTotal = Number(sumBy(this.selectedLedger.transactions, (tr) => {
      if (tr.type === 'CREDIT') {
        return Number(tr.amount);
      }
      return 0;
    }).toFixed(2));
  }

  public onTxnAmountChange(txn: ILedgerTransactionItem) {
    if (txn.selectedAccount && txn.selectedAccount.parentGroups.length > 1 && txn.selectedAccount.parentGroups[1].uniqueName === 'discount' && this.discountComponent) {
      this.discountComponent.discountAccountsDetails.map(f => {
        if (f.particular === txn.particular.uniqueName) {
          f.amount = txn.amount;
        }
      });
    }
    this.getEntryTotal();
    this.generateGrandTotal();
    this.generatePanelAmount();
    if (this.discountComponent) {
      this.discountComponent.genTotal();
    }
  }

  // FIXME: fix amount calculation
  public generatePanelAmount() {
    if (this.selectedLedger.transactions && this.selectedLedger.transactions.length) {
      let trx = find(this.selectedLedger.transactions, (t) => {
        return this.getCategoryNameFromAccount(this.getUniqueName(t)) === 'income' || this.getCategoryNameFromAccount(this.getUniqueName(t)) === 'expenses';
      });
      this.totalAmount = trx ? Number(trx.amount) : 0;
    }
  }

  // FIXME: fix total calculation
  public generateGrandTotal() {
    this.grandTotal = Number((this.totalAmount).toFixed(2));
  }

  public getUniqueName(txn: ILedgerTransactionItem) {
    if (txn.selectedAccount && txn.selectedAccount.stock) {
      return txn.particular.uniqueName.split('#')[0];
    }
    return txn.particular.uniqueName;
  }
  // public submitUpdateRequest() {
  //   this._ledgerService.UpdateLedgerTransactions();
  // }
}
