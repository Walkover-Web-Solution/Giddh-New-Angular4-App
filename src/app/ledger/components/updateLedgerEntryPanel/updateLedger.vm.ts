import { Observable } from 'rxjs';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { cloneDeep, filter, find, sumBy } from '../../../lodash-optimized';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { underStandingTextData } from 'app/ledger/underStandingTextData';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';

export class UpdateLedgerVm {
  public flatternAccountList: IFlattenAccountsResultItem[] = [];
  public flatternAccountList4Select: Observable<IOption[]>;
  public selectedLedger: LedgerResponse;
  public selectedLedgerBackup: LedgerResponse;
  public entryTotal: { crTotal: number, drTotal: number } = {drTotal: 0, crTotal: 0};
  public grandTotal: number = 0;
  public totalAmount: number = 0;
  public totalForTax: number = 0;
  public compoundTotal: number = 0;
  public voucherTypeList: IOption[];
  public discountArray: LedgerDiscountClass[] = [];
  public discountTrxTotal: number = 0;
  public isInvoiceGeneratedAlready: boolean = false;
  public showNewEntryPanel: boolean = true;
  public selectedTaxes: UpdateLedgerTaxData[] = [];
  public taxRenderData: TaxControlData[] = [];
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

  public get stockTrxEntry(): ILedgerTransactionItem {
    return find(this.selectedLedger.transactions, (t => !!(t.inventory && t.inventory.stock))) || null;
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

  public handleDiscountEntry() {
    if (this.selectedLedger.transactions) {
      this.selectedLedger.transactions = this.selectedLedger.transactions.filter(f => !f.isDiscount);
      this.discountArray.filter(f => f.isActive && f.amount > 0).forEach((dx, index) => {
        let trx: ILedgerTransactionItem = this.blankTransactionItem('CREDIT');
        if (dx.discountUniqueName) {
          trx.particular.uniqueName = dx.discountUniqueName;
          trx.particular.name = dx.name;
          trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : Number(((dx.amount * this.totalAmount) / 100).toFixed(2));
          trx.isStock = false;
          trx.isTax = false;
          trx.isDiscount = true;
        } else {
          trx.particular.uniqueName = 'discount';
          trx.particular.name = 'discount';
          trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : Number(((dx.amount * this.totalAmount) / 100).toFixed(2));
          trx.isStock = false;
          trx.isTax = false;
          trx.isDiscount = true;
        }

        this.selectedLedger.transactions.splice(index, 0, trx);
      });
    }
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

  public isThereStockEntry(uniqueName: string): boolean {
    // check if entry with same stock added multiple times
    let count: number = this.selectedLedger.transactions.filter(f => f.particular.uniqueName === uniqueName).length;

    if (count > 1) {
      return true;
    }
    // check if is there any stock entry or not
    return find(this.selectedLedger.transactions,
      (f: ILedgerTransactionItem) => {
        if (f.particular.uniqueName && f.particular.uniqueName !== uniqueName) {
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
        return Number(tr.amount) || 0;
      }
      return 0;
    }).toFixed(2));
    this.entryTotal.crTotal = Number(sumBy(this.selectedLedger.transactions, (tr) => {
      if (tr.type === 'CREDIT') {
        return Number(tr.amount) || 0;
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
    // this.reInitilizeDiscount();
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
    // if (this.discountComponent) {
    //   this.discountComponent.genTotal();
    // }
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
        this.totalAmount = trx ? Number(this.selectedLedger.actualAmount) : 0;
      }
    }
  }

  // FIXME: fix total calculation
  public generateGrandTotal() {
    let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
    let total = this.totalAmount - this.discountTrxTotal;
    this.totalForTax = total;
    this.grandTotal = this.manualRoundOff((total + ((total * taxTotal) / 100)));
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

  public inventoryQuantityChanged(val: any) {
    // if val is typeof string change event should be fired and if not then paste event should be fired
    if (typeof val !== 'string') {
      let tempVal = val.clipboardData.getData('text/plain');
      if (Number.isNaN(Number(tempVal))) {
        val.stopImmediatePropagation();
        val.preventDefault();
        return;
      }
      val = tempVal;
    }

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

  public inventoryPriceChanged(val: any) {
    // if val is typeof string change event should be fired and if not then paste event should be fired
    if (typeof val !== 'string') {
      let tempVal = val.clipboardData.getData('text/plain');
      if (Number.isNaN(Number(tempVal))) {
        val.stopImmediatePropagation();
        val.preventDefault();
        return;
      }
      val = tempVal;
    }

    if (Number(val * this.stockTrxEntry.inventory.quantity) !== this.stockTrxEntry.amount) {
      this.stockTrxEntry.isUpdated = true;
    }
    this.stockTrxEntry.amount = Number(val * this.stockTrxEntry.inventory.quantity);
    this.getEntryTotal();
    this.generatePanelAmount();
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public inventoryAmountChanged(event = null) {
    // if val is typeof string change event should be fired and if not then paste event should be fired
    if (event) {
      let tempVal = event.clipboardData.getData('text/plain');
      if (Number.isNaN(Number(tempVal))) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      this.totalAmount = Number(tempVal);
    }

    if (this.stockTrxEntry) {
      if (this.stockTrxEntry.amount !== Number(Number(this.totalAmount).toFixed(2))) {
        this.stockTrxEntry.isUpdated = true;
      }
      this.stockTrxEntry.amount = Number(Number(this.totalAmount).toFixed(2));
      this.stockTrxEntry.inventory.rate = Number((Number(this.totalAmount) / this.stockTrxEntry.inventory.quantity).toFixed(2));
    } else {
      // find account that's from category income || expenses
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return category === 'income' || category === 'expenses';
      });
      trx.amount = Number(Number(this.totalAmount).toFixed(2));
      // trx.isUpdated = true;
      if (trx.amount !== Number(Number(this.totalAmount).toFixed(2))) {
        trx.isUpdated = true;
      }
    }

    this.getEntryTotal();
    // this.generatePanelAmount();

    if (this.discountComponent) {
      this.discountComponent.ledgerAmount = this.totalAmount;
      this.discountComponent.change();
    }

    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public inventoryTotalChanged(event = null) {
    // if val is typeof string change event should be fired and if not then paste event should be fired
    if (event) {
      let tempVal = event.clipboardData.getData('text/plain');
      if (Number.isNaN(Number(tempVal))) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      this.grandTotal = Number(tempVal);
    }

    let fixDiscount = 0;
    let percentageDiscount = 0;

    if (this.discountComponent) {
      percentageDiscount = this.discountComponent.discountAccountsDetails.filter(f => f.isActive)
        .filter(s => s.discountType === 'PERCENTAGE')
        .reduce((pv, cv) => {
          return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;

      fixDiscount = this.discountComponent.discountAccountsDetails.filter(f => f.isActive)
        .filter(s => s.discountType === 'FIX_AMOUNT')
        .reduce((pv, cv) => {
          return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
    }

    let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
    this.totalAmount = this.manualRoundOff(Number(((Number(this.grandTotal) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
      (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal)))));

    if (this.stockTrxEntry) {
      this.stockTrxEntry.amount = this.totalAmount;
      const rate = Number(Number(this.stockTrxEntry.amount / this.stockTrxEntry.inventory.quantity).toFixed(2));
      this.stockTrxEntry.inventory.rate = rate;
      this.stockTrxEntry.isUpdated = true;

      if (this.discountComponent) {
        this.discountComponent.ledgerAmount = this.totalAmount;
        this.discountComponent.change();
      }
    } else {
      // find account that's from category income || expenses
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return category === 'income' || category === 'expenses';
      });
      trx.amount = this.totalAmount;
      trx.isUpdated = true;

      if (this.discountComponent) {
        this.discountComponent.ledgerAmount = this.totalAmount;
        this.discountComponent.change();
      }
    }

    this.getEntryTotal();
    // this.generatePanelAmount();
    // this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public unitChanged(stockUnitCode: string) {
    let unit = this.stockTrxEntry.unitRate.find(p => p.stockUnitCode === stockUnitCode);
    this.stockTrxEntry.inventory.unit = {code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode};
    this.stockTrxEntry.inventory.rate = this.stockTrxEntry.inventory.unit.rate;
    this.inventoryPriceChanged(Number(this.stockTrxEntry.inventory.unit.rate));
  }

  public taxTrxUpdated(taxes: UpdateLedgerTaxData[]) {
    this.selectedTaxes = taxes;
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  public reInitilizeDiscount(resp: LedgerResponse) {
    let discountArray: LedgerDiscountClass[] = [];
    let defaultDiscountIndex = resp.discounts.findIndex(f => !f.discount.uniqueName);

    if (defaultDiscountIndex > -1) {
      discountArray.push({
        discountType: resp.discounts[defaultDiscountIndex].discount.discountType,
        amount: resp.discounts[defaultDiscountIndex].amount,
        discountValue: resp.discounts[defaultDiscountIndex].discount.discountValue,
        discountUniqueName: resp.discounts[defaultDiscountIndex].discount.uniqueName,
        name: resp.discounts[defaultDiscountIndex].discount.name,
        particular: resp.discounts[defaultDiscountIndex].account.uniqueName,
        isActive: true
      });
    } else {
      discountArray.push({
        discountType: 'FIX_AMOUNT',
        amount: 0,
        name: '',
        particular: '',
        isActive: true,
        discountValue: 0
      });
    }

    resp.discounts.forEach((f, index) => {
      if (index !== defaultDiscountIndex) {
        discountArray.push({
          discountType: f.discount.discountType,
          amount: f.discount.discountValue,
          name: f.discount.name,
          particular: f.account.uniqueName,
          isActive: true,
          discountValue: f.discount.discountValue,
          discountUniqueName: f.discount.uniqueName
        });
      }
    });
    this.discountArray = discountArray;
  }

  public prepare4Submit(): LedgerResponse {
    let requestObj: any = cloneDeep(this.selectedLedger);
    let discounts: LedgerDiscountClass[] = cloneDeep(this.discountArray);
    let taxes: UpdateLedgerTaxData[] = cloneDeep(this.selectedTaxes);
    requestObj.voucherType = requestObj.voucher.shortCode;
    requestObj.transactions = requestObj.transactions ? requestObj.transactions.filter(p => p.particular.uniqueName && !p.isDiscount) : [];
    requestObj.generateInvoice = this.selectedLedger.generateInvoice;
    requestObj.transactions.map(trx => {
      if (trx.inventory && trx.inventory.stock) {
        trx.particular.uniqueName = trx.particular.uniqueName.split('#')[0];
      }
    });
    requestObj.taxes = taxes.map(t => t.particular.uniqueName);
    requestObj.discounts = discounts.filter(p => p.amount && p.isActive);

    this.getEntryTotal();
    requestObj.total = this.entryTotal.drTotal - this.entryTotal.crTotal;
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

  public manualRoundOff(num: number) {
    return Math.round(num * 100) / 100;
  }
}
