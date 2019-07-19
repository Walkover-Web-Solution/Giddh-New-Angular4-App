import * as _ from '../../lodash-optimized';
import { isNull, pick } from '../../lodash-optimized';
import { IInvoiceTax } from './Invoice';
import { LedgerDiscountClass } from './SettingsDiscount';
import { LedgerResponseDiscountClass } from './Ledger';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';

/**
 * IMP by dude
 * do not change
 * changing below const breaks the generate functionality
 */
export const VOUCHER_TYPE_LIST: any[] = [
  {
    value: 'Sales',
    label: 'Sales',
    additional: {
      label: 'Invoice'
    }
  },
  {
    value: 'Credit Note',
    label: 'Credit Note',
    additional: {
      label: 'Credit Note'
    }
  },
  {
    value: 'Debit Note',
    label: 'Debit Note',
    additional: {
      label: 'Debit Note'
    }
  },
  {
    value: 'Purchase',
    label: 'Purchase',
    additional: {
      label: 'Purchase'
    }
  }
];

/*
RECEIPT("receipt"),
JOURNAL("journal"),
PURCHASE("purchase"),
PAYMENT("payment"),
CONTRA("contra"),
SALES("sales"),
DEBIT_NOTE("debit note"),
CREDIT_NOTE("credit note")
*/

export interface IStockUnit {
  text: string;
  id: string;
  rate?: number;
}

export interface IForceClear {
  status: boolean;
}

/**
 * draw invoice on ui and api model related class and interface
 */
class CompanyDetailsClass {
  public name: string;
  public gstNumber: string;
  public address: string[];
  public stateCode: string;
  public panNumber: string;
}

class SignatureClass {
  public name: string;
  public data: string;
  public path: string;
}

export class GstDetailsClass {
  public gstNumber?: any;
  public address: string[];
  public stateCode?: any;
  public panNumber?: any;

  constructor() {
    this.address = [];
  }
}

export class AccountDetailsClass {
  public name: string;
  public uniqueName: string;
  public data?: string[];
  public address?: string[];
  public attentionTo: string;
  public email: string;
  public mobileNumber?: any;
  public mobileNo?: any;
  public billingDetails: GstDetailsClass;
  public shippingDetails: GstDetailsClass;
  public country?: CountryClass;

  constructor(attrs?: any) {
    this.country = new CountryClass();
    this.billingDetails = new GstDetailsClass();
    this.shippingDetails = new GstDetailsClass();
    if (attrs) {
      Object.assign(this, pick(attrs, ['name', 'uniqueName', 'attentionTo', 'email', 'country']));
      this.mobileNumber = attrs.mobileNo;
      if (attrs.addresses.length > 0) {
        let str = isNull(attrs.addresses[0].address) ? '' : attrs.addresses[0].address;
        // set billing
        this.billingDetails.address = [];
        this.billingDetails.address.push(str);
        this.billingDetails.stateCode = attrs.addresses[0].stateCode;
        this.billingDetails.gstNumber = attrs.addresses[0].gstNumber;
        // set shipping
        this.shippingDetails.address = [];
        this.shippingDetails.address.push(str);
        this.shippingDetails.stateCode = attrs.addresses[0].stateCode;
        this.shippingDetails.gstNumber = attrs.addresses[0].gstNumber;
      }
    } else {
      this.attentionTo = null;
      this.email = null;
      this.mobileNo = null;
    }
  }
}

class ICommonItemOfTransaction {
  public amount: number;
  public convertedAmount: number;
  public accountUniqueName: string;
  public accountName: string;
}

export class FakeDiscountItem {
  public amount: number;
  public particular: string;
  public name: string;
}

export interface ITaxList {
  name: string;
  uniqueName: string;
  amount: number;
  isChecked: boolean;
  isDisabled?: boolean;
  type?: string;
}

export class SalesTransactionItemClass extends ICommonItemOfTransaction {
  public discount: any[];
  public hsnOrSac: string;
  public hsnNumber: string;
  public sacNumber: string;
  public description: string;
  public quantity: number;
  public stockUnit: string;
  public rate: number;
  public date: any;
  public taxableValue: number;
  public total?: number;
  public fakeAccForSelect2?: string;
  public isStockTxn?: boolean;
  public stockDetails?: any;
  public stockList?: IStockUnit[] = [];
  public applicableTaxes: string[] = [];
  public taxRenderData: ITaxList[] = [];

