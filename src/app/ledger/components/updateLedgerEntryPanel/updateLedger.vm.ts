import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../../shared/theme/select2/index';
import { ITransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { sumBy, find, filter } from 'lodash';
import { IOption } from '../../../shared/theme/index';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ToasterService } from '../../../services/toaster.service';

export class UpdateLedgerVm {
  public flatternAccountList: IFlattenAccountsResultItem[] = [];
  public flatternAccountList4Select2: Observable<Select2OptionData[]>;
  public selectedLedger: LedgerResponse;
  public entryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
  public grandTotal: number = 0;
  public totalAmount: number = 0;
  public voucherTypeList: IOption[];
  constructor(private _toasty: ToasterService) {
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
    if (!this.isItDuplicate(accountName)) {
      let parentCategory = this.getCategoryNameFromAccount(this.selectedLedger.transactions[0].particular.uniqueName);
      let accountCategory = this.getCategoryNameFromAccount(accountName);
      if (parentCategory && accountCategory) {
        return this.validCategory(accountCategory, accountName, parentCategory);
      }
      return false;
    } else {
      this._toasty.warningToast('you can\'t add same account twice');
      return false;
    }
  }

  public validCategory(accountCategoryName: string, accountUniqueName: string, parentCategoryName: string) {
    switch (parentCategoryName) {
      case 'assets':
        return false;
      case 'liabilities':
        return false;
      case 'income':
        if (accountCategoryName === 'income' || accountCategoryName === 'expenses') {
          this._toasty.warningToast('you can\'t add income | expenses category account in income category');
          return false;
        } else if (accountCategoryName === 'roundoff' || accountCategoryName === 'discount') {
          return true;
        }
        return false;
      case 'expenses':
        if (accountCategoryName === 'income') {
          this._toasty.warningToast('you can\'t add income | expenses category account in expenses category');
          return false;
        }
        return true;
      case 'roundoff':
        if (accountCategoryName === 'income') {
          return true;
        } else {
          return false;
        }
      case 'discount':
        if (accountCategoryName === 'income') {
          return true;
        } else {
          return false;
        }
      default:
        this._toasty.errorToast('this category account is not allowed');
        return false;
    }
  }

  public isItDuplicate(accountUniqueName: string): boolean {
    return filter(this.selectedLedger.transactions, (f => f.particular.uniqueName === accountUniqueName)).length > 1;
  }

  public isThereStockEntry(): boolean {
    return find(this.selectedLedger.transactions, (f => f.inventory.stock)) !== undefined;
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
    this.getPanelAmount();
  }
  public getPanelAmount() {
    this.totalAmount = sumBy(this.selectedLedger.transactions, (tr) => Number(tr.amount));
  }
  public generateGrandTotal() {
    this.grandTotal = sumBy(this.selectedLedger.transactions, (tr) => Number(tr.amount));
  }
}
