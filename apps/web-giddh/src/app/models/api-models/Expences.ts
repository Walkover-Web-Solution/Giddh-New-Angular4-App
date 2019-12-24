import { IClosingBalance, LedgerResponseDiscountClass } from './Ledger';
import { ILedgerTransactionItem, IVoucherItem } from '../interfaces/ledger.interface';
import { INameUniqueName } from './Inventory';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from './Sales';

export class PettyCashReportResponse {
	page: number;
	count: number;
	totalPages: number;
	totalItems: number;
	results: ExpenseResults[];
	size: number;
	fromDate: string;
	toDate: string;
	openingBalance: OpeningBalance;
	closingBalance: OpeningBalance;
	debitTotal: number;
	creditTotal: number;
}

export class OpeningBalance {
	amount: number;
	type: string;
}

export class ExpenseResults {
	entryDate: string;
	uniqueName: string;
	createdBy: CreatedBy;
	currencySymbol: string;
	amount: number;
	baseAccount: CreatedBy;
	baseAccountCategory?: string;
	particularAccount: CreatedBy;
	fileNames?: any;
	description: string;
	status: string;
	statusMessage?: any;
	entryType?: string;
}

export class CreatedBy {
	name: string;
	uniqueName: string;
}

export class ActionPettycashRequest {
	actionType: string;
	uniqueName: string;
	accountUniqueName: string;
}

export class ExpenseActionRequest {
	ledgerRequest?: LedgerRequest;
	message?: string;
}

export class LedgerRequest {
	transactions: Transaction[];
	entryDate: string;
	attachedFile: string;
	attachedFileName: string;
	description: string;
	generateInvoice: boolean;
	chequeNumber: string;
}

export class Transaction {
	amount: number;
	particular: string;
	type: string;
	taxes: any[];
	applyApplicableTaxes: boolean;
	isInclusiveTax: boolean;
	convertedAmount?: any;
}

export class PettyCashResonse {
	public attachedFile?: string;
	public description?: string;
	public entryDate: string;
	public attachedFileUniqueNames: string[];
	public transactions: ILedgerTransactionItem[];
	public uniqueName: string;
	public pettyCashEntryStatus: PettyCashEntryStatus;
	public ledgerUniqueNames: any[];
	public othersCategory: boolean = false;

	public chequeClearanceDate?: string;
	public chequeNumber?: string;
	public generateInvoice?: boolean;
	public invoiceGenerated?: boolean;
	public invoiceNumber?: string;
	public invoiceNumberAgainstVoucher: string;
	public tag?: string;
	public taxes?: string[];
	public total: IClosingBalance;
	public convertedTotal: IClosingBalance;
	public unconfirmedEntry?: boolean;
	public voucher?: IVoucherItem = { name: '', shortCode: '' };
	public voucherNo?: string;
	public voucherType?: string;
	public voucherNumber?: string;
	public tagNames?: string[];
	public voucherGenerated?: boolean;
	public voucherName?: string;
	public voucherGeneratedType?: string;
	public particular?: INameUniqueName;
	public particularType?: string;
	public actualAmount?: number;
	public invoicesToBePaid?: string[];
	public linkedInvoices?: string[];
	public warning?: string;
	public availItc?: boolean;
	public sendToGstr2?: boolean;
	public discounts: LedgerResponseDiscountClass[] = [];
	public tcsCalculationMethod?: SalesOtherTaxesCalculationMethodEnum;
	public isOtherTaxesApplicable?: boolean;
	public otherTaxModal?: SalesOtherTaxesModal;
	public otherTaxesSum?: number;
	public tdsTcsTaxesSum?: number;
	public cessSum?: number;
	public tcsTaxes?: string[];
	public tdsTaxes?: string[];
	public otherTaxType?: 'tcs' | 'tds';
	public exchangeRate?: number = 1;
	public exchangeRateForDisplay?: number = 1;
	public valuesInAccountCurrency?: boolean = false;
	public discountResources?: any[];
}

export class PettyCashEntryStatus {
	status: string;
	message?: any;
	updatedAt: string;
	updatedBy: UpdatedBy;
	entryType: string;
}

export class UpdatedBy {
	name: string;
	uniqueName: string;
}
