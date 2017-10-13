import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../../shared/theme/select2/index';
import { ITransactionItem, ILedgerDiscount } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { sumBy, find, filter, findIndex } from 'lodash';
import { IOption } from '../../../shared/theme/index';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ToasterService } from '../../../services/toaster.service';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountData, UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';

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

  public blankTransactionItem(type: string = 'DEBIT'): ITransactionItem {
    return {
      amount: 0,
      type,
      particular: {
        name: '',
        uniqueName: ''
      }
    } as ITransactionItem;
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
              let trx: ITransactionItem = this.blankTransactionItem('DEBIT');
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
        }
      });
      // let checkTrxEntryIndex = findIndex(this.selectedLedger.transactions, t => t.particular.uniqueName === 'discount');
      // if (checkTrxEntryIndex > -1) {
      //   this.selectedLedger.transactions[checkTrxEntryIndex].amount = total;
      // } else {
      //   let trx: ITransactionItem = this.blankTransactionItem('DEBIT');
      //   let filterdDebitTrx = this.selectedLedger.transactions.filter(p => p.type === 'DEBIT');
      //   let filterdCrditTrx = this.selectedLedger.transactions.filter(p => p.type === 'CREDIT');
      //   let index = filterdDebitTrx.findIndex(p => p.particular.uniqueName === '');

      //   trx.amount = total;
      //   trx.particular.uniqueName = 'discount';
      //   trx.particular.name = 'discount';

      //   if (index > -1) {
      //     filterdDebitTrx[index] = trx;
      //     this.selectedLedger.transactions = [...filterdDebitTrx, ...filterdCrditTrx];
      //   } else {
      //     this.selectedLedger.transactions.push(trx);
      //   }

      // }
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
          let trx: ITransactionItem = this.blankTransactionItem('DEBIT');
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
    let flag = true;
    if (!this.isItDuplicate(accountName)) {
      // let parentCategory = this.getCategoryNameFromAccount(this.selectedLedger.transactions[0].particular.uniqueName);
      let accountCategory = this.getCategoryNameFromAccount(accountName);
      if (accountCategory === 'income') {
        for (let key of this.selectedLedger.transactions) {
          let keyCategory = this.getCategoryNameFromAccount(key.particular.uniqueName);
          if (keyCategory === 'income' || keyCategory === 'expenses') {
            flag = false;
            this._toasty.warningToast('you can\'t add income | expenses account if expenses account is already added');
            break;
          }
        }
        return flag;
      } else if (accountCategory === 'expenses') {
        for (let key of this.selectedLedger.transactions) {
          let keyCategory = this.getCategoryNameFromAccount(key.particular.uniqueName);
          if (keyCategory === 'income' || this.isThereAssestOrLiabilitiesEntry()) {
            flag = false;
            this._toasty.warningToast('you can\'t add income | same expenses account |  if income account is already added');
            break;
          }
        }
        return flag;
      } else if (accountCategory === 'discount') {
        let filterdArray = this.selectedLedger.transactions.filter(p => {
          let keyCategory = this.getCategoryNameFromAccount(p.particular.uniqueName);
          if (keyCategory === 'income' || keyCategory === 'expenses' || keyCategory === 'roundoff' || keyCategory === 'discount') {
            return true;
          }
          return false;
        });
        if (filterdArray.length > 0) {
          return true;
        } else {
          this._toasty.warningToast('there is no Income/Expense a/c so you can\'t select discout account');
          return false;
        }
      }
      return flag;
    } else {
      this._toasty.warningToast('you can\'t add same account twice');
      return false;
    }
  }

  public isItDuplicate(accountUniqueName: string): boolean {
    return filter(this.selectedLedger.transactions, (f => f.particular.uniqueName === accountUniqueName)).length > 1;
  }

  public isThereStockEntry(): boolean {
    return find(this.selectedLedger.transactions, (f => f.inventory.stock)) !== undefined;
  }

  public isThereIncomeOrExpenseEntry(): boolean {
    for (let trx of this.selectedLedger.transactions) {
      let category = this.getCategoryNameFromAccount(trx.particular.uniqueName);
      if (category === 'income' || category === 'expenses') {
        return true;
      }
    }
    return false;
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
    this.entryTotal.crTotal = 0;
    this.entryTotal.drTotal = 0;
    this.selectedLedger.transactions.forEach((txn) => {
      if (txn.type === 'DEBIT') {
        return this.entryTotal.drTotal += Number(txn.amount);
      } else {
        return this.entryTotal.crTotal += Number(txn.amount);
      }
    });
    // if (this.entryTotal.drTotal > this.entryTotal.crTotal) {
    //   this.entryTotal.reckoning = this.entryTotal.drTotal;
    // } else {
    //   this.entryTotal.reckoning = this.entryTotal.crTotal;
    // }
    // return this.entryTotal;
  }
  public onTxnAmountChange() {
    this.generateGrandTotal();
    this.generatePanelAmount();
  }
  // FIXME: fix amount calculation
  public generatePanelAmount() {
    if (this.selectedLedger.transactions && this.selectedLedger.transactions.length) {
      let creditEntriesSum = sumBy(this.selectedLedger.transactions, (tr) => {
        if (tr.type === 'CREDIT') {
          return Number(tr.amount);
        }
        return 0;
      });
      let debitEntriesSum = sumBy(this.selectedLedger.transactions, (tr) => {
        if (tr.type === 'DEBIT') {
          return Number(tr.amount);
        }
        return 0;
      });
      // let amount = sumBy(this.selectedLedger.transactions, (tr) => Number(tr.amount));
      // let discount = this.selectedLedger.transactions.find(p => p.particular.uniqueName === 'discount');

      this.totalAmount = creditEntriesSum - debitEntriesSum;
      // if (discount) {
      //   this.totalAmount = this.totalAmount - discount.amount;
      // }
    }
  }
  // FIXME: fix total calculation
  public generateGrandTotal() {
    this.grandTotal = this.totalAmount;
  }
}
