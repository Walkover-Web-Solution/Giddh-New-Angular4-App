import { ILedger, ILedgerTransactionItem, IInvoiceRequest, ITransactions, IClosingBalance, IForwardBalance, ITransactionItem, IReconcileTransaction, IVoucherItem } from '../interfaces/ledger.interface';

/*
 * Model for ledger create api request
 * POST call
 * API:: ( ledger create) company/:companyUniqueName/accounts/:accountUniqueName/ledgers
 * in tranasaction there is a field isStock
 * if isStock is true we have to send inventory object inside it please see IInventory interface
 * its response wil be array of LedgerResponse
 */
export class LedgerRequest implements ILedger {
  public transactions: ILedgerTransactionItem[];
  public voucherType: string;
  public entryDate: string;
  public taxes?: string[];
  public applyApplicableTaxes?: boolean;
  public isInclusiveTax?: boolean;
  public unconfirmedEntry?: boolean;
  public attachedFile?: string;
  public tag?: string;
  public description?: string;
  public generateInvoice?: boolean;
  public chequeNumber?: string;
  public clearanceDate?: string;
  public invoiceRequest?: IInvoiceRequest;
}

/*
 * Model for Create ledger api response
 * POST call
 * API:: ( Create ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers
 */
export class LedgerResponse {
  public transactions: IReconcileTransaction[];
  public total: IClosingBalance;
  public uniqueName: string;
  public voucherNo: number;
  public chequeClearanceDate?: string;
  public taxes: string[];
  public entryDate?: string;
  public invoiceNumber?: string;
  public invoiceGenerated: boolean;
  public attachedFileName?: string;
  public unconfirmedEntry: boolean;
  public voucher: IVoucherItem;
  public attachedFile?: string;
  public chequeNumber?: string;
  public tag?: string;
  public description?: string;
}

/*
 * Model for mail ledger api request
 * POST call
 * API:: ( mail ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/mail
 * its response will be success message in body
 */
export class MailLedgerRequest {
  public recipients: string[];
}

/*
 * Model for Download invoice api request
 * POST call
 * API:: ( Download invoice ) company/:companyUniqueName/accounts/:accountUniqueName/invoices/download
 * its response will be success message in body
 */
export class DownloadLedgerRequest {
  public invoiceNumber: string[];
}

/*
 * Model for Export Ledger api request
 * GET call
 * API:: ( Export Ledger ) company/:companyUniqueName/accounts/:accountUniqueName/export-ledger
 * you can also pass three query arameters parameters as
 * 1) from: this will be starting date
 * 2) ltype: layout type values [ 'admin-detailed', 'admin-condensed', view-detailed]
 * 3) to: this will be ending date
 * Reponse will be base 64 encoded string in body
 */

/*
 * Model for transactions api response
 * GET call
 * API:: ( transactions ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to
 * you can also pass query arameters parameters as
 * 1) from: this will be starting date
 * 2) count: number per page sent 15
 * 3) to: this will be ending date
 * 4) q: query
 * 5) reversePage: boolean
 * 6) sort= asc or desc
 * 7) page: number
 * Reponse will be hash containing TransactionsResponse
 */

export class TransactionsResponse implements ITransactions {
  public closingBalance: IClosingBalance;
  public count: number;
  public creditTotal: number;
  public creditTransactions: ITransactionItem[];
  public creditTransactionsCount: number;
  public debitTotal: number;
  public debitTransactions: ITransactionItem[];
  public debitTransactionsCount: number;
  public forwardedBalance: IForwardBalance;
  public page: number;
  public totalItems: number;
  public totalPages: number;
}
export class TransactionsRequest {
  public q: string = '';
  public page: number = 0;
  public count: number = 15;
  public accountUniqueName: string = '';
  public from: string = '';
  public to: string = '';
  public sort: string = 'asc';
  public reversePage: boolean = false;
}
export class ReconcileResponse {
  public transactions: IReconcileTransaction[];
  public total: object;
  public attachedFile: string;
  public invoiceGenerated: boolean;
  public attachedFileName?: string;
  public chequeNumber: string;
  public invoiceNumber: string;
  public entryDate: string;
  public taxes: string[];
}