  constructor() {
    super();
    this.amount = 0;
    this.total = 0;
    this.isStockTxn = false;
    this.hsnOrSac = 'hsn';
    this.taxableValue = 0;
  }

  // basic check for valid transaction
  public isValid() {
    let r: any = true;
    // Arpit: Sagar told me to remove this check
    // if (this.taxableValue === 0) {
    //   r = 'Without Taxable sales-invoice can\'t be generated';
    // }
    if (this.accountUniqueName) {
      if (_.isEmpty(this.accountUniqueName)) {
        r = 'Product/Service can\'t be empty';
      }
    } else {
      r = 'Product/Service can\'t be empty';
    }
    return r;
  }

  public setAmount(entry: SalesEntryClass) {
    // delaying due to ngModel change
    setTimeout(() => {
      this.taxableValue = this.getTaxableValue(entry);
      let tax = this.getTotalTaxOfEntry(entry.taxes);
      this.total = this.getTransactionTotal(tax, entry);
    }, 500);
  }

  public getTotalTaxOfEntry(taxArr: IInvoiceTax[]): number {
    let count: number = 0;
    if (taxArr.length > 0) {
      _.forEach(taxArr, (item: IInvoiceTax) => {
        count += item.amount;
      });
      return this.checkForInfinity(count);
    } else {
      return count;
    }
  }

  public checkForInfinity(value): number {
    return (value === Infinity) ? 0 : value;
  }

  public getTransactionTotal(tax: number, entry: SalesEntryClass): number {
    let count: number = 0;
    if (tax > 0) {
      let a = this.getTaxableValue(entry) * (tax / 100);
      a = this.checkForInfinity(a);
      let b = _.cloneDeep(this.getTaxableValue(entry));
      count = a + b;
    } else {
      count = _.cloneDeep(this.getTaxableValue(entry));
    }
    return giddhRoundOff(count, 2);
  }

  /**
   * @param entry: SalesEntryClass object
   * @return taxable value after calculation
   * @scenerio one -- without stock entry -- amount - discount = taxableValue
   * @scenerio two -- stock entry { rate*qty -(discount) = taxableValue}
   */
  public getTaxableValue(entry: SalesEntryClass): number {
    let count: number = 0;
    if (this.quantity && this.rate) {
      this.amount = this.rate * this.quantity;
      count = this.checkForInfinity((this.rate * this.quantity) - entry.discountSum);
    } else {
      count = this.checkForInfinity(this.amount - entry.discountSum);
    }
    return count;
  }

  /**
   * @return numeric value
   * @param discountArr collection of discount items
   */
  public getTotalDiscount(discountArr: LedgerDiscountClass[]) {
    let count: number = 0;
    if (discountArr.length > 0) {
      _.forEach(discountArr, (item: ICommonItemOfTransaction) => {
        count += Math.abs(item.amount);
      });
    }
    return count;
  }
}

class IRoundOff {
  public transaction: SalesTransactionItemClass;
  public uniqueName: string;
  public isTransaction: boolean;
  public balanceType: string;
}

export class SalesEntryClass {
  public uniqueName: string;
  public discounts: LedgerDiscountClass[];
  public tradeDiscounts?: LedgerResponseDiscountClass[];
  public taxes: IInvoiceTax[];
  public transactions: SalesTransactionItemClass[];
  public description: string;
  public taxableValue: number;
  public discountTotal: number;
  public nonTaxableValue: number;
  public entryDate: any;
  public taxList?: string[];
  public voucherType: string;
  public entryTotal: number;
  public taxSum?: number;
  public discountSum?: number;
  public attachedFile?: string;
  public attachedFileName?: string;
  public isNewEntryInUpdateMode?: boolean;
  public isOtherTaxApplicable: boolean = false;
  public otherTaxSum: number;
  public otherTaxType: 'tcs' | 'tds';
  public cessSum: number;
  public otherTaxModal: SalesOtherTaxesModal;
  public tcsCalculationMethod: SalesOtherTaxesCalculationMethodEnum;
  public tcsTaxList?: string[];
  public tdsTaxList?: string[];

