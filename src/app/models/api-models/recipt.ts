export interface Filter {
  accountUniqueName: string;
  voucherNumber: number;
  proformaNumber?: number;
  balanceDue?: number;
  dueDate: number;
  balanceMoreThan?: string;
  balanceLessThan?: string;
  dueDateBefore?: string;
  dueDateAfter?: string;
  dueDateEqual?: string;
  companyName?: string;
  groupUniqueName?: string;
  totalMoreThan?: number;
  totalLessThan?: number;
  totalEqual?: number;
  total: number;
  description: string;
}

export interface ReciptDeleteRequest {
  invoiceNumber: number;
  voucherType: string;
}

export class ReciptRequestParams {
  public page: number;
  public count: number;
  public from: string;
  public to: string;
  public type: string;
}

export interface Account {
  uniqueName: string;
  accountType?: any;
  name: string;
}

export interface Item {
  voucherNumber: string;
  account: Account;
  uniqueName: string;
  balanceStatus: string;
  voucherDate: string;
  grandTotal: number;
  balanceDue: number;
  dueDate: string;
}

export interface ReciptResponse {
  items: Item[];
  page: number;
  count: number;
  totalPages: number;
  totalItems: number;
}

export interface VoucherDetails {
  voucherNumber: string;
  voucherDate: string;
  balance: number;
  balanceStatus: string;
  totalAsWords: string;
  grandTotal: number;
  subTotal: number;
  totalDiscount: number;
}

export interface CompanyDetails {
  name: string;
  gstNumber: string;
  address: string[];
  stateCode: string;
  panNumber?: string;
}

export interface BillingDetails {
  gstNumber?: string;
  address: string[];
  stateCode: string;
  stateName: string;
  panNumber?: string;
}

export interface ShippingDetails {
  gstNumber?: string;
  address: string[];
  stateCode: string;
  stateName: string;
  panNumber?: string;
}

export interface AccountDetails {
  name: string;
  uniqueName: string;
  address: string[];
  attentionTo: string;
  email: string;
  mobileNumber: string;
  billingDetails: BillingDetails;
  shippingDetails: ShippingDetails;
}

export interface Other {
  message1: string;
  message2: string;
  shippingDate?: string;
  shippedVia?: string;
  trackingNumber?: string;
  customField1?: string;
  customField2?: string;
  customField3?: string;
  slogan?: string;
}

export interface TemplateDetails {
  logoPath: string;
  other: Other;
  templateUniqueName: string;
}

export interface Transaction {
  accountName: string;
  accountUniqueName: string;
  amount: number;
  hsnNumber: string;
  sacNumber?: string;
  description: string;
  quantity?: string;
  stockUnit: string;
  category: string;
  taxableValue: number;
  date?: any;
  isStockTxn?: string;
  stockDetails?: string;
  rate?: number;
}

export interface Entry {
  uniqueName: string;
  discounts: number[];
  taxes: number[];
  transactions: Transaction[];
  description: string;
  taxableValue: number;
  discountTotal: number;
  nonTaxableValue: number;
  entryDate: string;
  taxList: string[];
  voucherType: string;
  entryTotal: number;
}

export interface Voucher {
  voucherDetails: VoucherDetails;
  companyDetails: CompanyDetails;
  accountDetails: AccountDetails;
  templateDetails: TemplateDetails;
  entries: Entry[];
}

export interface ReciptRequest {
  entryUniqueNames: string[];
  updateAccountDetails: boolean;
  voucher: Voucher;
}
