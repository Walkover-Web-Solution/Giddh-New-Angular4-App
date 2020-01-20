import { InvoiceFilterClassForInvoicePreview } from './Invoice';
import { AmountClassMulticurrency } from "./Sales";

export class InvoiceReceiptFilter extends InvoiceFilterClassForInvoicePreview {

	public q: any;
	public sort: any;
	public sortBy: any;
	public isLastInvoicesRequest?: boolean = false;
}

export interface ReciptDeleteRequest {
	invoiceNumber: string;
	voucherType: string;
}

export class ReceiptVoucherDetailsRequest {
	public invoiceNumber: string;
	public voucherType: string;
}

export class ReciptRequestParams {
	public page: number;
	public count: number;
	public from: string;
	public to: string;
	public type: string;
}

export interface ReceiptAccount {
	uniqueName: string;
	accountType?: any;
	name: string;
	currency?: CurrencyClass;
}

export interface ReceiptItem {
	dueDays: number;
	voucherNumber: string;
	account: ReceiptAccount;
	uniqueName: string;
	balanceStatus: string;
	voucherDate: string;
	grandTotal: AmountClassMulticurrency;
	balanceDue: AmountClassMulticurrency;
	dueDate: string;
	isSelected?: boolean;
	cashInvoice: boolean;
	accountCurrencySymbol?: string;
}

export interface ReciptResponse {
	items: ReceiptItem[];
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
	taxesTotal?: {
		uniqueName?: string,
		name?: string,
		total?: number
	};
	customerName?: string;
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

export interface DownloadVoucherRequest {
	voucherNumber: string[];
	voucherType: string;
}
class CurrencyClass {
	public code: string;
}
