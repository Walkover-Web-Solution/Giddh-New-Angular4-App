import { Observable } from 'rxjs';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { cloneDeep, filter, find, sumBy } from '../../../lodash-optimized';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { underStandingTextData } from 'apps/web-giddh/src/app/ledger/underStandingTextData';
import { LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';
import { AccountResponse } from '../../../models/api-models/Account';
import { TaxResponse } from '../../../models/api-models/Company';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../../models/api-models/Sales';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';

export class UpdateLedgerVm {
  public flatternAccountList: IFlattenAccountsResultItem[] = [];
  public flatternAccountList4Select: Observable<IOption[]>;
  public flatternAccountList4BaseAccount: IOption[] = [];
  public companyTaxesList$: Observable<TaxResponse[]>;
  public selectedLedger: LedgerResponse;
  public entryTotal: { crTotal: number, drTotal: number } = {drTotal: 0, crTotal: 0};
  public convertedEntryTotal: { crTotal: number, drTotal: number } = {drTotal: 0, crTotal: 0};
  public grandTotal: number = 0;
  public convertedGrandTotal: number = 0;
  public totalAmount: number = 0;
  public convertedTotalAmount: number = 0;
  public totalForTax: number = 0;
  public compoundTotal: number = 0;
  public convertedCompoundTotal: number = 0;
  public convertedRate?: number = 0;
  public voucherTypeList: IOption[];
  public discountArray: LedgerDiscountClass[] = [];
  public discountTrxTotal: number = 0;
  public convertedDiscountTrxTotal: number = 0;
  public taxTrxTotal: number = 0;
  public convertedTaxTrxTotal: number = 0;
  public appliedTaxPerTotal: number = 0;
  public isInvoiceGeneratedAlready: boolean = false;
  public showNewEntryPanel: boolean = true;
  public selectedTaxes: UpdateLedgerTaxData[] = [];
  public taxRenderData: TaxControlData[] = [];
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

  public handleDiscountEntry(amount: number) {
    this.discountTrxTotal = amount;
    if (this.selectedLedger.transactions) {
      this.selectedLedger.transactions = this.selectedLedger.transactions.filter(f => !f.isDiscount);
      let incomeExpenseEntryIndex = this.selectedLedger.transactions.findIndex((trx: ILedgerTransactionItem) => {
        if (trx.particular.uniqueName) {
          let category = this.getCategoryNameFromAccount(this.getUniqueName(trx));
          return this.isValidCategory(category);
        }
      });
      let discountEntryType = 'CREDIT';
      if (incomeExpenseEntryIndex > -1) {
        discountEntryType = this.selectedLedger.transactions[incomeExpenseEntryIndex].type === 'DEBIT' ? 'CREDIT' : 'DEBIT';
      } else {
        discountEntryType = 'CREDIT';
      }

      this.discountArray.filter(f => f.isActive && f.amount > 0).forEach((dx, index) => {
        let trx: ILedgerTransactionItem = this.blankTransactionItem(discountEntryType);
        if (dx.discountUniqueName) {
          trx.particular.uniqueName = dx.discountUniqueName;
          trx.particular.name = dx.name;
          trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : giddhRoundOff(((dx.discountValue * this.totalAmount) / 100), 2);
          trx.isStock = false;
          trx.isTax = false;
          trx.isDiscount = true;
        } else {
          trx.particular.uniqueName = 'discount';
          trx.particular.name = 'discount';
          trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : giddhRoundOff(((dx.discountValue * this.totalAmount) / 100), 2);
          trx.isStock = false;
          trx.isTax = false;
          trx.isDiscount = true;
        }

        this.selectedLedger.transactions.splice(index, 0, trx);
      });

      this.getEntryTotal();
      this.generateCompoundTotal();
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
    } else if (find(['fixedassets'], p => p === parent.uniqueName)) {
      return 'fixedassets';
    } else if (find(['noncurrentassets', 'currentassets'], p => p === parent.uniqueName)) {
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

  public isValidCategory(category: string): boolean {
    return category === 'income' || category === 'expenses' || category === 'fixedassets';
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
        return this.isValidCategory(category) || trx.inventory;
      }
    }).length;
  }

  public checkDiscountTaxesAllowedOnOpenedLedger(acc: AccountResponse): boolean {
    let allowedUniqueNameArr = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'fixedassets'];
    return allowedUniqueNameArr.indexOf(acc.parentGroups[0].uniqueName) > -1;
  }

  public getEntryTotal() {
    this.entryTotal.drTotal = giddhRoundOff(sumBy(this.selectedLedger.transactions, (tr) => {
      if (tr.type === 'DEBIT') {
        return Number(tr.amount) || 0;
      }
      return 0;
    }), 2);
    this.entryTotal.crTotal = giddhRoundOff(sumBy(this.selectedLedger.transactions, (tr) => {
      if (tr.type === 'CREDIT') {
        return Number(tr.amount) || 0;
      }
      return 0;
    }), 2);
  }

  public onTxnAmountChange(txn: ILedgerTransactionItem) {

    if (!txn.isUpdated) {
      if (this.selectedLedger.taxes.length && !txn.isTax) {
        txn.isUpdated = true;
      }
    }

    this.generatePanelAmount();

    if (this.discountComponent) {
      this.discountComponent.ledgerAmount = this.totalAmount;
      this.discountComponent.change();
    }

    this.getEntryTotal();
    this.generateGrandTotal();
    this.generateCompoundTotal();
  }

  // FIXME: fix amount calculation
  public generatePanelAmount() {
    if (this.selectedLedger.transactions && this.selectedLedger.transactions.length) {
      if (this.stockTrxEntry) {
        this.totalAmount = this.stockTrxEntry.amount;
      } else {
        let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
          let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
          return this.isValidCategory(category);
        });
        this.totalAmount = trx ? Number(trx.amount) : 0;
      }
    }
  }

  public calculateOtherTaxes(modal: SalesOtherTaxesModal) {

    let taxableValue = 0;
    let companyTaxes: TaxResponse[] = [];
    let totalTaxes = 0;

    this.companyTaxesList$.subscribe(taxes => companyTaxes = taxes);

    if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {

      if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
        taxableValue = Number(this.totalAmount) - this.discountTrxTotal;
      } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
        let rawAmount = Number(this.totalAmount) - this.discountTrxTotal;
        taxableValue = (rawAmount + ((rawAmount * this.appliedTaxPerTotal) / 100));
      }

      let tax = companyTaxes.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
      if (tax && tax.taxDetail[0]) {
        this.selectedLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
        totalTaxes += tax.taxDetail[0].taxValue;
      }

      this.selectedLedger.tdsTcsTaxesSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), 2);
    } else {
      this.selectedLedger.tdsTcsTaxesSum = 0;
      this.selectedLedger.isOtherTaxesApplicable = false;
      this.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
    }

    this.selectedLedger.otherTaxModal = modal;
    this.selectedLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
    this.selectedLedger.otherTaxesSum = giddhRoundOff((this.selectedLedger.tdsTcsTaxesSum), 2);
  }

  // FIXME: fix total calculation
  public generateGrandTotal() {
    let taxTotal: number = sumBy(this.selectedTaxes, 'amount') || 0;
    let total = this.totalAmount - this.discountTrxTotal;
    this.appliedTaxPerTotal = taxTotal;
    this.totalForTax = total;
    this.taxTrxTotal = giddhRoundOff(((total * taxTotal) / 100), 2);
    this.grandTotal = giddhRoundOff((total + this.taxTrxTotal), 2);

    this.calculateOtherTaxes(this.selectedLedger.otherTaxModal);
  }

  public generateCompoundTotal() {
    if (this.entryTotal.crTotal > this.entryTotal.drTotal) {
      this.compoundTotal = giddhRoundOff((this.entryTotal.crTotal - this.entryTotal.drTotal), 2);
    } else {
      this.compoundTotal = giddhRoundOff((this.entryTotal.drTotal - this.entryTotal.crTotal), 2);
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
      if (this.stockTrxEntry.amount !== giddhRoundOff(Number(this.totalAmount), 2)) {
        this.stockTrxEntry.isUpdated = true;
      }
      this.stockTrxEntry.amount = giddhRoundOff(Number(this.totalAmount), 2);
      this.stockTrxEntry.inventory.rate = giddhRoundOff((Number(this.totalAmount) / this.stockTrxEntry.inventory.quantity), 2);
    } else {
      // find account that's from category income || expenses || fixedassets
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return this.isValidCategory(category);
      });

      if (trx) {
        trx.amount = giddhRoundOff(Number(this.totalAmount), 2);
        // trx.isUpdated = true;
        // if (trx.amount !== Number(Number(this.totalAmount).toFixed(2))) {
        trx.isUpdated = true;
        // }
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

  public inventoryTotalChanged(event) {
    // if val is typeof string change event should be fired and if not then paste event should be fired
    if (event instanceof ClipboardEvent) {
      let tempVal = event.clipboardData.getData('text/plain');
      if (Number.isNaN(Number(tempVal))) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      this.grandTotal = Number(tempVal);
    } else {
      // key press event
      let e = event as any;

      if (!(typeof this.grandTotal === 'string')) {
        return;
      }
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
    this.totalAmount = giddhRoundOff(Number(((Number(this.grandTotal) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
      (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal)))), 2);

    if (this.stockTrxEntry) {
      this.stockTrxEntry.amount = this.totalAmount;
      const rate = giddhRoundOff(Number(this.stockTrxEntry.amount / this.stockTrxEntry.inventory.quantity), 2);
      this.stockTrxEntry.inventory.rate = rate;
      this.stockTrxEntry.isUpdated = true;

      if (this.discountComponent) {
        this.discountComponent.ledgerAmount = this.totalAmount;
        this.discountComponent.change();
      }
    } else {
      // find account that's from category income || expenses || fixedassets
      let trx: ILedgerTransactionItem = find(this.selectedLedger.transactions, (t) => {
        let category = this.getCategoryNameFromAccount(this.getUniqueName(t));
        return this.isValidCategory(category);
      });
      if (trx) {
        trx.amount = this.totalAmount;
        trx.isUpdated = true;
      }

      if (this.discountComponent) {
        this.discountComponent.ledgerAmount = this.totalAmount;
        this.discountComponent.change();
      }
    }

    this.getEntryTotal();
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
    requestObj.taxes = [...taxes.map(t => t.particular.uniqueName)];

    if (requestObj.isOtherTaxesApplicable) {
      requestObj.taxes.push(requestObj.otherTaxModal.appliedOtherTax.uniqueName);
    }

    requestObj.discounts = discounts.filter(p => p.amount && p.isActive).map(m => {
      m.amount = m.discountValue;
      return m;
    });

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
    this.taxRenderData = [];
    this.selectedTaxes = [];
    this.discountArray = [];
  }
}
