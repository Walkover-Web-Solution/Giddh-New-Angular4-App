import * as _ from '../../lodash-optimized';
import { isNull, pick } from '../../lodash-optimized';
import { LedgerDiscountClass } from './SettingsDiscount';
import { LedgerResponseDiscountClass } from './Ledger';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { TaxControlData } from '../../theme/tax-control/tax-control.component';
import * as moment from 'moment';


export enum VoucherTypeEnum {
  'sales' = 'sales',
  'purchase' = 'purchase',
  'debitNote' = 'debit note',
  'creditNote' = 'credit note',
  'proforma' = 'proforma',
  'generateProforma' = 'proformas',
  'estimate' = 'estimate',
  'generateEstimate' = 'estimates',
  'cash' = 'cash'
}

export enum ActionTypeAfterGenerateVoucher {
  generate,
  generateAndClose,
  generateAndSend,
  generateAndPrint,
  generateAndRecurring
}

/**
 * IMP by dude
 * do not change
 * changing below const breaks the generate functionality
 */
export const VOUCHER_TYPE_LIST: any[] = [
  {
    value: VoucherTypeEnum.sales,
    label: 'Sales',
    additional: {
      label: 'Invoice'
    }
  },
  {
    value: VoucherTypeEnum.creditNote,
    label: 'Credit Note',
    additional: {
      label: 'Credit Note'
    }
  },
  {
    value: VoucherTypeEnum.debitNote,
    label: 'Debit Note',
    additional: {
      label: 'Debit Note'
    }
  },
  {
    value: VoucherTypeEnum.purchase,
    label: 'Purchase',
    additional: {
      label: 'Purchase'
    }
  },
  {
    value: VoucherTypeEnum.generateProforma,
    label: 'Proformas',
    additional: {
      label: 'Proformas'
    }
  },
  {
    value: VoucherTypeEnum.generateEstimate,
    label: 'Estimates',
    additional: {
      label: 'Estimates'
    }
  }
];

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
    return !!this.accountUniqueName;
  }

  public setAmount(entry: SalesEntryClass) {
    this.taxableValue = this.getTaxableValue(entry);
    let tax = this.getTotalTaxOfEntry(entry.taxes);
    this.total = this.getTransactionTotal(tax, entry);
  }

  public getTotalTaxOfEntry(taxArr: TaxControlData[]): number {
    let count: number = 0;
    if (taxArr.length > 0) {
      _.forEach(taxArr, (item: TaxControlData) => {
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
}

export class SalesEntryClass {
  public uniqueName: string;
  public discounts: LedgerDiscountClass[];
  public tradeDiscounts?: LedgerResponseDiscountClass[];
  public taxes: TaxControlData[];
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
    this.entryDate = moment();
    this.taxes = [];
    this.taxList = [];
    this.discounts = [this.staticDefaultDiscount()];
    this.tradeDiscounts = [];
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
  isEcommerceInvoice?: boolean;
  validateTax?: boolean;
  applyApplicableTaxes?: boolean;
  action?: string;
  dueDate?: string;
  oldVersions?: any[];
}

class VoucherDetailsClass {
  public voucherNumber?: string;
  public proformaNumber?: string;
  public estimateNumber?: string;
  public voucherDate?: any;
  public proformaDate?: any;
  public estimateDate?: any;
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
  public customerUniquename?: any;
  public tempCustomerName?: any;
  public voucherType?: string;
  public tcsTotal?: number;
  public tdsTotal?: number;
  public cessTotal?: number;
  public taxesTotal?: [];

  constructor() {
    this.customerName = null;
    this.grandTotal = 0;
    this.subTotal = 0;
    this.totalAsWords = null;
    this.totalDiscount = 0;
    this.totalTaxableValue = 0;
    this.gstTaxesTotal = 0;
    this.voucherDate = null;
    this.balanceDue = 0;
    this.cessTotal = 0;
    this.tdsTotal = 0;
    this.tcsTotal = 0;
    this.balanceDue = 0;
  }
}

export class TemplateDetailsClass {
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
  public depositEntry?: SalesEntryClass; // depreciated but using for old data
  public depositEntryToBeUpdated?: SalesEntryClass;
  public depositAccountUniqueName: string;
  public templateUniqueName?: string;

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

export class SalesAddBulkStockItems {
  name: string;
  uniqueName: string;
  quantity: number = 1;
  rate: number = 0;
  sku?: string = '';
  stockUnitCode?: string;
}
