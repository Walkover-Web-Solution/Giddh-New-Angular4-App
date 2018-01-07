import { Observable } from 'rxjs/Observable';
import { ILedgerDiscount, ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { cloneDeep, filter, find, findIndex, sumBy, uniq } from '../../../lodash-optimized';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent, UpdateLedgerDiscountData } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { underStandingTextData } from 'app/ledger/underStandingTextData';
import { GroupsWithAccountsResponse } from 'app/models/api-models/GroupsWithAccounts';

export class UpdateLedgerVm {
  public flatternAccountList: IFlattenAccountsResultItem[] = [];
  public flatternAccountList4Select: Observable<IOption[]>;
  public selectedLedger: LedgerResponse;
  public selectedLedgerBackup: LedgerResponse;
  public entryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
  public grandTotal: number = 0;
  public totalAmount: number = 0;
  public compoundTotal: number = 0;
  public voucherTypeList: IOption[];
  public discountArray: ILedgerDiscount[] = [];
  public isInvoiceGeneratedAlready: boolean = false;
  public showNewEntryPanel: boolean = true;
  public selectedTaxes: UpdateLedgerTaxData[] = [];
  public taxRenderData: TaxControlData[] = [];

  public get stockTrxEntry(): ILedgerTransactionItem {
    return find(this.selectedLedger.transactions, (t => !!(t.inventory && t.inventory.stock))) || null;
  }

  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public discountComponent: UpdateLedgerDiscountComponent;
  public ledgerUnderStandingObj = {
    accountType: '',
    text: {
      cr: '',
      dr: ''
    },
    balanceText: {
      cr: '',
      dr: ''
    }
  };