  constructor() {
    this.transactions = [new SalesTransactionItemClass()];
    this.taxes = [];
    this.taxList = [];
    this.discounts = [this.staticDefaultDiscount()];
    this.taxSum = 0;
    this.discountSum = 0;
    this.isOtherTaxApplicable = false;
    this.otherTaxSum = 0;
    this.otherTaxType = 'tcs';
    this.otherTaxModal = new SalesOtherTaxesModal();
    this.cessSum = 0;
  }

  public staticDefaultDiscount(): LedgerDiscountClass {
    return {
      discountType: 'FIX_AMOUNT',
      amount: 0,
      name: '',
      particular: '',
      isActive: true
    };
  }
}

class ITotaltaxBreakdown {
  public amount: number;
  public visibleTaxRate: number;
  public accountName: string;
  public accountUniqueName: string;
  public hasError: boolean;
  public taxRate: number;
  public errorMessage: string;
}

class CountryClass {
  public countryName: string;
  public countryCode: string;

  constructor(attrs?: any) {
    if (attrs) {
      return Object.assign({}, this, attrs);
    }
  }
}

export class OtherSalesItemClass {
  public shippingDate: any;
  public shippedVia: string;
  public trackingNumber: string;
  public customField1: string;
  public customField2: string;
  public customField3: string;
  public message1?: string;
  public message2?: string;
  public slogan?: any;

  constructor() {
    this.shippingDate = null;
    this.shippedVia = null;
    this.trackingNumber = null;
    this.customField1 = null;
    this.customField2 = null;
    this.customField3 = null;
    // this.message2 = null;
  }
}

/**
 * end draw invoice on ui and api model related class and interface
 */

// generate sales interface

interface IPaymentAction {
  action: string;
  amount: number;
}

/**
 * Generic request class to generate sales, credit note, debit note
 */

export interface GenericRequestForGenerateSCD {
  entryUniqueNames?: string[];
  taxes?: string[];
  voucher: VoucherClass;
  updateAccountDetails?: boolean;
  paymentAction?: IPaymentAction;
  depositAccountUniqueName?: string;
}

class VoucherDetailsClass {
  public voucherNumber?: string;
  public voucherDate?: any;
  public dueDate?: any;
  public balance?: any;
  public balanceDue?: number;
  public balanceStatus?: string;
  public totalAsWords: string;
  public grandTotal: number;
  public subTotal: number;
  public totalDiscount?: any;
  public gstTaxesTotal?: any;
  public totalTaxableValue?: number;
  public customerName?: any;
  public tempCustomerName?: any;
  public voucherType?: string;
  public tcsTotal?: number;
  public tdsTotal?: number;
  public cessTotal?: number;

  constructor() {
    this.customerName = null;
    this.grandTotal = null;
    this.subTotal = null;
    this.totalAsWords = null;
    this.voucherDate = null;
    this.cessTotal = 0;
    this.tdsTotal = 0;
    this.tcsTotal = 0;
  }
}

class TemplateDetailsClass {
  public logoPath: string;
  public other: OtherSalesItemClass;
  public templateUniqueName: string;

  constructor() {
    this.other = new OtherSalesItemClass();
  }
}

export class VoucherClass {
  public voucherDetails: VoucherDetailsClass;
  public companyDetails: CompanyDetailsClass;
  public accountDetails: AccountDetailsClass;
  public templateDetails: TemplateDetailsClass;
  public entries: SalesEntryClass[];
  public depositEntryToBeUpdated?: SalesEntryClass;
  public depositAccountUniqueName: string;

  constructor() {
    this.accountDetails = new AccountDetailsClass();
    this.entries = [new SalesEntryClass()];
    this.voucherDetails = new VoucherDetailsClass();
    this.templateDetails = new TemplateDetailsClass();
  }
}

export enum SalesOtherTaxesCalculationMethodEnum {
  OnTaxableAmount = 'OnTaxableAmount',
  OnTotalAmount = 'OnTotalAmount'
}

export class SalesOtherTaxesModal {
  appliedOtherTax: INameUniqueName;
  tcsCalculationMethod: SalesOtherTaxesCalculationMethodEnum = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
  itemLabel: string;
}
