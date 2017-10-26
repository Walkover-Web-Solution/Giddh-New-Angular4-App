import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { IInvoiceTax } from './Invoice';

export interface IStockUnit {
  text: string;
  id: string;
}

/**
 * draw invoice on ui and api model related class and interface
*/
class CompanyClass {
  public name: string;
  public data: any[];
}

class SignatureClass {
  public name: string;
  public data: string;
  public path: string;
}

class InvoiceDetailsClass {
  public invoiceNumber: string;
  public invoiceDate: string;
  public dueDate: string;
}

class GstDetailsClass {
  public gstNumber?: any;
  public address: string[];
  public stateCode?: any;
  public panNumber?: any;
  constructor() {
    this.address = [];
  }
}

class AccountClass {
  public name: string;
  public uniqueName: string;
  public data: string[];
  public attentionTo: string;
  public email: string;
  public mobileNumber?: any;
  public billingDetails: GstDetailsClass;
  public shippingDetails: GstDetailsClass;
  constructor() {
    this.billingDetails = new GstDetailsClass();
    this.shippingDetails = new GstDetailsClass();
  }
}

class ICommonItemOfTransaction {
  public amount: number;
  public accountUniqueName: string;
  public accountName: string;
}

export class FakeDiscountItem {
  public amount: number;
  public particular: string;
  public name: string;
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
  public date: string;
  public taxableValue: number;
  public total?: number;
  public fakeAccForSelect2?: string;
  public isStockTxn?: boolean;
  public stockDetails?: any;
  public stockList?: IStockUnit[] = [];
  public applicableTaxes: string[] = [];
  public taxRenderData: string[] = [];
  constructor() {
    super();
    this.date = moment().format('DD-MM-YYYY');
    this.amount = 0;
    this.total = 0;
    this.isStockTxn = false;
    this.hsnOrSac = 'sac';
  }

  // basic check for valid transaction
  public isValid() {
    let r: any = true;
    if (this.taxableValue === 0) {
      r = 'Without Taxable sales-invoice can\'t be generated';
    }
    if (this.accountUniqueName) {
      if (_.isEmpty(this.accountUniqueName)) {
        r = 'Product/Service can\'t be empty';
      }
    }else {
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
    }else {
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
    }else {
      count = _.cloneDeep(this.getTaxableValue(entry));
    }
    return Number(count.toFixed(2));
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
      count = this.checkForInfinity((this.rate * this.quantity) - this.getTotalDiscount(entry.discounts));
    } else {
      count = this.checkForInfinity(this.amount - this.getTotalDiscount(entry.discounts));
    }
    return count;
  }

  /**
   * @return numeric value
   * @param discountArr collection of discount items
   */
  public getTotalDiscount(discountArr: ICommonItemOfTransaction[]) {
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
  public transactions: SalesTransactionItemClass[];
  public discounts: ICommonItemOfTransaction[];
  public taxes: IInvoiceTax[];
  public taxList?: string[];
  public description: string;
  public taxableValue: number;
  public entryTotal: number;
  constructor() {
    this.transactions = [new SalesTransactionItemClass()];
    this.taxes = [];
    this.taxList = [];
    this.discounts = [];
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
}

class OtherSalesItemClass {
  public shippingDate: string;
  public shippedVia: string;
  public trackingNumber: string;
  public customField1: string;
  public customField2: string;
  public customField3: string;
  constructor() {
    this.shippingDate = moment().format('DD-MM-YYYY');
  }
}

export class InvoiceFormClass {
  public logo: string;
  public company: CompanyClass;
  public customerName: string;
  public account: AccountClass;
  public signature: SignatureClass;
  public templateUniqueName: string;
  public roundOff: IRoundOff;
  public balanceStatus: string;
  public balanceStatusSealPath: string;
  public commonDiscounts: any[];
  public entries: SalesEntryClass[];
  public totalTaxableValue: number;
  public grandTotal: number;
  public balanceDue: number;
  public totalInWords?: any;
  public subTotal: number;
  public totalDiscount: number;
  public totaltaxBreakdown: ITotaltaxBreakdown[];
  public totalTax?: any;
  public invoiceDetails: InvoiceDetailsClass;
  public other?: OtherSalesItemClass;
  public country: CountryClass;
  constructor() {
    this.invoiceDetails = new InvoiceDetailsClass();
    this.totaltaxBreakdown = [new ITotaltaxBreakdown()];
    this.entries = [new SalesEntryClass()];
    this.commonDiscounts = [];
    this.roundOff = new IRoundOff();
    this.company = new CompanyClass();
    this.account = new AccountClass();
    this.signature = new SignatureClass();
    this.country = new CountryClass();
    this.other = new OtherSalesItemClass();
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
export interface GenerateSalesRequest {
  invoice: InvoiceFormClass;
  updateAccountDetails: boolean;
  paymentAction: IPaymentAction;
}