  constructor() {
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
              if (dx.amount !== this.selectedLedger.transactions[checkTrxEntryIndex].amount) {
                this.selectedLedger.transactions[checkTrxEntryIndex].isUpdated = true;
              }
              this.selectedLedger.transactions[checkTrxEntryIndex].amount = dx.amount;
            } else {
              this.selectedLedger.transactions.splice(checkTrxEntryIndex, 1);
            }
          } else {
            if (dx.amount > 0) {
              let trx: ILedgerTransactionItem = this.blankTransactionItem('CREDIT');
              let filterdDebitTrx = this.selectedLedger.transactions.filter(p => p.type === 'DEBIT');
              let filterdCrditTrx = this.selectedLedger.transactions.filter(p => p.type === 'CREDIT');
              let index = filterdDebitTrx.findIndex(p => p.particular.uniqueName === '' || undefined || null);

              trx.amount = dx.amount;
              trx.particular = dx.particular;
              trx.isUpdated = true;
              if (index > -1) {
                filterdDebitTrx[index] = trx;
                this.selectedLedger.transactions = [...filterdDebitTrx, ...filterdCrditTrx];
              } else {
                this.selectedLedger.transactions.push(trx);
              }
            }
          }
        } else {
          this.reInitilizeDiscount();
        }
      });
    }
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
    return;
  }

  public getCategoryNameFromAccount(accountName: string): string {
    let categoryName = '';
    let account = find(this.flatternAccountList, (fla) => fla.uniqueName === accountName);
    if (account && account.parentGroups[0]) {
      categoryName = this.accountCatgoryGetterFunc(account, accountName);
    } else {
      let flatterAccounts: IFlattenAccountsResultItem[] = this.flatternAccountList;
      flatterAccounts.map(fa => {
        if (fa.mergedAccounts !== '') {
          let tempMergedAccounts = fa.mergedAccounts.split(',').map(mm => mm.trim());
          if (tempMergedAccounts.indexOf(accountName) > -1) {
            categoryName = this.accountCatgoryGetterFunc(fa, accountName);
            if (categoryName) {
              return categoryName;
            }
          }
        }
      });

    }
    return categoryName;
  }

  public accountCatgoryGetterFunc(account, accountName): string {
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

  public isValidEntry(accountName: string): boolean {
    return filter(this.selectedLedger.transactions, (trx) => {
      let category = this.getCategoryNameFromAccount(trx.particular.uniqueName);
      return category === 'income' || category === 'expenses';
    }).length <= 1;
  }

  public isThereStockEntry(): boolean {
    return find(this.selectedLedger.transactions,
      (f: ILedgerTransactionItem) => {
        if (f.particular.uniqueName) {
          return !!(f.inventory && f.inventory.stock);
        }
      }
    ) !== undefined;
  }

  public isThereIncomeOrExpenseEntry(): number {
    return filter(this.selectedLedger.transactions, (trx: ILedgerTransactionItem) => {
      if (trx.particular.uniqueName) {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(trx));
        return (category === 'income' || category === 'expenses') || trx.inventory;
      }
    }).length;
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
    if (!txn.isUpdated) {
      if (this.selectedLedger.taxes.length && !txn.isTax) {
        txn.isUpdated = true;
      }
    }
    this.reInitilizeDiscount();
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
    if (this.discountComponent) {
      this.discountComponent.genTotal();
    }
  }

  // FIXME: fix amount calculation
  public generatePanelAmount() {
    if (this.selectedLedger.transactions && this.selectedLedger.transactions.length) {
      if (this.stockTrxEntry) {
        this.totalAmount = this.stockTrxEntry.amount;
      } else {
        let trx = find(this.selectedLedger.transactions, (t) => {
          let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
          return category === 'income' || category === 'expenses';
        });
        this.totalAmount = trx ? Number(trx.amount) : 0;
      }
    }
  }

  // FIXME: fix total calculation
  public generateGrandTotal() {
    let discountTrxTotal: number = sumBy(this.selectedLedger.transactions, (t: ILedgerTransactionItem) => {
      return this.getCategoryNameFromAccount(t.particular.uniqueName) === 'discount' ? t.amount : 0;
    }) || 0;
    let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
    let total = this.totalAmount - discountTrxTotal;
    this.grandTotal = Number((total + ((total * taxTotal) / 100)).toFixed(2));
  }

  public generateCompoundTotal() {
    if (this.entryTotal.crTotal > this.entryTotal.drTotal) {
      this.compoundTotal = Number((this.entryTotal.crTotal - this.entryTotal.drTotal).toFixed(2));
    } else {
      this.compoundTotal = Number((this.entryTotal.drTotal - this.entryTotal.crTotal).toFixed(2));
    }
  }

  public getUniqueName(txn: ILedgerTransactionItem) {
    if ((txn.selectedAccount && txn.selectedAccount.stock)) {
      return txn.particular.uniqueName.split('#')[0];
    } else if (txn.inventory && txn.inventory.stock) {
      return txn.particular.uniqueName.split('#')[0];
    }
    return txn.particular.uniqueName;
  }

  public inventoryQuantityChanged(val: number) {
    if (Number(this.stockTrxEntry.inventory.rate * val) !== this.stockTrxEntry.amount) {
      this.stockTrxEntry.isUpdated = true;
    }
    this.stockTrxEntry.amount = Number(this.stockTrxEntry.inventory.rate * val);
    this.stockTrxEntry.inventory.unit.rate = this.stockTrxEntry.amount;
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public inventoryPriceChanged(val: number) {
    if (Number(val * this.stockTrxEntry.inventory.quantity) !== this.stockTrxEntry.amount) {
      this.stockTrxEntry.isUpdated = true;
    }
    this.stockTrxEntry.amount = Number(val * this.stockTrxEntry.inventory.quantity);
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public inventoryAmountChanged(val: string) {
    if (this.stockTrxEntry) {
      if (this.stockTrxEntry.amount !== Number(Number(val).toFixed(2))) {
        this.stockTrxEntry.isUpdated = true;
      }
      this.stockTrxEntry.amount = Number(Number(val).toFixed(2));
      this.stockTrxEntry.inventory.rate = Number(Number(val) / this.stockTrxEntry.inventory.quantity);
    } else {
      // find account that's from category income || expenses
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return category === 'income' || category === 'expenses';
      });
      trx.amount = Number(Number(val).toFixed(2));
      // trx.isUpdated = true;
      if (trx.amount !== Number(Number(val).toFixed(2))) {
        trx.isUpdated = true;
      }
    }
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public inventoryTotalChanged() {
    let discountTrxTotal: number = sumBy(this.selectedLedger.transactions, (t: ILedgerTransactionItem) => {
      return this.getCategoryNameFromAccount(t.particular.uniqueName) === 'discount' ? t.amount : 0;
    }) || 0;
    let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
    let total = ((this.grandTotal * 100) + (100 + taxTotal)
      * discountTrxTotal);
    let finalTotal = Number((total / (100 + taxTotal)).toFixed(2));

    if (this.stockTrxEntry) {
      this.stockTrxEntry.amount = Number(Number(finalTotal).toFixed(2));
      this.stockTrxEntry.inventory.rate = this.stockTrxEntry.amount;
      this.stockTrxEntry.isUpdated = true;
    } else {
      // find account that's from category income || expenses
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return category === 'income' || category === 'expenses';
      });
      trx.amount = Number(Number(finalTotal).toFixed(2));
      trx.isUpdated = true;
    }
    this.getEntryTotal();
    this.generatePanelAmount();
    // this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public unitChanged(stockUnitCode: string) {
    let unit = this.stockTrxEntry.unitRate.find(p => p.stockUnitCode === stockUnitCode);
    this.stockTrxEntry.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
    this.stockTrxEntry.inventory.rate = this.stockTrxEntry.inventory.unit.rate;
    this.inventoryPriceChanged(Number(this.stockTrxEntry.inventory.unit.rate));
  }

  public taxTrxUpdated(taxes: UpdateLedgerTaxData[]) {
    this.selectedTaxes = taxes;
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public reInitilizeDiscount() {
    this.discountArray.map(d => {
      let discountRecord = find(this.selectedLedger.transactions, t => t.particular.uniqueName === d.particular);
      if (discountRecord) {
        d.amount = Number(discountRecord.amount);
      } else {
        d.amount = 0;
      }
    });
    if (this.discountComponent) {
      this.discountComponent.genTotal();
    }
  }

  public prepare4Submit(): LedgerResponse {
    let requestObj: LedgerResponse = cloneDeep(this.selectedLedger);
    let taxes: UpdateLedgerTaxData[] = cloneDeep(this.selectedTaxes);
    requestObj.voucherType = requestObj.voucher.shortCode;
    requestObj.transactions = requestObj.transactions.filter(p => p.particular.uniqueName);
    requestObj.generateInvoice = this.selectedLedger.generateInvoice;
    requestObj.transactions.map(trx => {
      if (trx.inventory && trx.inventory.stock) {
        trx.particular.uniqueName = trx.particular.uniqueName.split('#')[0];
      }
    });
    requestObj.taxes = taxes.map(t => t.particular.uniqueName);
    return requestObj;
  }

  public getUnderstandingText(selectedLedgerAccountType, accountName) {
    let data = _.cloneDeep(underStandingTextData.find(p => p.accountType === selectedLedgerAccountType));
    if (data) {
      data.balanceText.cr = data.balanceText.cr.replace('<accountName>', accountName);
      data.balanceText.dr = data.balanceText.dr.replace('<accountName>', accountName);

      data.text.dr = data.text.dr.replace('<accountName>', accountName);
      data.text.cr = data.text.cr.replace('<accountName>', accountName);
      this.ledgerUnderStandingObj = _.cloneDeep(data);
    }
  }
  public resetVM() {
    this.selectedLedger = null;
    this.selectedLedgerBackup = null;
    this.taxRenderData = [];
    this.selectedTaxes = [];
    this.discountArray = [];
  }
}
